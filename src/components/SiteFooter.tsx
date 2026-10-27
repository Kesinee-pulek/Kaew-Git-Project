import Link from "next/link";
import PeaLogo from "@/components/PeaLogo";
import { navLinks } from "@/components/navLinks";
import { aboutContent } from "@/content/about";
import { formatThaiPhone } from "@/lib/format";

export default function SiteFooter() {
  const { contact } = aboutContent;

  return (
    <footer
      id="contact"
      className="border-t border-black/10 bg-black/[.03] dark:border-white/10 dark:bg-white/[.03]"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <PeaLogo />
            <p className="font-bold leading-tight">
              ศูนย์อบรมออนไลน์
              <br />
              การไฟฟ้าส่วนภูมิภาค
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-foreground/70">
            หลักสูตรอบรมออนไลน์ผ่านวิดีโอสำหรับพนักงาน กฟภ. และบุคคลทั่วไป
            เรียนได้ทุกที่ ไม่มีค่าใช้จ่าย พร้อมใบประกาศนียบัตรที่ตรวจสอบได้
          </p>
        </div>

        <div>
          <p className="font-semibold">ลิงก์ด่วน</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            {navLinks
              .filter((link) => link.href !== "#contact")
              .map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">ติดต่อเรา</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>{contact.address}</li>
            <li>
              โทร:{" "}
              <a href={`tel:${contact.phone}`} className="hover:text-brand">
                {formatThaiPhone(contact.phone)}
              </a>
            </li>
            <li>
              อีเมล:{" "}
              <a href={`mailto:${contact.email}`} className="hover:text-brand">
                {contact.email}
              </a>
            </li>
            <li>เวลาทำการ: {contact.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/10 py-4 text-center text-xs text-foreground/60 dark:border-white/10">
        © 2569 การไฟฟ้าส่วนภูมิภาค · ข้อมูลในเว็บไซต์นี้เป็นข้อมูลจำลอง
      </div>
    </footer>
  );
}
