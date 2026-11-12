/**
 * Pure savings math for the commission calculator. No React, no formatting
 * side effects, so it can be unit tested in isolation (see savings.test.ts).
 */

export interface SavingsInput {
  /** Orders per month. */
  monthlyOrders: number;
  /** Average order value in PKR. */
  averageOrderValue: number;
  /** Commission rate as a fraction, e.g. 0.28 for 28%. */
  commissionRate: number;
  /** Flat MetroMatrix plan price in PKR per month. */
  planPrice: number;
}

export interface SavingsResult {
  /** Monthly sales: orders × average order value. */
  gross: number;
  /** What a commission app takes per month. */
  commissionTaken: number;
  /** What MetroMatrix costs per month (the flat plan price). */
  metroCost: number;
  /** What the vendor keeps on a commission app. */
  keptWithCommission: number;
  /** What the vendor keeps on MetroMatrix. */
  keptWithMetro: number;
  /** Extra kept per month by choosing MetroMatrix (can be negative for tiny volumes). */
  extraKept: number;
}

const nonNegative = (n: number): number => (Number.isFinite(n) && n > 0 ? n : 0);
const clampRate = (r: number): number =>
  Number.isFinite(r) ? Math.min(Math.max(r, 0), 1) : 0;

export function calculateSavings(input: SavingsInput): SavingsResult {
  const orders = nonNegative(input.monthlyOrders);
  const aov = nonNegative(input.averageOrderValue);
  const rate = clampRate(input.commissionRate);
  const metroCost = Math.round(nonNegative(input.planPrice));

  const gross = Math.round(orders * aov);
  const commissionTaken = Math.round(gross * rate);
  const keptWithCommission = gross - commissionTaken;
  const keptWithMetro = gross - metroCost;

  return {
    gross,
    commissionTaken,
    metroCost,
    keptWithCommission,
    keptWithMetro,
    extraKept: keptWithMetro - keptWithCommission,
  };
}

const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** "PKR 360,000". Uses a regular space so copy and tests stay predictable. */
export function formatPKR(value: number): string {
  return pkr.format(Math.round(value)).replace(/\s/g, " ");
}

/** "360,000" (no currency). */
export function formatNumber(value: number): string {
  return plain.format(Math.round(value));
}

/** "28%" from 0.28. */
export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
