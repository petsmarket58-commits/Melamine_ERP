# Feature modules

One folder per business module (e.g. `ledger`, `sales`, `purchases`,
`inventory`, `production`, `payroll`, `tax`). Each module owns its own:

```
src/features/<module>/
  components/   React components used only by this module
  hooks/        client hooks (TanStack Query wrappers etc.)
  actions.ts    server actions ("use server"), validated with zod
  schemas.ts    zod schemas shared by forms and actions
  queries.ts    server-side data access via @/lib/supabase/server
```

Routes in `src/app` stay thin: they compose components from here.
Modules must not import from each other's internals; share via `src/lib`.
