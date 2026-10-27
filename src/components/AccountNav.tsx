import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { getCurrentMember } from "@/lib/auth/session";

/** Sign-in state in the header: "เข้าสู่ระบบ / สมัครสมาชิก" when signed out, the name and sign-out when signed in (spec 001 §3.3). */
export default async function AccountNav({ variant }: { variant: "desktop" | "mobile" }) {
  const member = await getCurrentMember();
  const desktop = variant === "desktop";

  if (desktop) {
    return (
      <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
        {member ? (
          <>
            <span className="text-foreground/70">{member.fullName}</span>
            <form action={logoutAction}>
              <button type="submit" className="transition-colors hover:text-brand">
                ออกจากระบบ
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="transition-colors hover:text-brand">
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-brand px-4 py-1.5 text-white transition-colors hover:bg-brand/90"
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col border-t border-black/10 pt-2 text-sm dark:border-white/10">
      {member ? (
        <>
          <p className="px-3 py-2 text-foreground/70">{member.fullName}</p>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded-md px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10">
              ออกจากระบบ
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login" className="rounded-md px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="rounded-md px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">
            สมัครสมาชิก
          </Link>
        </>
      )}
    </div>
  );
}
