export interface Period {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  milestone: string;
}

export type DerivePeriodResult =
  | { ok: true; period: Period }
  | { ok: false; reason: string };

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function derivePeriod(date: string): DerivePeriodResult {
  const match = DATE_PATTERN.exec(date.trim());
  if (!match) {
    return { ok: false, reason: `Data inválida: "${date}"` };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return { ok: false, reason: `Data inválida: "${date}"` };
  }

  const quarter = Math.ceil(month / 3) as 1 | 2 | 3 | 4;
  return { ok: true, period: { year, quarter, milestone: `${year}-Q${quarter}` } };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
