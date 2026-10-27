const numberFormat = new Intl.NumberFormat("th-TH");

const longDate = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "long",
  timeZone: "Asia/Bangkok",
});

const shortDate = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeZone: "Asia/Bangkok",
});

/** 12500 → "12,500" */
export function formatNumber(value: number) {
  return numberFormat.format(value);
}

// Dates are stored as YYYY-MM-DD in Thai time; pin the offset so the day never shifts.
function parseThaiDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00+07:00`);
}

/** "2026-09-30" → "30 กันยายน 2569" */
export function formatThaiDate(isoDate: string) {
  return longDate.format(parseThaiDate(isoDate));
}

/** "2026-11-15" → "15 พ.ย. 2569" */
export function formatThaiShortDate(isoDate: string) {
  return shortDate.format(parseThaiDate(isoDate));
}

/** 205 → "3 ชม. 25 นาที" */
export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} นาที`;
  return rest === 0 ? `${hours} ชม.` : `${hours} ชม. ${rest} นาที`;
}
