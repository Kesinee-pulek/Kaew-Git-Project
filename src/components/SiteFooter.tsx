export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-black/10 bg-black/[.03] dark:border-white/10 dark:bg-white/[.03]"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">
            <span className="text-brand">Chengdu</span> Travel 🐼
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground/70">
            คู่มือท่องเที่ยวเฉิงตู มณฑลเสฉวน ประเทศจีน รวมสถานที่เที่ยว อาหาร และวัฒนธรรมท้องถิ่น
          </p>
        </div>

        <div>
          <p className="font-semibold">ลิงก์ด่วน</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li><a href="#stats" className="hover:text-brand">ข้อมูลเมือง</a></li>
            <li><a href="#attractions" className="hover:text-brand">สถานที่ท่องเที่ยว</a></li>
            <li><a href="#highlights" className="hover:text-brand">อาหารและวัฒนธรรม</a></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">ติดต่อเรา</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>อีเมล: hello@chengdu-travel.example</li>
            <li>โทร: 02-123-4567</li>
            <li>เวลาทำการ: จันทร์–ศุกร์ 09:00–18:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/10 py-4 text-center text-xs text-foreground/60 dark:border-white/10">
        © 2026 Chengdu Travel · ข้อมูลในเว็บไซต์นี้เป็นข้อมูลจำลอง
      </div>
    </footer>
  );
}
