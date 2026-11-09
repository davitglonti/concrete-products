import { describe, it, expect } from "vitest";
import {
  computeStepsCalculation,
  computePaversCalculation,
  StepCalcParamsSchema,
  PaverCalcParamsSchema,
} from "../utils/validation";

describe("Calculator Algorithm: Steps (საფეხურები)", () => {
  const baseModel = {
    id: "step-l",
    name: "L-ფორმის მონოლითური საფეხური",
    basePricePerMeter: 95,
    weightPerMeter: 35,
  };

  const baseTexture = {
    id: "grey",
    name: "კლასიკური ნაცრისფერი",
    priceMultiplier: 1.0,
  };

  it("calculates linear meters and weight correctly with standard 35cm depth", () => {
    const res = computeStepsCalculation({
      stepCount: 10,
      stepLength: 120, // 1.2 m
      stepDepth: 35,   // standard 35 cm baseline
      model: baseModel,
      texture: baseTexture,
    });

    // 10 steps * 1.2m = 12.0 linear meters
    expect(res.totalLinearMeters).toBe("12.0");
    // 10 steps * 1.2m * 0.35m = 4.20 m²
    expect(res.totalSquareMeters).toBe(4.2);
    // 12m * 35kg/m * (35/35) = 420 kg
    expect(res.estimatedWeightKg).toBe(420);
    // Cost: 12m * 95₾ * 1.0 = 1140 ₾
    expect(res.estimatedCost).toBe(1140);
  });

  it("dynamically increases weight and cost when step depth increases", () => {
    const standardDepthRes = computeStepsCalculation({
      stepCount: 10,
      stepLength: 120,
      stepDepth: 35,
      model: baseModel,
      texture: baseTexture,
    });

    const deeperRes = computeStepsCalculation({
      stepCount: 10,
      stepLength: 120,
      stepDepth: 45, // deeper step (45cm vs 35cm)
      model: baseModel,
      texture: baseTexture,
    });

    // Linear meters remain 12.0m
    expect(deeperRes.totalLinearMeters).toBe("12.0");
    // Weight should be higher for 45cm depth
    expect(deeperRes.estimatedWeightKg).toBeGreaterThan(standardDepthRes.estimatedWeightKg);
    // 12 * 35 * (45/35) = 540 kg
    expect(deeperRes.estimatedWeightKg).toBe(540);
    // Cost should also scale up to account for extra concrete volume
    expect(deeperRes.estimatedCost).toBeGreaterThan(standardDepthRes.estimatedCost);
  });

  it("validates invalid or missing step count", () => {
    expect(() =>
      computeStepsCalculation({
        stepCount: -5,
        stepLength: 120,
        stepDepth: 35,
        model: baseModel,
      })
    ).toThrow();
  });
});

describe("Calculator Algorithm: Pavers (მოსაპირკეთებელი ფილები)", () => {
  const paverSize60x60 = {
    id: "60x60",
    name: "60 x 60 x 5 სმ",
    areaPerTile: 0.36,
    basePricePerSqm: 65,
    weightPerSqm: 115,
  };

  const textureWhite = {
    id: "white",
    name: "თეთრი არქიტექტურული",
    priceMultiplier: 1.15,
  };

  it("calculates effective area including reserve margin and tile count", () => {
    const res = computePaversCalculation({
      paverArea: 100, // 100 m²
      paverReserve: 10, // 10% reserve
      size: paverSize60x60,
      texture: textureWhite,
    });

    // 100 * 1.10 = 110 m²
    expect(res.effectiveArea).toBe("110.0");
    // 110 / 0.36 = 305.5 -> ceil to 306 tiles
    expect(res.totalTiles).toBe(306);
    // 110 * 115 = 12650 kg = 12.65 tons
    expect(res.estimatedWeightKg).toBe(12650);
    expect(res.estimatedWeightTons).toBe("12.65");
  });

  it("uses realistic fallback (0.05 m²) when areaPerTile is missing or zero", () => {
    const paverWithoutArea = {
      id: "custom",
      name: "სპეციალური ფილა",
      areaPerTile: 0, // corrupted/missing area
      basePricePerSqm: 70,
      weightPerSqm: 120,
    };

    const res = computePaversCalculation({
      paverArea: 10, // 10 m²
      paverReserve: 0,
      size: paverWithoutArea,
    });

    // With realistic 0.05 m² fallback: 10 / 0.05 = 200 tiles
    // If it had fallen back to the bugged 0.5 m², it would only be 20 tiles!
    expect(res.totalTiles).toBe(200);
  });
});
