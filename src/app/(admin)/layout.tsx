/** NCA super-admin area. Super-admin authorisation belongs here. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-svh flex-1 flex-col">{children}</div>
}
