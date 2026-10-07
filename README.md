# NCA Melamine ERP

Multi-tenant ERP and accounting for melamine crockery manufacturers in
Pakistan, operated by National Compliance Associates (NCA).

## Stack

Next.js (App Router, TypeScript strict) · Tailwind CSS v4 · shadcn/ui ·
Supabase (Postgres, Auth, RLS) · TanStack Query/Table · react-hook-form + zod ·
decimal.js · ExcelJS · @react-pdf/renderer · Recharts · Vitest · Playwright · pgTAP

## Getting started

```bash
npm install
npx supabase start            # needs Docker; prints local URL and keys
cp .env.example .env.local    # paste the URL / anon key / service-role key
npm run dev
```

## Scripts

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Next.js dev server                                |
| `npm run build`     | Production build                                  |
| `npm run lint`      | ESLint                                            |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`         |
| `npm test`          | Vitest unit tests (`src/**/*.test.ts(x)`)         |
| `npm run test:db`   | pgTAP tests in `supabase/tests` (`supabase test db`) |
| `npm run e2e`       | Playwright tests in `e2e/` (builds and starts the app) |

## Layout

```
src/app/(auth)              login, invite acceptance, password reset
src/app/(app)/[company]     everything inside a client company (slug)
src/app/(admin)/admin       NCA super-admin screens
src/proxy.ts                session refresh + auth redirect (Next 16 "proxy")
src/lib/supabase            browser, server, middleware and service-role clients
src/lib/accounting          Decimal money helpers and figure formatting
src/features/<module>       per-module components, hooks, server actions
src/components/ui           shadcn/ui primitives
supabase/migrations         SQL migrations
supabase/tests              pgTAP tests
```

## Conventions

- **Money is never a JS `number`.** Use `money()` / `sum()` / `allocate()`
  from `@/lib/accounting`; format with `formatAmount()` or `<Money>`.
- **Figure columns** use `<TableHead numeric>` / `<TableCell numeric>` (or the
  `money` utility): right-aligned, IBM Plex Mono, tabular numbers.
- **Brand tokens**: `--brand-navy` (#1B2B4B) and `--brand-gold` (#B8862B),
  exposed as `bg-brand-navy`, `text-brand-gold`, etc. Light/dark themes via
  `next-themes` (`.dark` class).
- **Toasts**: import from `@/components/ui/toast` (sonner under the hood).
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS: only `@/lib/supabase/admin`
  reads it, and that module is `server-only`.
