import type { HiddenCostItem, HiddenCostsState } from "./types";

/**
 * "Калькулятор скрытых расходов" (project section 6, item 1): a checklist of
 * costs travelers typically forget to budget for before buying tickets.
 * Each item's suggested amount is a per-unit estimate (see unitNote/helpText)
 * that the UI multiplies by round-trip and/or head-count as applicable —
 * these aren't flat guesses, they mirror how each cost actually scales.
 */
export const hiddenCostItems: HiddenCostItem[] = [
  {
    id: "transfer",
    label: "Трансфер до вокзала/аэропорта",
    suggestedAmount: 1500,
    unitNote: "за поездку в одну сторону, на всю группу",
    helpText:
      "Такси или шаттл обычно заказывают один на всю группу — сумма не умножается на число человек. Включите «туда и обратно», если нужен трансфер и по прибытии, и на обратную дорогу.",
    supportsRoundTrip: true,
    supportsCount: false,
  },
  {
    id: "airportFood",
    label: "Питание в дороге/аэропорту",
    suggestedAmount: 500,
    unitNote: "за человека, в одну сторону",
    helpText:
      "Перекус или обед на одного человека на одном перелёте/переезде. Умножается на число людей и, при включённом «туда и обратно», ещё на 2.",
    supportsRoundTrip: true,
    supportsCount: true,
    countLabel: "Человек",
    countDefault: 3,
  },
  {
    id: "luggage",
    label: "Платный багаж",
    suggestedAmount: 3000,
    unitNote: "за одно место багажа, за одно направление",
    helpText:
      "У части авиакомпаний багаж оплачивается отдельно на каждом плече перелёта — включите «туда и обратно», если это ваш тариф. Число мест по умолчанию равно числу пассажиров (один чемодан на человека), но его можно изменить.",
    supportsRoundTrip: true,
    supportsCount: true,
    countLabel: "Мест багажа",
    countDefault: 3,
  },
  {
    id: "connectivity",
    label: "Связь и роуминг",
    suggestedAmount: 1000,
    unitNote: "за человека, на всю поездку",
    helpText:
      "Пакет связи или роуминга на одного человека на весь срок поездки — не зависит от того, в одну сторону дорога или туда-обратно.",
    supportsRoundTrip: false,
    supportsCount: true,
    countLabel: "Человек",
    countDefault: 3,
  },
  {
    id: "resortFee",
    label: "Курортный сбор / туристический налог",
    suggestedAmount: 100,
    unitNote: "за человека, за ночь",
    helpText:
      "С 2025 года курортный сбор в РФ заменён туристическим налогом, который отель включает в счёт за проживание (в 2026 году в Кисловодске — 2% от стоимости проживания, но не менее 100 ₽/чел. за ночь). Реально актуально для Кисловодска (курортный регион Кавминвод, Ставропольский край) — в Абхазии и Вьетнаме такого сбора нет, отмечайте пункт только для поездки в Кисловодск. Сумма автоматически умножается на число ночей поездки.",
    supportsRoundTrip: false,
    supportsCount: true,
    countLabel: "Человек",
    countDefault: 3,
    scalesWithNights: true,
  },
];

export function createInitialHiddenCostsState(): HiddenCostsState {
  return Object.fromEntries(
    hiddenCostItems.map((item) => [
      item.id,
      {
        enabled: false,
        amount: item.suggestedAmount,
        roundTrip: item.supportsRoundTrip,
        count: item.countDefault ?? 1,
      },
    ]),
  );
}

export function sumHiddenCosts(state: HiddenCostsState, nights: number): number {
  return hiddenCostItems.reduce((sum, item) => {
    const entry = state[item.id];
    if (!entry?.enabled) return sum;

    let value = entry.amount;
    if (item.supportsRoundTrip && entry.roundTrip) value *= 2;
    if (item.supportsCount) value *= Math.max(entry.count, 0);
    if (item.scalesWithNights) value *= Math.max(nights, 0);

    return sum + value;
  }, 0);
}
