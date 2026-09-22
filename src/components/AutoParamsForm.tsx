"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AutoParams } from "@/lib/types";

interface AutoParamsFormProps {
  params: AutoParams;
  onChange: (params: AutoParams) => void;
}

type EditableAutoParamKey = Exclude<keyof AutoParams, "lodgingEnRouteCost">;

const STEP_VALUES: Record<EditableAutoParamKey, string> = {
  fuelPricePerLiter: "0.01",
  fuelConsumptionPer100km: "0.1",
  distanceKm: "1",
  tollRoadsCost: "1",
  amortizationPerKm: "0.1",
};

export function AutoParamsForm({ params, onChange }: AutoParamsFormProps) {
  const handleInputChange = (field: EditableAutoParamKey) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    const constraints: Array<(value: number) => boolean> = [];

    if (field === "distanceKm") {
      constraints.push((v) => v > 0);
    } else {
      constraints.push((v) => !isNaN(v) && v >= 0);
    }

    if (constraints.every((constraint) => constraint(value))) {
      onChange({ ...params, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Параметры автопоездки (формула C_auto)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelPricePerLiter">Цена бензина (руб./литр)</Label>
            <Input
              id="fuelPricePerLiter"
              type="number"
              step={STEP_VALUES.fuelPricePerLiter}
              value={params.fuelPricePerLiter}
              onChange={handleInputChange("fuelPricePerLiter")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelConsumptionPer100km">Расход (л/100км)</Label>
            <Input
              id="fuelConsumptionPer100km"
              type="number"
              step={STEP_VALUES.fuelConsumptionPer100km}
              value={params.fuelConsumptionPer100km}
              onChange={handleInputChange("fuelConsumptionPer100km")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="distanceKm">Расстояние (км)</Label>
            <Input
              id="distanceKm"
              type="number"
              step={STEP_VALUES.distanceKm}
              value={params.distanceKm}
              onChange={handleInputChange("distanceKm")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tollRoadsCost">Платные дороги (₽)</Label>
            <Input
              id="tollRoadsCost"
              type="number"
              step={STEP_VALUES.tollRoadsCost}
              value={params.tollRoadsCost}
              onChange={handleInputChange("tollRoadsCost")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amortizationPerKm">Амортизация (₽/км)</Label>
            <Input
              id="amortizationPerKm"
              type="number"
              step={STEP_VALUES.amortizationPerKm}
              value={params.amortizationPerKm}
              onChange={handleInputChange("amortizationPerKm")}
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Ночлег в пути: {params.lodgingEnRouteCost.toLocaleString("ru-RU")} ₽ (фиксировано)
        </div>
      </CardContent>
    </Card>
  );
}
