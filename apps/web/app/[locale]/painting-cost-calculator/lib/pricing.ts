export type PartOfHouse = "interior" | "exterior";
export type HouseSize = "1" | "2" | "3" | "4+";
export type PaintingType = "fresh" | "repainting" | "rental";
export type Tier = "economy" | "premium" | "luxury";

export interface CalculatorState {
  customCarpetArea: number | null;
  houseSize: HouseSize | null;
  paintingType: PaintingType | null;
  partOfHouse: PartOfHouse | null;
  tier: Tier | null;
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  partOfHouse: null,
  houseSize: null,
  customCarpetArea: null,
  paintingType: null,
  tier: null,
};

export const HOUSE_SIZES: HouseSize[] = ["1", "2", "3", "4+"];

export const HOUSE_SIZE_RANGES: Record<
  HouseSize,
  { min: number; max: number }
> = {
  "1": { min: 400, max: 800 },
  "2": { min: 700, max: 1000 },
  "3": { min: 900, max: 1500 },
  "4+": { min: 1400, max: 2000 },
};

export const CUSTOM_CARPET_AREA_MIN = 100;
export const CUSTOM_CARPET_AREA_MAX = 4000;

const PAINTABLE_AREA_MULTIPLIER = 3.5;

interface Rate {
  high: number;
  low: number;
}

const PRIMER_REPAINTING_RATE: Rate = { low: 1.5, high: 2.5 };
const PUTTY_RATE: Rate = { low: 4, high: 8 };
const PRIMER_FRESH_RATE: Rate = { low: 2, high: 3 };
const DISTEMPER_RATE: Rate = { low: 8, high: 12 };

const EMULSION_RATES: Record<Tier, Rate> = {
  economy: { low: 12, high: 18 },
  premium: { low: 18, high: 28 },
  luxury: { low: 28, high: 45 },
};

const TIER_LABELS: Record<Tier, string> = {
  economy: "Economy",
  premium: "Premium",
  luxury: "Luxury",
};

export interface CoatBreakdown {
  coat: string;
  coats: number;
  high: number;
  low: number;
  rateHigh: number;
  rateLow: number;
}

export interface Estimate {
  breakdown: CoatBreakdown[];
  high: number;
  low: number;
}

const roundToNearestHundred = (value: number) => Math.round(value / 100) * 100;

const coatBreakdown = (
  coat: string,
  coats: number,
  paintableAreaSqft: number,
  rate: Rate
): CoatBreakdown => ({
  coat,
  coats,
  rateLow: rate.low,
  rateHigh: rate.high,
  low: roundToNearestHundred(paintableAreaSqft * rate.low),
  high: roundToNearestHundred(paintableAreaSqft * rate.high),
});

export const resolveCarpetAreaSqft = (
  houseSize: HouseSize | null,
  customCarpetArea: number | null
): number | null => {
  if (customCarpetArea !== null) {
    return customCarpetArea;
  }

  if (houseSize === null) {
    return null;
  }

  return HOUSE_SIZE_RANGES[houseSize].max;
};

export const calculatePaintableAreaSqft = (carpetAreaSqft: number) =>
  carpetAreaSqft * PAINTABLE_AREA_MULTIPLIER;

export const calculateEstimate = (
  paintingType: PaintingType,
  paintableAreaSqft: number,
  tier: Tier | null
): Estimate | null => {
  let breakdown: CoatBreakdown[];

  if (paintingType === "rental") {
    breakdown = [
      coatBreakdown("Distemper", 2, paintableAreaSqft, DISTEMPER_RATE),
    ];
  } else if (paintingType === "repainting") {
    if (!tier) {
      return null;
    }

    breakdown = [
      coatBreakdown("Primer", 1, paintableAreaSqft, PRIMER_REPAINTING_RATE),
      coatBreakdown(
        `${TIER_LABELS[tier]} Emulsion`,
        2,
        paintableAreaSqft,
        EMULSION_RATES[tier]
      ),
    ];
  } else {
    if (!tier) {
      return null;
    }

    breakdown = [
      coatBreakdown("Putty", 2, paintableAreaSqft, PUTTY_RATE),
      coatBreakdown("Primer", 1, paintableAreaSqft, PRIMER_FRESH_RATE),
      coatBreakdown(
        `${TIER_LABELS[tier]} Emulsion`,
        2,
        paintableAreaSqft,
        EMULSION_RATES[tier]
      ),
    ];
  }

  return {
    low: breakdown.reduce((sum, item) => sum + item.low, 0),
    high: breakdown.reduce((sum, item) => sum + item.high, 0),
    breakdown,
  };
};

export const formatCurrencyRange = (low: number, high: number) =>
  `${formatCurrency(low)} – ${formatCurrency(high)}`;

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatSqft = (value: number) =>
  `${new Intl.NumberFormat("en-IN").format(value)} sq.ft.`;

export interface QuotePayload {
  carpetAreaUsedSqft: number | null;
  customCarpetAreaSqft: number | null;
  estimate: {
    low: number;
    high: number;
    breakdown: { coat: string; coats: number; low: number; high: number }[];
  } | null;
  houseSize: HouseSize | null;
  paintableAreaSqft: number | null;
  paintingType: PaintingType | null;
  partOfHouse: PartOfHouse | null;
  tier: Tier | null;
}

export const buildQuotePayload = (state: CalculatorState): QuotePayload => {
  if (state.partOfHouse !== "interior") {
    return {
      partOfHouse: state.partOfHouse,
      houseSize: null,
      customCarpetAreaSqft: null,
      carpetAreaUsedSqft: null,
      paintableAreaSqft: null,
      paintingType: null,
      tier: null,
      estimate: null,
    };
  }

  const carpetAreaUsedSqft = resolveCarpetAreaSqft(
    state.houseSize,
    state.customCarpetArea
  );
  const paintableAreaSqft =
    carpetAreaUsedSqft === null
      ? null
      : calculatePaintableAreaSqft(carpetAreaUsedSqft);
  const tier = state.paintingType === "rental" ? null : state.tier;
  const estimate =
    state.paintingType && paintableAreaSqft !== null
      ? calculateEstimate(state.paintingType, paintableAreaSqft, tier)
      : null;

  return {
    partOfHouse: state.partOfHouse,
    houseSize: state.houseSize,
    customCarpetAreaSqft: state.customCarpetArea,
    carpetAreaUsedSqft,
    paintableAreaSqft,
    paintingType: state.paintingType,
    tier,
    estimate: estimate
      ? {
          low: estimate.low,
          high: estimate.high,
          breakdown: estimate.breakdown.map(({ coat, coats, low, high }) => ({
            coat,
            coats,
            low,
            high,
          })),
        }
      : null,
  };
};
