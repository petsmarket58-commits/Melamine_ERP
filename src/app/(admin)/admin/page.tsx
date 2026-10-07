import type { Metadata } from "next"

export const metadata: Metadata = { title: "NCA Admin" }

export default function AdminHomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-primary">NCA Admin</h1>
    </main>
  )
}
