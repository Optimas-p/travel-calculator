"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DestinationCard } from "@/components/DestinationCard";
import { CostBreakdownChart } from "@/components/CostBreakdownChart";
import { ComfortScatterChart } from "@/components/ComfortScatterChart";
import { AutoParamsForm } from "@/components/AutoParamsForm";
import { destinations } from "@/lib/data";
import { computeDestinationResult } from "@/lib/formulas";
import type { AutoParams } from "@/lib/types";

const MIN_TRIP_DAYS = 7;
const MAX_TRIP_DAYS = 14;
const AUTO_DESTINATION_ID = "kislovodsk-auto";

export default function Home() {
  const [tripDays, setTripDays] = useState(MIN_TRIP_DAYS);
  const [autoParams, setAutoParams] = useState<AutoParams>(
    destinations.find((d) => d.id === AUTO_DESTINATION_ID)!.autoParams!,
  );

  const results = useMemo(
    () =>
      destinations.map((destination) =>
        computeDestinationResult(
          destination,
          tripDays,
          destination.id === AUTO_DESTINATION_ID ? autoParams : undefined,
        ),
      ),
    [tripDays, autoParams],
  );

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Оптимальный маршрут: математика в планировании путешествий
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Интерактивный калькулятор к исследовательскому проекту. Семья из 3
          человек, выезд из Москвы. Меняйте длительность поездки и параметры
          автопоездки — стоимость и коэффициент времени K_t пересчитываются
          сразу.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-lg border p-4">
          <Label htmlFor="trip-days">
            Длительность поездки: {tripDays} дн.
          </Label>
          <Slider
            id="trip-days"
            min={MIN_TRIP_DAYS}
            max={MAX_TRIP_DAYS}
            step={1}
            value={[tripDays]}
            onValueChange={(value) =>
              setTripDays(Array.isArray(value) ? value[0] : value)
            }
          />
          <p className="text-sm text-muted-foreground">
            Базовые данные проекта рассчитаны на 7 дней; сдвигая ползунок,
            видно, как более длинная поездка снижает долю дороги в бюджете
            (проверка вывода проекта о минимальной выгодной длительности).
          </p>
        </div>

        <AutoParamsForm params={autoParams} onChange={setAutoParams} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {results.map((result) => (
          <DestinationCard key={result.destination.id} result={result} />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Структура расходов</h2>
        <CostBreakdownChart results={results} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Цена–время: где баланс комфорта
        </h2>
        <ComfortScatterChart results={results} />
      </section>
    </main>
  );
}
