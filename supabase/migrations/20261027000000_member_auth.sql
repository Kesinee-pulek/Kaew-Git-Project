-- Spec 001 (R1): members, registration guards, and login lockout.
--
-- Registration creates the Auth user, then the trigger below creates the matching
-- public.profiles row. The role is always LEARNER here (AU-09), so no client-supplied
-- metadata can grant admin rights. Employee rules (AU-05, AU-06) are enforced in the
-- database too, because the Auth API can be called without going through the app.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null unique check (email = lower(email)),
  member_type text not null check (member_type in ('EMPLOYEE', 'PUBLIC')),
  -- AU-05: employee ID and affiliation exist only for employees (AU-07 for public members).
  employee_id text unique check (employee_id ~ '^[0-9]{6}$'),
  affiliation text,
  role text not null default 'LEARNER' check (role in ('LEARNER', 'ADMIN')),
  pdpa_consented_at timestamptz not null,
  pdpa_version text not null,
  created_at timestamptz not null default now(),
  constraint profiles_employee_fields check (
    (member_type = 'EMPLOYEE') = (employee_id is not null)
    and (member_type = 'EMPLOYEE') = (affiliation is not null)
  ),
  -- AU-06 / BR-05: employees must use exactly @pea.co.th.
  constraint profiles_employee_email check (
    member_type = 'PUBLIC' or email like '%@pea.co.th'
  )
);

alter table public.profiles enable row level security;

-- Members read their own profile. There is no insert/update/delete policy, so clients
-- cannot change role, employee ID, or consent fields.
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Runs as the Auth user is inserted. Reads only known metadata keys and sets the server-owned fields itself.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_type text := new.raw_user_meta_data ->> 'member_type';
  v_is_employee boolean := v_member_type = 'EMPLOYEE';
begin
  insert into public.profiles (
    id, full_name, email, member_type, employee_id, affiliation,
    role, pdpa_consented_at, pdpa_version
  ) values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    lower(new.email),
    v_member_type,
    case when v_is_employee then new.raw_user_meta_data ->> 'employee_id' end,
    case when v_is_employee then new.raw_user_meta_data ->> 'affiliation' end,
    'LEARNER',
    now(),
    new.raw_user_meta_data ->> 'pdpa_version'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Pre-check used by the registration form (AU-02, AU-04 AU-10). Returns which values are
-- taken, so the form can show the matching field error. Email is compared case-insensitively.
create function public.registration_conflicts(p_email text, p_employee_id text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'email_taken', exists (
      select 1 from auth.users where lower(email) = lower(trim(p_email))
    ),
    'employee_id_taken', p_employee_id is not null and exists (
      select 1 from public.profiles where employee_id = p_employee_id
    )
  );
$$;

-- Lockout state, one row per normalized email. RLS is on with no policies, so only the
-- functions below can read or write it. Rows are kept for unknown emails too, so
-- the response does not reveal whether an account exists (AU-12).
create table public.login_attempts (
  email text primary key,
  failed_count integer not null default 0 check (failed_count >= 0),
  locked_until timestamptz
);

alter table public.login_attempts enable row level security;

-- Returns when the lock ends, or null when the email is not locked (AU-13).
create function public.login_lock_status(p_email text)
returns timestamptz
language sql
stable
security definer
set search_path = ''
as $$
  select locked_until
  from public.login_attempts
  where email = lower(trim(p_email))
    and locked_until > now();
$$;

-- Records one wrong password. Returns the lock end when this attempt locks the account,
-- otherwise null. Failures during an active lock are ignored (AU-13). Once a lock has
-- expired, the counter restarts from zero (AU-14). Five wrong passwords lock for 15 minutes (BR-06).
create function public.login_record_failure(p_email text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_row public.login_attempts%rowtype;
  v_count integer;
  v_locked_until timestamptz;
begin
  insert into public.login_attempts (email) values (v_email)
  on conflict (email) do nothing;

  select * into v_row
  from public.login_attempts
  where email = v_email
  for update;

  if v_row.locked_until is not null and v_row.locked_until > now() then
    return v_row.locked_until;
  end if;

  v_count := case when v_row.locked_until is not null then 0 else v_row.failed_count end;
  v_count := v_count + 1;

  if v_count >= 5 then
    v_locked_until := now() + interval '15 minutes';
    update public.login_attempts
    set failed_count = 0, locked_until = v_locked_until
    where email = v_email;
    return v_locked_until;
  end if;

  update public.login_attempts
  set failed_count = v_count, locked_until = null
  where email = v_email;
  return null;
end;
$$;

-- Clears the caller's own counter after a successful login (AU-14). Takes no email argument
-- and needs a session, so an anonymous caller cannot reset another account's lock.
create function public.login_clear_failures()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.login_attempts
  where email = (select lower(email) from auth.users where id = auth.uid());
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.registration_conflicts(text, text) from public;
revoke execute on function public.login_lock_status(text) from public;
revoke execute on function public.login_record_failure(text) from public;
revoke execute on function public.login_clear_failures() from public;

grant execute on function public.registration_conflicts(text, text) to anon, authenticated;
grant execute on function public.login_lock_status(text) to anon, authenticated;
grant execute on function public.login_record_failure(text) to anon, authenticated;
grant execute on function public.login_clear_failures() to authenticated;
