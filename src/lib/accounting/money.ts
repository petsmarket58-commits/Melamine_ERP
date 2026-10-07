import Decimal from "decimal.js"

/**
 * Money arithmetic. Never use JS `number` for money — floats cannot represent
 * most decimal fractions exactly (0.1 + 0.2 !== 0.3). Every amount that
 * enters the app (DB `numeric` columns arrive as strings) goes through
 * `money()` and stays a Decimal until it is formatted for display.
 */

/** A Decimal constructor isolated from the global one so config can't leak. */
export const D = Decimal.clone({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -30,
  toExpPos: 40,
})
export type Money = InstanceType<typeof D>

export type MoneyInput = Money | Decimal | string | number | bigint

/** Ledger amounts are stored to 2 decimal places (paisa). */
export const MONEY_SCALE = 2

/** Quantities (pieces, kg of powder, etc.) are stored to 3 decimal places. */
export const QTY_SCALE = 3

export function money(value: MoneyInput | null | undefined): Money {
  if (value === null || value === undefined || value === "") return new D(0)
  if (typeof value === "bigint") return new D(value.toString())
  const d = new D(value as Decimal.Value)
  if (!d.isFinite()) throw new RangeError(`Invalid money value: ${String(value)}`)
  return d
}

/** Round half-up to the ledger scale. */
export function roundMoney(value: MoneyInput, scale = MONEY_SCALE): Money {
  return money(value).toDecimalPlaces(scale, D.ROUND_HALF_UP)
}

export function sum(values: Iterable<MoneyInput | null | undefined>): Money {
  let total = new D(0)
  for (const v of values) total = total.plus(money(v))
  return total
}

export function isZero(value: MoneyInput, scale = MONEY_SCALE): boolean {
  return roundMoney(value, scale).isZero()
}

export function equals(a: MoneyInput, b: MoneyInput, scale = MONEY_SCALE): boolean {
  return roundMoney(a, scale).equals(roundMoney(b, scale))
}

/** Debits equal credits at ledger scale. */
export function isBalanced(
  debits: Iterable<MoneyInput>,
  credits: Iterable<MoneyInput>
): boolean {
  return equals(sum(debits), sum(credits))
}

/**
 * Split `total` across `weights` so the parts sum exactly to `total` at the
 * given scale (largest-remainder method). Used for cost and tax allocation.
 */
export function allocate(
  total: MoneyInput,
  weights: readonly MoneyInput[],
  scale = MONEY_SCALE
): Money[] {
  if (weights.length === 0) return []
  const w = weights.map((x) => money(x))
  if (w.some((x) => x.isNegative())) throw new RangeError("Weights must be non-negative")
  const weightTotal = sum(w)
  if (weightTotal.isZero()) throw new RangeError("Weights must not all be zero")

  const t = roundMoney(total, scale)
  const unit = new D(10).pow(-scale)
  const raw = w.map((x) => t.times(x).div(weightTotal))
  const parts = raw.map((x) => x.toDecimalPlaces(scale, D.ROUND_DOWN))
  let remainder = t.minus(sum(parts))

  const order = raw
    .map((x, i) => ({ i, frac: x.minus(parts[i]).abs() }))
    .sort((a, b) => b.frac.comparedTo(a.frac) || a.i - b.i)

  const step = remainder.isNegative() ? unit.negated() : unit
  for (let k = 0; !remainder.isZero(); k = (k + 1) % order.length) {
    const idx = order[k].i
    parts[idx] = parts[idx].plus(step)
    remainder = remainder.minus(step)
  }
  return parts
}

/** Serialise for the database / server action boundary (fixed scale string). */
export function toDbString(value: MoneyInput, scale = MONEY_SCALE): string {
  return roundMoney(value, scale).toFixed(scale)
}
