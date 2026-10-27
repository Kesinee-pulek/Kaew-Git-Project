import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentMember } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/validation";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
};

async function LoginGate({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);

  // AU-17: a signed-in member goes straight to the page they asked for.
  if (await getCurrentMember()) redirect(next);

  return <LoginForm next={next} />;
}

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">เข้าสู่ระบบ</h1>
      <Suspense fallback={<p className="mt-8 text-foreground/60">กำลังโหลด…</p>}>
        <LoginGate searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
