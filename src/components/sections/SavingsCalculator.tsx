"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Slider } from "@/components/ui/Slider";
import type { SavingsExample } from "@/content/types";
import { calculateSavings, formatNumber, formatPKR, formatPercent } from "@/lib/savings";
import { cn } from "@/lib/utils";

export interface SavingsLabels {
  orders: string;
  averageOrder: string;
  commission: string;
  gross: string;
  commissionTakes: string;
  metroCost: string;
  metroCostNote: string;
  keptWithCommission: string;
  keptWithMetro: string;
  extraKept: string;
}

interface SavingsCalculatorProps {
  labels: SavingsLabels;
  example: SavingsExample;
  footnote: string;
}

const RANGES = {
  orders: { min: 50, max: 3000, step: 10 },
  aov: { min: 300, max: 5000, step: 50 },
  commission: { min: 15, max: 35, step: 1 },
} as const;

const formatDeduction = (n: number) => (n === 0 ? formatPKR(0) : `− ${formatPKR(n)}`);

export function SavingsCalculator({ labels, example, footnote }: SavingsCalculatorProps) {
  const [orders, setOrders] = useState(example.monthlyOrders);
  const [aov, setAov] = useState(example.averageOrderValue);
  const [commissionPct, setCommissionPct] = useState(
    Math.round(example.commissionDefault * 100),
  );

  const result = useMemo(
    () =>
      calculateSavings({
        monthlyOrders: orders,
        averageOrderValue: aov,
        commissionRate: commissionPct / 100,
        planPrice: example.metroCost,
      }),
    [orders, aov, commissionPct, example.metroCost],
  );

  // Debounced, non-animated summary for screen readers.
  const summary = `${labels.extraKept}: ${formatPKR(result.extraKept)}. ${labels.keptWithMetro}: ${formatPKR(result.keptWithMetro)}. ${labels.keptWithCommission}: ${formatPKR(result.keptWithCommission)}.`;
  const [announced, setAnnounced] = useState(summary);
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(summary), 600);
    return () => window.clearTimeout(t);
  }, [summary]);

  const pct = (v: number) =>
    result.gross > 0 ? Math.min(Math.max((v / result.gross) * 100, 0), 100) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
      {/* Controls */}
      <div className="rounded-(--radius-panel) border border-line bg-surface p-6 sm:p-8">
        <div className="space-y-8">
          <Slider
            label={labels.orders}
            value={orders}
            {...RANGES.orders}
            onChange={setOrders}
            display={formatNumber(orders)}
            valueText={`${formatNumber(orders)} orders per month`}
            minLabel={formatNumber(RANGES.orders.min)}
            maxLabel={formatNumber(RANGES.orders.max)}
          />
          <Slider
            label={labels.averageOrder}
            value={aov}
            {...RANGES.aov}
            onChange={setAov}
            display={formatPKR(aov)}
            valueText={formatPKR(aov)}
            minLabel={formatPKR(RANGES.aov.min)}
            maxLabel={formatPKR(RANGES.aov.max)}
          />
          <Slider
            label={labels.commission}
            value={commissionPct}
            {...RANGES.commission}
            onChange={setCommissionPct}
            display={`${commissionPct}%`}
            valueText={`${commissionPct} percent commission`}
            minLabel={`${RANGES.commission.min}%`}
            maxLabel={`${RANGES.commission.max}%`}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col rounded-(--radius-panel) border border-line bg-surface p-6 sm:p-8">
        <p className="text-label-md text-muted">{labels.extraKept}</p>
        <p className="mt-2 text-hero-md text-mint tabular-nums sm:text-hero-lg">
          <AnimatedNumber value={result.extraKept} format={formatPKR} />
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announced}
        </p>

        <dl className="mt-8 divide-y divide-line text-body-sm">
          <Row label={labels.gross} value={result.gross} />
          <Row
            label={`${labels.commissionTakes} (${formatPercent(commissionPct / 100)})`}
            value={result.commissionTaken}
            deduction
            tone="text-[#f48cbc]"
          />
          <Row
            label={labels.metroCost}
            note={labels.metroCostNote}
            value={result.metroCost}
            deduction
            tone="text-mint"
          />
        </dl>

        <div className="mt-8 space-y-5" aria-hidden="true">
          <Bar
            label={labels.keptWithCommission}
            value={result.keptWithCommission}
            pct={pct(result.keptWithCommission)}
            barClass="bg-[#f48cbc]/80"
          />
          <Bar
            label={labels.keptWithMetro}
            value={result.keptWithMetro}
            pct={pct(result.keptWithMetro)}
            barClass="bg-mint"
          />
        </div>
        {/* Screen-reader equivalent of the bars */}
        <dl className="sr-only">
          <dt>{labels.keptWithCommission}</dt>
          <dd>{formatPKR(result.keptWithCommission)}</dd>
          <dt>{labels.keptWithMetro}</dt>
          <dd>{formatPKR(result.keptWithMetro)}</dd>
        </dl>

        <p className="mt-auto pt-8 text-caption text-muted">{footnote}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  note,
  value,
  tone,
  deduction = false,
}: {
  label: string;
  note?: string;
  value: number;
  tone?: string;
  deduction?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-muted">
        {label}
        {note && <span className="ml-2 whitespace-nowrap text-mint">· {note}</span>}
      </dt>
      <dd className={cn("shrink-0 text-label-lg whitespace-nowrap tabular-nums", tone)}>
        <AnimatedNumber value={value} format={deduction ? formatDeduction : formatPKR} />
      </dd>
    </div>
  );
}

function Bar({
  label,
  value,
  pct,
  barClass,
}: {
  label: string;
  value: number;
  pct: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-body-sm">
        <span className="text-muted">{label}</span>
        <span className="shrink-0 text-label-md whitespace-nowrap tabular-nums">
          <AnimatedNumber value={value} format={formatPKR} />
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out-soft",
            barClass,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
