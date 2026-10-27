import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { aboutContent } from "@/content/about";
import { yearsInOperation } from "@/lib/about";
import { formatNumber, formatThaiDate, formatThaiPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: aboutContent.hero.description,
};

// Computed at prerender and refreshed daily, so the count rolls over within a day of New Year.
async function getYearsInOperation(foundedYear: number) {
  "use cache";
  cacheLife("days");
  return yearsInOperation(foundedYear, new Date());
}

export default async function AboutPage() {
  const { name, hero, vision, missions, benefits, stats, contact } = aboutContent;
  const years = await getYearsInOperation(stats.foundedYear);

  const statTiles = [
    { id: "years", label: "ปีที่ดำเนินงาน", value: formatNumber(years), unit: "ปี", note: `ก่อตั้งเมื่อ พ.ศ. ${stats.foundedYear}` },
    { id: "courses", label: "จำนวนหลักสูตร", value: formatNumber(stats.courses), unit: "หลักสูตร" },
    { id: "learners", label: "ผู้เรียน", value: formatNumber(stats.learners), unit: "คน" },
    { id: "certificates", label: "ใบประกาศที่ออก", value: formatNumber(stats.certificates), unit: "ใบ" },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-pea-900 via-pea-700 to-pea-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-pea-gold">เกี่ยวกับเรา</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-balance sm:text-5xl">
            {name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
            {hero.description}
          </p>
          <Link
            href="/courses"
            className="mt-10 inline-flex h-12 items-center rounded-full bg-pea-gold px-6 font-semibold text-pea-900 transition-colors hover:bg-amber-300"
          >
            ดูหลักสูตรทั้งหมด →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">พันธกิจและวิสัยทัศน์</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-brand/10 p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-brand">วิสัยทัศน์</h3>
            <p className="mt-3 text-xl font-semibold leading-relaxed">{vision}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand">พันธกิจ</h3>
            <ol className="mt-3 space-y-4">
              {missions.map((mission, index) => (
                <li key={mission} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pea-700 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-7">{mission}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-black/[.03] dark:bg-white/[.03]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">สิ่งที่ผู้เรียนได้รับ</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                data-testid="benefit-card"
                className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10"
              >
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold sm:text-3xl">ผลการดำเนินงาน</h2>
          <p data-testid="stats-as-of" className="text-sm text-foreground/60">
            ข้อมูล ณ {formatThaiDate(stats.asOf)}
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statTiles.map((tile) => (
            <div
              key={tile.id}
              className="rounded-2xl border border-black/10 p-5 dark:border-white/10"
            >
              <p className="text-sm font-medium text-foreground/70">{tile.label}</p>
              <p className="mt-2 text-4xl font-semibold">
                <span data-testid={`stat-${tile.id}`}>{tile.value}</span>
                <span className="ml-2 text-base font-medium text-foreground/60">
                  {tile.unit}
                </span>
              </p>
              {tile.note && <p className="mt-2 text-sm text-foreground/60">{tile.note}</p>}
            </div>
          ))}
        </div>
      </section>

      <section
        data-testid="about-contact"
        className="mx-auto max-w-6xl px-4 pb-20 sm:px-6"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">ติดต่อเรา</h2>
        <dl className="mt-8 grid gap-6 rounded-2xl border border-black/10 p-6 sm:grid-cols-2 sm:p-8 dark:border-white/10">
          <div>
            <dt className="text-sm font-medium text-foreground/60">ที่อยู่</dt>
            <dd className="mt-1">{contact.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-foreground/60">โทรศัพท์</dt>
            <dd className="mt-1">
              <a href={`tel:${contact.phone}`} className="font-medium text-brand hover:underline">
                {formatThaiPhone(contact.phone)}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-foreground/60">อีเมล</dt>
            <dd className="mt-1">
              <a href={`mailto:${contact.email}`} className="font-medium text-brand hover:underline">
                {contact.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-foreground/60">เวลาทำการ</dt>
            <dd className="mt-1">{contact.hours}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
