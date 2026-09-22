import type { AutoParams, CostBreakdown, Destination, DestinationResult, ScalableCategory } from "./types";

const HOURS_PER_DAY = 24;
const SCALABLE_CATEGORIES: ScalableCategory[] = ["accommodation", "food", "activities"];

/** C_auto = C_fuel + C_roads + C_amortization + C_lodging (project section 4.1). */
export function calculateAutoTransportCost(params: AutoParams): number {
  const fuelCost =
    (params.distanceKm / 100) * params.fuelConsumptionPer100km * params.fuelPricePerLiter;
  const amortizationCost = params.distanceKm * params.amortizationPerKm;
  return fuelCost + params.tollRoadsCost + amortizationCost + params.lodgingEnRouteCost;
}

/**
 * Scales day-dependent cost categories (accommodation, food, activities) linearly
 * with trip length; transport and extra/insurance costs stay fixed regardless of
 * how many days are added, matching the project's "extend the trip to dilute fixed
 * logistics costs" argument (section 6, conclusion).
 */
export function scaleCostsForTripDays(
  baseCosts: CostBreakdown,
  baseTripDays: number,
  tripDays: number,
): CostBreakdown {
  const factor = tripDays / baseTripDays;
  const scaled = { ...baseCosts };
  for (const category of SCALABLE_CATEGORIES) {
    scaled[category] = baseCosts[category] * factor;
  }
  return scaled;
}

export function sumCosts(costs: CostBreakdown): number {
  return costs.transport + costs.accommodation + costs.food + costs.activities + costs.extra;
}

/**
 * C_total, K_t = T_rest / T_total, C_day = C_total / restDays (project sections 2 and 6.2).
 * `autoParamsOverride` lets the UI recompute the car-trip transport cost live from the
 * C_auto formula instead of using the destination's static base transport figure.
 */
export function computeDestinationResult(
  destination: Destination,
  tripDays: number,
  autoParamsOverride?: AutoParams,
): DestinationResult {
  const scaledCosts = scaleCostsForTripDays(destination.baseCosts, destination.baseTripDays, tripDays);

  const costs: CostBreakdown = autoParamsOverride
    ? { ...scaledCosts, transport: calculateAutoTransportCost(autoParamsOverride) }
    : scaledCosts;

  const totalCost = sumCosts(costs);
  const totalTripHours = tripDays * HOURS_PER_DAY;
  const restHours = Math.max(totalTripHours - destination.travelTimeHours, 0);
  const restDays = restHours / HOURS_PER_DAY;
  const kt = totalTripHours > 0 ? restHours / totalTripHours : 0;
  const costPerRestDay = restDays > 0 ? totalCost / restDays : Infinity;

  return {
    destination,
    costs,
    totalCost,
    totalTripHours,
    restHours,
    restDays,
    kt,
    costPerRestDay,
  };
}
