"use client"

/**
 * Toast notifications.
 *
 * shadcn/ui retired its Radix-based `toast` component in favour of `sonner`.
 * This module is the single import point for toasts in the app so callers
 * never depend on the underlying library directly:
 *
 *   import { toast } from "@/components/ui/toast"
 *   toast.success("Voucher posted")
 */
export { toast } from "sonner"
export { Toaster } from "@/components/ui/sonner"
