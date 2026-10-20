/** Zeitangabe im Stil eines Wanderwegweisers: «2 h 30 min», «45 min». */
export function formatHours(hours: number | undefined | null): string | null {
  if (!hours || hours <= 0) return null;
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
}

export function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}
