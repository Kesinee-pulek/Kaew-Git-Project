import CategoryChart from "@/components/CategoryChart";
import {
  formatDuration,
  formatNumber,
  formatThaiDate,
  formatThaiShortDate,
} from "@/lib/format";
import { getTrainingOverview, type Registration } from "@/lib/training";

const heroHighlights = [
  { icon: "🎓", title: "เรียนฟรี", description: "ทุกหลักสูตรไม่มีค่าใช้จ่าย" },
  { icon: "▶️", title: "เรียนผ่านวิดีโอ", description: "เรียนได้ทุกที่ ทุกเวลา เล่นต่อจากที่ค้างไว้" },
  { icon: "📜", title: "ใบประกาศนียบัตร", description: "ตรวจสอบความถูกต้องได้ด้วย QR code" },
];

const steps = [
  { title: "สมัครสมาชิก", description: "พนักงาน กฟภ. หรือบุคคลภายนอก ใช้อีเมลสมัครได้ทันที" },
  { title: "ลงทะเบียนหลักสูตร", description: "เลือกหลักสูตรที่สนใจแล้วส่งคำขอลงทะเบียน" },
  { title: "รอการอนุมัติ", description: "เจ้าหน้าที่ศูนย์อบรมพิจารณาและแจ้งผลทางอีเมล" },
  { title: "เรียนและทำแบบทดสอบ", description: "เรียนวิดีโอให้ครบภายใน 60 วัน แล้วทำแบบทดสอบหลังเรียน" },
  { title: "รับใบประกาศนียบัตร", description: "สอบผ่านแล้วดาวน์โหลดใบประกาศได้ทันที" },
];

function RegistrationBadge({ registration }: { registration: Registration }) {
  switch (registration.status) {
    case "OPEN":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
          <span aria-hidden="true">●</span>
          เปิดรับสมัครถึง {formatThaiShortDate(registration.closeAt)}
        </span>
      );
    case "UPCOMING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
          <span aria-hidden="true">◷</span>
          เปิดรับสมัคร {formatThaiShortDate(registration.openAt)}
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-foreground/60 dark:bg-white/10">
          <span aria-hidden="true">○</span>
          ปิดรับสมัครแล้ว
        </span>
      );
  }
}

export default async function Home() {
  const { stats, categories, popularCourses } = await getTrainingOverview();
  const asOf = `ข้อมูล ณ ${formatThaiDate(stats.asOf)}`;

  const statTiles = [
    {
      label: "จำนวนหลักสูตร",
      value: formatNumber(stats.courses),
      unit: "หลักสูตร",
      note: `เปิดรับสมัครอยู่ ${formatNumber(stats.openCourses)} หลักสูตร`,
    },
    {
      label: "ผู้เข้าอบรมทั้งหมด",
      value: formatNumber(stats.trainees),
      unit: "คน",
      note: `พนักงาน กฟภ. ${formatNumber(stats.employeeTrainees)} · บุคคลภายนอก ${formatNumber(stats.publicTrainees)}`,
    },
    {
      label: "ผู้ได้รับใบประกาศนียบัตร",
      value: formatNumber(stats.certificates),
      unit: "คน",
      note: "เรียนครบและสอบผ่านตามเกณฑ์",
    },
    {
      label: "ชั่วโมงอบรมรวม",
      value: formatNumber(stats.trainingHours),
      unit: "ชั่วโมง",
      note: "นับจากผู้เรียนที่เรียนจบหลักสูตร",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-pea-900 via-pea-700 to-pea-500 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-32 pt-20 sm:px-6 lg:grid-cols-[3fr_2fr] lg:items-center">
          <div>
            <p className="text-sm font-medium tracking-wide text-pea-gold">
              ศูนย์อบรมออนไลน์ การไฟฟ้าส่วนภูมิภาค
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              พัฒนาทักษะงานไฟฟ้า
              <br />
              เรียนได้ทุกที่ ทุกเวลา
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
              รวมหลักสูตรอบรมออนไลน์ด้านความปลอดภัย วิศวกรรมไฟฟ้า ดิจิทัล
              และการบริการ สำหรับพนักงาน กฟภ. และบุคคลทั่วไป
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#courses"
                className="inline-flex h-12 items-center rounded-full bg-pea-gold px-6 font-semibold text-pea-900 transition-colors hover:bg-amber-300"
              >
                ดูหลักสูตรยอดนิยม →
              </a>
              <a
                href="#how"
                className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 font-semibold transition-colors hover:bg-white/10"
              >
                ขั้นตอนการเรียน
              </a>
            </div>
          </div>

          <ul className="space-y-4">
            {heroHighlights.map((item) => (
              <li
                key={item.title}
                className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur"
              >
                <span aria-hidden="true" className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/80">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="stats" className="mx-auto -mt-20 max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-black/10 bg-background p-6 shadow-xl sm:p-8 dark:border-white/10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold sm:text-3xl">ผลการดำเนินงาน</h2>
            <p className="text-sm text-foreground/60">{asOf}</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-2xl border border-black/10 p-5 dark:border-white/10"
              >
                <p className="text-sm font-medium text-foreground/70">{tile.label}</p>
                <p className="mt-2 text-4xl font-semibold">
                  {tile.value}
                  <span className="ml-2 text-base font-medium text-foreground/60">
                    {tile.unit}
                  </span>
                </p>
                <p className="mt-2 text-sm text-foreground/60">{tile.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">ผู้เข้าอบรมแยกตามหมวดหลักสูตร</h2>
        <p className="mt-2 text-foreground/70">
          {categories.length} หมวด รวม {formatNumber(stats.courses)} หลักสูตร
        </p>
        <div className="mt-8">
          <CategoryChart
            categories={categories}
            totalTrainees={stats.trainees}
            caption={`จำนวนผู้เข้าอบรมสะสม (คน) · ${asOf}`}
          />
        </div>
      </section>

      <section id="courses" className="bg-black/[.03] dark:bg-white/[.03]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">หลักสูตรยอดนิยม</h2>
          <p className="mt-2 text-foreground/70">เรียงตามจำนวนผู้เข้าอบรม</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularCourses.map((course) => (
              <article
                key={course.code}
                className="flex flex-col rounded-2xl border border-black/10 bg-background p-6 transition-shadow hover:shadow-lg dark:border-white/10"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                    {course.category}
                  </span>
                  {course.audience === "EMPLOYEE_ONLY" && (
                    <span className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium text-foreground/70 dark:border-white/20">
                      เฉพาะพนักงาน กฟภ.
                    </span>
                  )}
                </div>
                <p className="mt-4 font-mono text-xs text-foreground/60">{course.code}</p>
                <h3 className="mt-1 text-lg font-semibold leading-snug">{course.title}</h3>
                <dl className="mt-4 flex gap-6 text-sm text-foreground/70">
                  <div>
                    <dt className="sr-only">ชั่วโมงอบรม</dt>
                    <dd>⏱ {formatDuration(course.durationMinutes)}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">ผู้เข้าอบรม</dt>
                    <dd>👥 {formatNumber(course.trainees)} คน</dd>
                  </div>
                </dl>
                <div className="mt-auto pt-6">
                  <RegistrationBadge registration={course.registration} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">ขั้นตอนการเรียน</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 lg:flex-col">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pea-700 font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-foreground/70">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
