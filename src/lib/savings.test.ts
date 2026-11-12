import { describe, expect, it } from "vitest";
import { savingsExample } from "@/content/services";
import { calculateSavings, formatNumber, formatPKR, formatPercent } from "./savings";

const restaurant = { monthlyOrders: 300, averageOrderValue: 1200, planPrice: 6000 };

describe("calculateSavings: the PKR 360,000 restaurant example", () => {
  it("computes monthly sales of PKR 360,000", () => {
    expect(calculateSavings({ ...restaurant, commissionRate: 0.25 }).gross).toBe(360_000);
  });

  it("a 25% commission app takes PKR 90,000 and leaves PKR 270,000", () => {
    const r = calculateSavings({ ...restaurant, commissionRate: 0.25 });
    expect(r.commissionTaken).toBe(90_000);
    expect(r.keptWithCommission).toBe(270_000);
  });

  it("a 30% commission app takes PKR 108,000 and leaves PKR 252,000", () => {
    const r = calculateSavings({ ...restaurant, commissionRate: 0.3 });
    expect(r.commissionTaken).toBe(108_000);
    expect(r.keptWithCommission).toBe(252_000);
  });

  it("MetroMatrix Pro costs PKR 6,000 and the vendor keeps PKR 354,000", () => {
    const r = calculateSavings({ ...restaurant, commissionRate: 0.3 });
    expect(r.metroCost).toBe(6_000);
    expect(r.keptWithMetro).toBe(354_000);
  });

  it("extra kept equals commission taken minus plan price", () => {
    expect(calculateSavings({ ...restaurant, commissionRate: 0.25 }).extraKept).toBe(
      84_000,
    );
    expect(calculateSavings({ ...restaurant, commissionRate: 0.3 }).extraKept).toBe(
      102_000,
    );
    expect(calculateSavings({ ...restaurant, commissionRate: 0.28 }).extraKept).toBe(
      94_800,
    );
  });
});

describe("calculateSavings: content defaults stay consistent", () => {
  it("the calculator defaults reproduce the PKR 360,000 example", () => {
    const r = calculateSavings({
      monthlyOrders: savingsExample.monthlyOrders,
      averageOrderValue: savingsExample.averageOrderValue,
      commissionRate: savingsExample.commissionDefault,
      planPrice: savingsExample.metroCost,
    });
    expect(r.gross).toBe(360_000);
    expect(r.commissionTaken).toBe(100_800);
  });

  it("while MetroMatrix is free, the vendor keeps the full PKR 360,000", () => {
    expect(savingsExample.metroCost).toBe(0);
    const r = calculateSavings({
      ...restaurant,
      planPrice: savingsExample.metroCost,
      commissionRate: 0.3,
    });
    expect(r.keptWithMetro).toBe(360_000);
    expect(r.extraKept).toBe(108_000);
  });
});

describe("calculateSavings: edge cases", () => {
  it("returns zeros for zero orders, with the plan as a cost", () => {
    const r = calculateSavings({
      monthlyOrders: 0,
      averageOrderValue: 1200,
      commissionRate: 0.28,
      planPrice: 1500,
    });
    expect(r.gross).toBe(0);
    expect(r.commissionTaken).toBe(0);
    expect(r.keptWithMetro).toBe(-1500);
    expect(r.extraKept).toBe(-1500);
  });

  it("treats negative and non-finite inputs as zero", () => {
    const r = calculateSavings({
      monthlyOrders: -10,
      averageOrderValue: Number.NaN,
      commissionRate: Number.POSITIVE_INFINITY,
      planPrice: -5,
    });
    expect(r).toEqual({
      gross: 0,
      commissionTaken: 0,
      metroCost: 0,
      keptWithCommission: 0,
      keptWithMetro: 0,
      extraKept: 0,
    });
  });

  it("clamps the commission rate to 0–100%", () => {
    expect(calculateSavings({ ...restaurant, commissionRate: 1.5 }).commissionTaken).toBe(
      360_000,
    );
    expect(
      calculateSavings({ ...restaurant, commissionRate: -0.2 }).commissionTaken,
    ).toBe(0);
  });

  it("rounds to whole rupees", () => {
    const r = calculateSavings({
      monthlyOrders: 3,
      averageOrderValue: 333,
      commissionRate: 0.155,
      planPrice: 0,
    });
    expect(r.gross).toBe(999);
    expect(r.commissionTaken).toBe(155); // 154.845 → 155
    expect(Number.isInteger(r.keptWithCommission)).toBe(true);
  });
});

describe("formatting (en-PK)", () => {
  it("formats PKR with the currency code and grouping", () => {
    expect(formatPKR(360_000)).toBe("PKR 360,000");
    expect(formatPKR(6_000)).toBe("PKR 6,000");
    expect(formatPKR(1_234_567)).toBe("PKR 1,234,567");
  });

  it("formats negatives and rounds", () => {
    expect(formatPKR(-1500)).toMatch(/^-?PKR\s?-?1,500$/);
    expect(formatPKR(1199.6)).toBe("PKR 1,200");
  });

  it("formats plain numbers and percentages", () => {
    expect(formatNumber(300)).toBe("300");
    expect(formatNumber(12_500)).toBe("12,500");
    expect(formatPercent(0.28)).toBe("28%");
  });
});
