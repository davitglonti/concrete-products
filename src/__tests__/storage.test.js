import { describe, it, expect } from "vitest";
import { validateProduct, validateInquiry } from "../utils/validation";
import { sanitizeForFirestore } from "../services/firebaseService";

describe("Schema Validation (Zod)", () => {
  it("validates valid product object", () => {
    const validProd = {
      id: "prod-101",
      name: "მონოლითური საფეხური 150",
      category: "steps",
      categoryLabel: "საფეხურები",
      price: "95",
      priceUnit: "₾ / ცალი",
      shortDesc: "მოცულობითი ბეტონის საფეხური",
      concreteGrade: "B35",
    };

    const result = validateProduct(validProd);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("მონოლითური საფეხური 150");
      expect(result.data.concreteGrade).toBe("B35");
    }
  });

  it("fails product validation when required fields are missing", () => {
    const invalidProd = {
      name: "X", // too short, requires at least 2 chars
      // missing id and category
    };

    const result = validateProduct(invalidProd);
    expect(result.success).toBe(false);
  });

  it("validates and trims customer inquiry submission", () => {
    const validInquiry = {
      name: "  დავით გლონტი  ",
      phone: "  599 12 34 56  ",
      address: "თბილისი",
      message: "დაინტერესებული ვარ 15 ცალი საფეხურით",
    };

    const result = validateInquiry(validInquiry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("დავით გლონტი");
      expect(result.data.phone).toBe("599 12 34 56");
      expect(result.data.status).toBe("new");
    }
  });

  it("rejects invalid phone numbers in inquiries", () => {
    const badInquiry = {
      name: "დავით",
      phone: "123", // too short
    };

    const result = validateInquiry(badInquiry);
    expect(result.success).toBe(false);
  });
});

describe("Firebase Data Sanitization", () => {
  it("strips undefined keys to prevent Firestore write crashes", () => {
    const rawData = {
      id: "item-1",
      title: "Title",
      undefinedField: undefined,
      nestedNull: null,
      emptyString: "",
    };

    const clean = sanitizeForFirestore(rawData);
    expect(clean).toHaveProperty("id", "item-1");
    expect(clean).toHaveProperty("title", "Title");
    expect(clean).toHaveProperty("nestedNull", null);
    expect(clean).toHaveProperty("emptyString", "");
    expect(clean).not.toHaveProperty("undefinedField");
  });
});
