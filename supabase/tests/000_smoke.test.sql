-- Smoke test: proves the pgTAP harness runs. Run with `npm run test:db`.
begin;
select plan(2);

select has_schema('public', 'public schema exists');
select has_schema('auth', 'auth schema exists');

select * from finish();
rollback;
