import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentMember } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/validation";

export const metadata: Metadata = {
  title: "สมัครสมาชิก",
};

async function RegisterGate({ searchParams }: { searchParams: PageProps<"/register">["searchParams"] }) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);

  // AU-17: a signed-in member does not see the sign-up form again.
  if (await getCurrentMember()) redirect(next);

  return <RegisterForm next={next} />;
}

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">สมัครสมาชิก</h1>
      <p className="mt-3 text-foreground/70">ใช้เวลาไม่ถึง 2 นาที</p>
      <Suspense fallback={<p className="mt-8 text-foreground/60">กำลังโหลด…</p>}>
        <RegisterGate searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
