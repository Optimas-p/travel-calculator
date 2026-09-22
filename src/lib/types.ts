export interface CostBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  extra: number;
}

export type ScalableCategory = "accommodation" | "food" | "activities";

export interface AutoParams {
  distanceKm: number;
  fuelConsumptionPer100km: number;
  fuelPricePerLiter: number;
  tollRoadsCost: number;
  amortizationPerKm: number;
  lodgingEnRouteCost: number;
}

export interface Destination {
  id: string;
  name: string;
  emoji: string;
  /** Base costs for the reference trip: 3 people, 7 days / 6 nights. */
  baseCosts: CostBreakdown;
  /** Reference trip length in days that baseCosts and travelTimeHours correspond to. */
  baseTripDays: number;
  /** One-way + return travel time, in hours. Assumed constant regardless of trip length. */
  travelTimeHours: number;
  /** Present only for the car-trip destination; lets the UI expose the C_auto formula. */
  autoParams?: AutoParams;
}

export interface DestinationResult {
  destination: Destination;
  costs: CostBreakdown;
  /** Sum of checked items from the hidden-costs checklist; already included in totalCost. */
  hiddenCostsTotal: number;
  totalCost: number;
  totalTripHours: number;
  restHours: number;
  restDays: number;
  kt: number;
  costPerRestDay: number;
}

export interface HiddenCostItem {
  id: string;
  label: string;
  suggestedAmount: number;
}

export interface HiddenCostEntry {
  enabled: boolean;
  amount: number;
}

export type HiddenCostsState = Record<string, HiddenCostEntry>;
