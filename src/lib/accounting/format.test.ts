import { describe, expect, it } from "vitest"

import { formatAmount, formatPKR, formatQty, parseAmount } from "./format"

describe("formatAmount", () => {
  it("uses international grouping by default", () => {
    expect(formatAmount("12345678.5")).toBe("12,345,678.50")
  })

  it("supports lakh/crore grouping", () => {
    expect(formatAmount("12345678.5", { grouping: "south-asian" })).toBe("1,23,45,678.50")
    expect(formatAmount("999", { grouping: "south-asian" })).toBe("999.00")
  })

  it("shows negatives in parentheses by default", () => {
    expect(formatAmount("-1500")).toBe("(1,500.00)")
    expect(formatAmount("-1500", { negative: "minus" })).toBe("-1,500.00")
  })

  it("can render zero as a dash", () => {
    expect(formatAmount(0, { zero: "-" })).toBe("-")
  })

  it("does not lose precision on large values", () => {
    expect(formatAmount("123456789012345.67")).toBe("123,456,789,012,345.67")
  })

  it("formats PKR and quantities", () => {
    expect(formatPKR("-1250")).toBe("-Rs 1,250.00")
    expect(formatQty("12.5")).toBe("12.500")
  })
})

describe("parseAmount", () => {
  it.each([
    ["1,250.50", "1250.5"],
    ["Rs 1,000", "1000"],
    ["(500.00)", "-500"],
    ["-42", "-42"],
    [".5", "0.5"],
  ])("parses %s", (input, expected) => {
    expect(parseAmount(input)).toBe(expected)
  })

  it.each(["", "abc", "1.2.3", "--5"])("rejects %s", (input) => {
    expect(parseAmount(input)).toBeNull()
  })
})
