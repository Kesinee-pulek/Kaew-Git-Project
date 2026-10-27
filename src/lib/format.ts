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

const gregorianYear = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "Asia/Bangkok",
});

/** Buddhist Era year of `date` in Thai time: 2026-12-31T17:00:00Z → 2570 */
export function thaiBuddhistYear(date: Date) {
  return Number(gregorianYear.format(date)) + 543;
}

/** Digits only → display form: "021234567" → "02-123-4567", "0812345678" → "081-234-5678" */
export function formatThaiPhone(digits: string) {
  if (digits.length === 9 && digits.startsWith("02")) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  if (digits.length === 9 || digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

/** 205 → "3 ชม. 25 นาที" */
export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} นาที`;
  return rest === 0 ? `${hours} ชม.` : `${hours} ชม. ${rest} นาที`;
}
