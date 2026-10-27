import type { Metadata } from "next";
import { PDPA_POLICY_VERSION } from "@/content/member";

export const metadata: Metadata = {
  title: "นโยบายคุ้มครองข้อมูลส่วนบุคคล",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">นโยบายคุ้มครองข้อมูลส่วนบุคคล</h1>
      <p className="mt-3 text-sm text-foreground/60">ฉบับ {PDPA_POLICY_VERSION} (ฉบับร่าง)</p>
      <p className="mt-6 leading-7">
        ข้อความฉบับจริงยังรอการอนุมัติจากศูนย์อบรม ระบบเก็บชื่อ อีเมล และรหัสพนักงาน (สำหรับพนักงาน กฟภ.) เพื่อการอบรมเท่านั้น
      </p>
    </section>
  );
}
