/**
 * Shell for everything inside a client company. `[company]` is the company
 * slug; tenant resolution and membership checks belong here.
 */
export default function CompanyLayout({ children }: LayoutProps<"/[company]">) {
  return <div className="flex min-h-svh flex-1 flex-col">{children}</div>
}
