import { describe, expect, it } from "vitest"

import { allocate, isBalanced, money, roundMoney, sum, toDbString } from "./money"

describe("money", () => {
  it("adds decimals exactly", () => {
    expect(sum(["0.1", "0.2"]).toString()).toBe("0.3")
  })

  it("treats null/undefined/empty as zero", () => {
    expect(sum([null, undefined, "", "5"]).toString()).toBe("5")
  })

  it("rounds half up to paisa", () => {
    expect(roundMoney("2.345").toFixed(2)).toBe("2.35")
    expect(roundMoney("-2.345").toFixed(2)).toBe("-2.35")
  })

  it("rejects non-finite input", () => {
    expect(() => money(Number.NaN)).toThrow(RangeError)
  })

  it("checks debit/credit balance at ledger scale", () => {
    expect(isBalanced(["100.00", "50.005"], ["150.01"])).toBe(true)
    expect(isBalanced(["100"], ["99.99"])).toBe(false)
  })

  it("allocates without losing a paisa", () => {
    const parts = allocate("100", [1, 1, 1])
    expect(parts.map((p) => p.toFixed(2))).toEqual(["33.34", "33.33", "33.33"])
    expect(sum(parts).toFixed(2)).toBe("100.00")
  })

  it("allocates negative totals", () => {
    const parts = allocate("-10", [1, 2])
    expect(sum(parts).toFixed(2)).toBe("-10.00")
  })

  it("serialises to a fixed-scale string", () => {
    expect(toDbString(5)).toBe("5.00")
  })
})
