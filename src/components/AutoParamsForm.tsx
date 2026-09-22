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

export function AutoParamsForm({ params, onChange }: AutoParamsFormProps) {
  const handleFuelPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      onChange({ ...params, fuelPricePerLiter: value });
    }
  };

  const handleFuelConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      onChange({ ...params, fuelConsumptionPer100km: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Параметры автопоездки (формула C_auto)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelPrice">
              Цена бензина (руб./литр)
            </Label>
            <Input
              id="fuelPrice"
              type="number"
              step="0.01"
              min="0"
              value={params.fuelPricePerLiter}
              onChange={handleFuelPriceChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelConsumption">
              Расход (л/100км)
            </Label>
            <Input
              id="fuelConsumption"
              type="number"
              step="0.1"
              min="0"
              value={params.fuelConsumptionPer100km}
              onChange={handleFuelConsumptionChange}
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Расстояние: {params.distanceKm} км · Платные дороги: {params.tollRoadsCost.toLocaleString("ru-RU")} ₽
          · Амортизация: {params.amortizationPerKm} ₽/км · Проживание: {params.lodgingEnRouteCost.toLocaleString("ru-RU")} ₽
        </div>
      </CardContent>
    </Card>
  );
}
