import type { HiddenCostItem, HiddenCostsState } from "./types";

/**
 * "Калькулятор скрытых расходов" (project section 6, item 1): a checklist of
 * costs travelers typically forget to budget for before buying tickets.
 * Suggested amounts are rough per-family (3 people) estimates the user is
 * meant to adjust; they intentionally start unchecked so the total only
 * grows when the user actively confirms an item applies to their trip.
 */
export const hiddenCostItems: HiddenCostItem[] = [
  { id: "transfer", label: "Трансфер до вокзала/аэропорта", suggestedAmount: 1500 },
  { id: "airportFood", label: "Питание в дороге/аэропорту", suggestedAmount: 1500 },
  { id: "luggage", label: "Платный багаж", suggestedAmount: 3000 },
  { id: "connectivity", label: "Связь и роуминг", suggestedAmount: 1000 },
  { id: "resortFee", label: "Курортный сбор", suggestedAmount: 500 },
];

export function createInitialHiddenCostsState(): HiddenCostsState {
  return Object.fromEntries(
    hiddenCostItems.map((item) => [item.id, { enabled: false, amount: item.suggestedAmount }]),
  );
}

export function sumHiddenCosts(state: HiddenCostsState): number {
  return Object.values(state).reduce((sum, entry) => sum + (entry.enabled ? entry.amount : 0), 0);
}
