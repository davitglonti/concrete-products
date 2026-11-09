import { z } from "zod";

/**
 * Product Schema
 * Validates product creation & update payloads to avoid undefined runtime errors.
 */
export const ProductSchema = z.object({
  id: z.string().min(1, "პროდუქტის ID სავალდებულოა"),
  name: z.string().min(2, "პროდუქტის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  category: z.string().min(1, "კატეგორია სავალდებულოა"),
  categoryLabel: z.string().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  priceUnit: z.string().optional().default("₾ / ცალი"),
  shortDesc: z.string().optional().default(""),
  description: z.string().optional().default(""),
  dimensions: z.string().optional().default(""),
  weight: z.string().optional().default(""),
  concreteGrade: z.string().optional().default("B35"),
  frostResistance: z.string().optional().default("F300"),
  surface: z.string().optional().default("ქვიშაჭავლური"),
  baseColorName: z.string().optional().default("კლასიკური ნაცრისფერი"),
  image: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  colors: z.array(z.any()).optional().default([]),
  colorVariants: z.array(z.any()).optional().default([]),
  specs: z.record(z.any()).optional(),
  createdAt: z.string().optional(),
});

/**
 * Customer Inquiry Schema
 * Validates leads submitted through the contact modal or calculator.
 */
export const InquirySchema = z.object({
  name: z.string().trim().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  phone: z.string().trim().min(6, "ტელეფონის ნომერი არასრულია"),
  address: z.string().optional().default(""),
  message: z.string().optional().default(""),
  source: z.string().optional().default("website"),
  detailsSummary: z.string().optional().default(""),
  status: z.enum(["new", "contacted", "closed"]).optional().default("new"),
  createdAt: z.string().optional(),
});

/**
 * Steps Calculator Parameters Schema
 */
export const StepCalcParamsSchema = z.object({
  stepCount: z.coerce.number().int().min(1, "საფეხურების რაოდენობა უნდა იყოს მინიმუმ 1"),
  stepLength: z.coerce.number().min(30, "საფეხურის სიგრძე უნდა იყოს მინიმუმ 30 სმ"),
  stepDepth: z.coerce.number().min(20, "საფეხურის სიღრმე უნდა იყოს მინიმუმ 20 სმ"),
  model: z.object({
    id: z.string(),
    name: z.string(),
    basePricePerMeter: z.coerce.number().optional().default(85),
    weightPerMeter: z.coerce.number().optional().default(35),
  }),
  texture: z.object({
    id: z.string(),
    name: z.string(),
    priceMultiplier: z.coerce.number().optional().default(1),
  }).optional(),
  adhesiveRatio: z.coerce.number().optional().default(3.5),
});

/**
 * Pavers Calculator Parameters Schema
 */
export const PaverCalcParamsSchema = z.object({
  paverArea: z.coerce.number().min(1, "ფართობი უნდა იყოს მინიმუმ 1 მ²"),
  paverReserve: z.coerce.number().min(0).max(50).optional().default(5),
  size: z.object({
    id: z.string(),
    name: z.string(),
    areaPerTile: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    length: z.coerce.number().optional(),
    basePricePerSqm: z.coerce.number().optional().default(75),
    weightPerSqm: z.coerce.number().optional().default(140),
  }),
  texture: z.object({
    id: z.string(),
    name: z.string(),
    priceMultiplier: z.coerce.number().optional().default(1),
  }).optional(),
});

/**
 * Pure mathematical calculation engine for Steps (shared with Calculator and tests)
 */
export function computeStepsCalculation(params) {
  const validated = StepCalcParamsSchema.parse(params);
  const { stepCount, stepLength, stepDepth, model, texture, adhesiveRatio } = validated;

  const totalLinearMeters = (stepCount * stepLength) / 100;
  const totalSquareMeters = Number(((stepCount * (stepLength / 100) * (stepDepth / 100))).toFixed(2));
  
  // Baseline depth ratio (standard 35cm baseline)
  const depthRatio = stepDepth / 35;
  const baseWeightPerMeter = Number(model?.weightPerMeter) || 35;
  const estimatedWeightKg = Math.round(totalLinearMeters * baseWeightPerMeter * depthRatio);

  const basePricePerMeter = Number(model?.basePricePerMeter) || 85;
  const depthCostFactor = 0.7 + 0.3 * depthRatio;
  const multiplier = Number(texture?.priceMultiplier) || 1;
  const estimatedCost = Math.round(totalLinearMeters * basePricePerMeter * depthCostFactor * multiplier);

  const ratio = adhesiveRatio > 0 ? adhesiveRatio : 3.5;
  const adhesiveBags = Math.ceil(totalLinearMeters / ratio);

  return {
    totalLinearMeters: totalLinearMeters.toFixed(1),
    totalSquareMeters,
    estimatedWeightKg,
    estimatedCost,
    adhesiveBags,
  };
}

/**
 * Pure mathematical calculation engine for Pavers (shared with Calculator and tests)
 */
export function computePaversCalculation(params) {
  const validated = PaverCalcParamsSchema.parse(params);
  const { paverArea, paverReserve, size, texture } = validated;

  const effectiveArea = Number(paverArea) * (1 + (Number(paverReserve) || 0) / 100);

  let tileArea = Number(size?.areaPerTile);
  if (!tileArea || tileArea <= 0) {
    if (size?.width && size?.length) {
      tileArea = (Number(size.width) * Number(size.length)) / 10000;
    } else {
      tileArea = 0.05; // 0.05 m² standard fallback
    }
  }

  const totalTiles = tileArea > 0 ? Math.ceil(effectiveArea / tileArea) : 0;
  const estimatedWeightKg = Math.round(effectiveArea * (Number(size?.weightPerSqm) || 140));
  const multiplier = Number(texture?.priceMultiplier) || 1;
  const estimatedCost = Math.round(effectiveArea * (Number(size?.basePricePerSqm) || 75) * multiplier);

  return {
    effectiveArea: effectiveArea.toFixed(1),
    totalTiles,
    estimatedWeightKg,
    estimatedWeightTons: (estimatedWeightKg / 1000).toFixed(2),
    estimatedCost,
  };
}

/**
 * Safe validator helpers
 */
export function validateProduct(data) {
  return ProductSchema.safeParse(data);
}

export function validateInquiry(data) {
  return InquirySchema.safeParse(data);
}
