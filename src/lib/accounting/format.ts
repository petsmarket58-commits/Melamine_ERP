import { money, MONEY_SCALE, QTY_SCALE, type MoneyInput } from "./money"

/**
 * Number formatting for figures. Works on the Decimal string so values are
 * never round-tripped through a float.
 *
 * Grouping:
 *  - "international": 12,345,678.00 (default; used on statutory reports)
 *  - "south-asian":   1,23,45,678.00 (lakh / crore, common on factory floors)
 */
export type Grouping = "international" | "south-asian"

export type NegativeStyle = "minus" | "parentheses"

export type FormatOptions = {
  decimals?: number
  grouping?: Grouping
  negative?: NegativeStyle
  /** Prefix such as "Rs " or "PKR ". Omitted by default for table columns. */
  currency?: string
  /** Render exact zero as this string (e.g. "-" on financial statements). */
  zero?: string
}

function groupInteger(digits: string, grouping: Grouping): string {
  if (grouping === "international" || digits.length <= 3) {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  const last3 = digits.slice(-3)
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",")
  return `${rest},${last3}`
}

export function formatAmount(value: MoneyInput | null | undefined, options: FormatOptions = {}): string {
  const {
    decimals = MONEY_SCALE,
    grouping = "international",
    negative = "parentheses",
    currency = "",
    zero,
  } = options

  const d = money(value).toDecimalPlaces(decimals)
  if (d.isZero() && zero !== undefined) return zero

  const fixed = d.abs().toFixed(decimals)
  const [intPart, fracPart] = fixed.split(".")
  const body = `${currency}${groupInteger(intPart, grouping)}${fracPart ? `.${fracPart}` : ""}`

  if (!d.isNegative() || d.isZero()) return body
  return negative === "parentheses" ? `(${body})` : `-${body}`
}

/** PKR amount, e.g. "Rs 1,250.00". */
export function formatPKR(value: MoneyInput | null | undefined, options: Omit<FormatOptions, "currency"> = {}) {
  return formatAmount(value, { negative: "minus", ...options, currency: "Rs " })
}

export function formatQty(value: MoneyInput | null | undefined, options: FormatOptions = {}) {
  return formatAmount(value, { decimals: QTY_SCALE, negative: "minus", ...options })
}

/**
 * Parse user-typed figures: strips grouping commas, currency prefixes and
 * whitespace; "(1,000.00)" parses as -1000. Returns null when not a number.
 */
export function parseAmount(input: string): string | null {
  let s = input.trim().replace(/^(rs\.?|pkr)\s*/i, "").replace(/[,\s]/g, "")
  let negative = false
  if (/^\(.*\)$/.test(s)) {
    negative = true
    s = s.slice(1, -1)
  }
  if (s.startsWith("-")) {
    negative = !negative
    s = s.slice(1)
  }
  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(s)) return null
  const d = money(s)
  return (negative ? d.negated() : d).toString()
}
