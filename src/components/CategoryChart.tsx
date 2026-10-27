import type { CourseCategory } from "@/lib/training";
import { formatNumber } from "@/lib/format";

type Props = {
  categories: CourseCategory[];
  totalTrainees: number;
  caption: string;
};

// Horizontal bar chart in plain HTML: one series, so one hue and no legend box.
export default function CategoryChart({ categories, totalTrainees, caption }: Props) {
  const rows = [...categories]
    .sort((a, b) => b.trainees - a.trainees)
    .map((category) => ({
      ...category,
      share: totalTrainees > 0 ? (category.trainees / totalTrainees) * 100 : 0,
    }));
  const max = rows[0]?.trainees ?? 0;

  return (
    <figure className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <figcaption className="text-sm text-foreground/60">{caption}</figcaption>

      <ul className="mt-6 space-y-5">
        {rows.map((row) => (
          <li
            key={row.name}
            className="group relative grid gap-2 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-4"
          >
            <div>
              <p className="text-sm font-medium">{row.name}</p>
              <p className="text-xs text-foreground/60">
                {row.courseCount} หลักสูตร
              </p>
            </div>

            <div className="flex h-8 items-center gap-3 border-l border-black/20 dark:border-white/20">
              <div
                className="h-5 min-w-1 rounded-r-[4px] bg-chart-bar transition-opacity group-hover:opacity-80"
                style={{ width: `calc(${max > 0 ? (row.trainees / max) * 100 : 0}% - 4.5rem)` }}
              />
              <span className="text-sm font-semibold">{formatNumber(row.trainees)}</span>
            </div>

            <div
              role="presentation"
              className="pointer-events-none absolute right-0 top-0 z-10 hidden -translate-y-full rounded-lg border border-black/10 bg-background px-3 py-2 text-xs shadow-lg group-hover:block dark:border-white/10"
            >
              <p className="font-semibold">{row.name}</p>
              <p className="text-foreground/70">
                {formatNumber(row.trainees)} คน · {row.share.toFixed(1)}% ของผู้เข้าอบรมทั้งหมด
              </p>
            </div>
          </li>
        ))}
      </ul>

      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-foreground/70 hover:text-brand">
          ดูข้อมูลเป็นตาราง
        </summary>
        <table className="mt-3 w-full text-left tabular-nums">
          <thead className="text-foreground/60">
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 font-medium">หมวด</th>
              <th className="py-2 text-right font-medium">หลักสูตร</th>
              <th className="py-2 text-right font-medium">ผู้เข้าอบรม (คน)</th>
              <th className="py-2 text-right font-medium">สัดส่วน</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2">{row.name}</td>
                <td className="py-2 text-right">{row.courseCount}</td>
                <td className="py-2 text-right">{formatNumber(row.trainees)}</td>
                <td className="py-2 text-right">{row.share.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
