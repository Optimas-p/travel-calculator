import type { DestinationResult } from "./types";

/**
 * Matches the project's own hypothesis (section 1): the cheapest option is
 * not automatically optimal once travel-time cost is accounted for. A
 * destination only competes on price once its K_t clears this bar; below it,
 * the trip spends "too much" of its 7-14 days on logistics to count as
 * comparable rest.
 */
const COMFORT_THRESHOLD = 0.8;

export interface Recommendation {
  result: DestinationResult;
  reason: string;
}

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function formatRub(value: number): string {
  return rubFormatter.format(value);
}

function formatPercent(kt: number): string {
  return `${Math.round(kt * 100)}%`;
}

function cheapestByRestDay(results: DestinationResult[]): DestinationResult {
  return results.reduce((min, r) => (r.costPerRestDay < min.costPerRestDay ? r : min));
}

/**
 * Picks the destination with the lowest cost-per-rest-day among those with
 * an "acceptable" time-efficiency (K_t >= COMFORT_THRESHOLD); falls back to
 * all results if none clear that bar (e.g. every option is a short trip).
 * Returns a human-readable justification built from the current numbers, so
 * it re-explains itself whenever trip length, auto params, or hidden costs
 * change the underlying results.
 */
export function pickRecommendation(results: DestinationResult[]): Recommendation {
  const comfortable = results.filter((r) => r.kt >= COMFORT_THRESHOLD);
  const pool = comfortable.length > 0 ? comfortable : results;
  const best = cheapestByRestDay(pool);

  const cheapestOverall = cheapestByRestDay(results);
  const others = results.filter((r) => r.destination.id !== best.destination.id);
  const avgOthersCostPerDay =
    others.length > 0 ? others.reduce((sum, r) => sum + r.costPerRestDay, 0) / others.length : 0;
  const savingsPercent =
    avgOthersCostPerDay > 0
      ? Math.round(((avgOthersCostPerDay - best.costPerRestDay) / avgOthersCostPerDay) * 100)
      : 0;

  const isCheapestOverall = cheapestOverall.destination.id === best.destination.id;

  const reason = isCheapestOverall
    ? `При текущих параметрах ${best.destination.name} — самый выгодный день отдыха (${formatRub(best.costPerRestDay)}/день) среди направлений с приемлемой долей активного отдыха (K_t ${formatPercent(best.kt)}, порог ${formatPercent(COMFORT_THRESHOLD)}). Это ${Math.max(savingsPercent, 0)}% дешевле среднего по остальным вариантам.`
    : `${cheapestOverall.destination.name} дешевле по дню отдыха, но её K_t всего ${formatPercent(cheapestOverall.kt)} — слишком много времени уходит на дорогу при такой длительности поездки. ${best.destination.name} даёт лучший баланс: K_t ${formatPercent(best.kt)} при ${formatRub(best.costPerRestDay)}/день (на ${Math.max(savingsPercent, 0)}% дешевле среднего по остальным вариантам).`;

  return { result: best, reason };
}
