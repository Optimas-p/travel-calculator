"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DestinationCard } from "@/components/DestinationCard";
import { CostBreakdownChart } from "@/components/CostBreakdownChart";
import { ComfortScatterChart } from "@/components/ComfortScatterChart";
import { AutoParamsForm } from "@/components/AutoParamsForm";
import { HiddenCostsChecklist } from "@/components/HiddenCostsChecklist";
import { RecommendationBanner } from "@/components/RecommendationBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { destinations } from "@/lib/data";
import { computeDestinationResult } from "@/lib/formulas";
import { hiddenCostItems, createInitialHiddenCostsState, sumHiddenCosts } from "@/lib/hiddenCosts";
import { pickRecommendation } from "@/lib/recommendation";
import type { AutoParams } from "@/lib/types";

const MIN_TRIP_DAYS = 7;
const MAX_TRIP_DAYS = 14;
const AUTO_DESTINATION_ID = "kislovodsk-auto";

export default function Home() {
  const [tripDays, setTripDays] = useState(MIN_TRIP_DAYS);
  const [autoParams, setAutoParams] = useState<AutoParams>(
    destinations.find((d) => d.id === AUTO_DESTINATION_ID)!.autoParams!,
  );
  const [hiddenCostsState, setHiddenCostsState] = useState(createInitialHiddenCostsState);

  const nights = Math.max(tripDays - 1, 0);
  const hiddenCostsTotal = useMemo(
    () => sumHiddenCosts(hiddenCostsState, nights),
    [hiddenCostsState, nights],
  );

  const results = useMemo(
    () =>
      destinations.map((destination) =>
        computeDestinationResult(
          destination,
          tripDays,
          destination.id === AUTO_DESTINATION_ID ? autoParams : undefined,
          hiddenCostsTotal,
        ),
      ),
    [tripDays, autoParams, hiddenCostsTotal],
  );

  const recommendation = useMemo(() => pickRecommendation(results), [results]);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-10">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold sm:text-2xl">
            Оптимальный маршрут: математика в планировании путешествий
          </h1>
          <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">
            Интерактивный калькулятор к исследовательскому проекту. Семья из 3
            человек, выезд из Москвы. Меняйте длительность поездки, параметры
            автопоездки и чек-лист скрытых расходов — стоимость и коэффициент
            времени K_t пересчитываются сразу.
          </p>
        </div>
        <ThemeToggle />
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

      <section>
        <HiddenCostsChecklist
          items={hiddenCostItems}
          state={hiddenCostsState}
          nights={nights}
          total={hiddenCostsTotal}
          onToggle={(id, enabled) =>
            setHiddenCostsState((prev) => ({
              ...prev,
              [id]: { ...prev[id], enabled },
            }))
          }
          onAmountChange={(id, amount) =>
            setHiddenCostsState((prev) => ({
              ...prev,
              [id]: { ...prev[id], amount },
            }))
          }
          onRoundTripChange={(id, roundTrip) =>
            setHiddenCostsState((prev) => ({
              ...prev,
              [id]: { ...prev[id], roundTrip },
            }))
          }
          onCountChange={(id, count) =>
            setHiddenCostsState((prev) => ({
              ...prev,
              [id]: { ...prev[id], count },
            }))
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Рекомендуемый вариант</h2>
        <RecommendationBanner result={recommendation.result} reason={recommendation.reason} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Расчёт стоимости по направлениям</h2>
          <p className="text-sm text-muted-foreground">
            Под названием — краткая справка о регионе; значок ⓘ открывает
            подробности: достопримечательности, дорога и актуальные риски.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((result) => (
            <DestinationCard key={result.destination.id} result={result} />
          ))}
        </div>
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
