import { getChengduOverview } from "@/lib/chengdu";

export default async function Home() {
  const { stats, attractions, highlights } = await getChengduOverview();

  return (
    <>
      <section className="bg-gradient-to-br from-green-800 via-green-600 to-emerald-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">
            มณฑลเสฉวน · ประเทศจีน
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            เมืองแพนด้า อากาศดี มีหม้อไฟ 🐼🍲
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
            สัมผัสเมืองเก่าแก่กว่า 2,000 ปี ที่ผสมผสานธรรมชาติ ประวัติศาสตร์ และอาหารรสจัดจ้านไว้ในที่เดียว
          </p>
          <a
            href="#attractions"
            className="mt-10 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-green-800 transition-colors hover:bg-green-50"
          >
            ดูสถานที่ท่องเที่ยว →
          </a>
        </div>
      </section>

      <section id="stats" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">เฉิงตูในตัวเลข</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <p className="text-4xl font-bold text-brand">
                {stat.value}
                {stat.unit && (
                  <span className="ml-2 text-base font-medium text-foreground/70">
                    {stat.unit}
                  </span>
                )}
              </p>
              <p className="mt-2 font-medium">{stat.label}</p>
              {stat.note && (
                <p className="mt-1 text-sm text-foreground/60">{stat.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="attractions" className="bg-black/[.03] dark:bg-white/[.03]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">สถานที่ท่องเที่ยวยอดนิยม</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attractions.map((place) => (
              <article
                key={place.name}
                className="rounded-2xl border border-black/10 bg-background p-6 transition-shadow hover:shadow-lg dark:border-white/10"
              >
                <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-6xl dark:from-green-950 dark:to-emerald-950">
                  {place.emoji}
                </div>
                <span className="mt-4 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  {place.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{place.name}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  {place.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="highlights" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">อาหารและวัฒนธรรม</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-foreground/70">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
