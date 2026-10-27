import PeaLogo from "@/components/PeaLogo";

export default function SiteFooter() {
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
            <li><a href="#stats" className="hover:text-brand">ผลการดำเนินงาน</a></li>
            <li><a href="#categories" className="hover:text-brand">หมวดหลักสูตร</a></li>
            <li><a href="#courses" className="hover:text-brand">หลักสูตรยอดนิยม</a></li>
            <li><a href="#how" className="hover:text-brand">ขั้นตอนการเรียน</a></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">ติดต่อเรา</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>200 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900</li>
            <li>
              โทร:{" "}
              <a href="tel:021234567" className="hover:text-brand">
                02-123-4567
              </a>
            </li>
            <li>
              อีเมล:{" "}
              <a href="mailto:training@example.com" className="hover:text-brand">
                training@example.com
              </a>
            </li>
            <li>เวลาทำการ: จันทร์–ศุกร์ 08:30–16:30</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/10 py-4 text-center text-xs text-foreground/60 dark:border-white/10">
        © 2569 การไฟฟ้าส่วนภูมิภาค · ข้อมูลในเว็บไซต์นี้เป็นข้อมูลจำลอง
      </div>
    </footer>
  );
}
