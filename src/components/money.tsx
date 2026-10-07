import { cn } from "@/lib/utils"
import { formatAmount, money, type FormatOptions, type MoneyInput } from "@/lib/accounting"

type MoneyProps = FormatOptions & {
  value: MoneyInput | null | undefined
  className?: string
}

/** A figure: monospace, tabular, right-aligned, negatives in the negative colour. */
export function Money({ value, className, ...options }: MoneyProps) {
  const negative = money(value).isNegative()
  return (
    <span
      data-negative={negative || undefined}
      className={cn("money inline-block w-full", className)}
    >
      {formatAmount(value, options)}
    </span>
  )
}
