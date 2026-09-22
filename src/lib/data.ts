import type { Destination } from "./types";

/**
 * Reference dataset: family of 3, 7 days / 6 nights, departure from Moscow,
 * June 2027 prices (project section 4.2 — the most detailed of the two
 * comparison tables, includes the car-trip option).
 */
export const destinations: Destination[] = [
  {
    id: "kislovodsk-train",
    name: "Кисловодск (поезд)",
    emoji: "🚆",
    baseTripDays: 7,
    travelTimeHours: 46,
    baseCosts: {
      transport: 56000,
      accommodation: 45000,
      food: 38000,
      activities: 22000,
      extra: 4000,
    },
  },
  {
    id: "kislovodsk-auto",
    name: "Кисловодск (авто)",
    emoji: "🚗",
    baseTripDays: 7,
    travelTimeHours: 38,
    baseCosts: {
      transport: 40000,
      accommodation: 45000,
      food: 38000,
      activities: 22000,
      extra: 5000,
    },
    autoParams: {
      distanceKm: 3200,
      fuelConsumptionPer100km: 8,
      fuelPricePerLiter: 62,
      tollRoadsCost: 7500,
      amortizationPerKm: 3,
      lodgingEnRouteCost: 7028,
    },
  },
  {
    id: "abkhazia",
    name: "Абхазия (Гагра)",
    emoji: "🌊",
    baseTripDays: 7,
    travelTimeHours: 12,
    baseCosts: {
      transport: 88000,
      accommodation: 54000,
      food: 45000,
      activities: 28000,
      extra: 7000,
    },
  },
  {
    id: "vietnam",
    name: "Вьетнам (Нячанг)",
    emoji: "🌴",
    baseTripDays: 7,
    travelTimeHours: 30,
    baseCosts: {
      transport: 320000,
      accommodation: 72000,
      food: 40000,
      activities: 38000,
      extra: 15000,
    },
  },
];
