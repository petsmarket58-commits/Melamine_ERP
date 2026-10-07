import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard" }

export default function CompanyDashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
    </main>
  )
}
