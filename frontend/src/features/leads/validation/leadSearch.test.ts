import { describe, expect, it } from "vitest";

import { normalizeLeadSearch, validateLeadSearch } from "./leadSearch";

describe("normalizeLeadSearch", () => {
  it("removes leading and trailing spaces", () => {
    expect(normalizeLeadSearch("  Rahul Kapgate  ")).toBe("Rahul Kapgate");
  });

  it("collapses multiple spaces", () => {
    expect(normalizeLeadSearch("Rahul    Kapgate")).toBe("Rahul Kapgate");
  });

  it("returns empty string for whitespace only", () => {
    expect(normalizeLeadSearch("     ")).toBe("");
  });
});

describe("validateLeadSearch", () => {
  it("allows an empty search", () => {
    expect(validateLeadSearch("")).toBeNull();
  });

  it("accepts a valid name", () => {
    expect(validateLeadSearch("Rahul Kapgate")).toBeNull();
  });

  it("accepts an email search", () => {
    expect(validateLeadSearch("rahul@example.com")).toBeNull();
  });

  it("accepts a phone search", () => {
    expect(validateLeadSearch("9876543210")).toBeNull();
  });

  it("rejects symbols only", () => {
    expect(validateLeadSearch("@@@###")).toBe(
      "Enter a valid name, email or phone number.",
    );
  });

  it("rejects more than 80 characters", () => {
    expect(validateLeadSearch("a".repeat(81))).toBe(
      "Search cannot exceed 80 characters.",
    );
  });
});
