export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-highlight uppercase">
            National Compliance Associates
          </p>
          <h1 className="mt-1 text-xl font-semibold text-primary">Melamine ERP</h1>
        </div>
        {children}
      </div>
    </main>
  )
}
