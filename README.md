# Aluminium Hedge Tracker — Excel Metals LLC

A clean, simple tracker for primary-aluminium LME and OTC hedges — built to
replace a cluttered broker tool and hard-to-read statements with something neat,
easy to print, and shared live between you and your team.

## Two ways it runs

- **Shared mode (recommended)** — you and your team log in and see **one live
  book** that syncs for everyone. Backed by a free Supabase database. Setup is a
  one-time ~10 minutes: see **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**.
- **Local mode** — open `index.html` with no database configured and it works
  entirely in your own browser (data stored locally, synced via Export/Import).
  Good for trying it out.

The screens are identical either way; only where the data lives changes.

## What it shows

- **Summary cards** — net position (long vs short), total long, total short,
  unpriced/floating exposure, and an indicative mark-to-market.
- **Net Position by Prompt Month** — long, short, net, priced vs unpriced, and
  MTM grouped by prompt month. The at-a-glance view of where you're hedged and
  where you're still exposed.
- **Hedge Ledger** — every trade, sortable and filterable. Double-click a row
  (or **Edit**) to change it.

## Adding & editing trades

**+ Add hedge** opens a form: trade date, broker trade ID, venue (LME/OTC), side,
product, tonnes, pricing (Average `ASP+differential`, or Fixed strike), prompt /
settlement date, and **unpriced tonnes** (the lots not yet fixed — your live
exposure). Priced = quantity − unpriced. The **differential** field captures
`ASP+x` premiums; **fixed strike** drives the indicative MTM on fixed legs.

## Valuation

Type today's LME price in the top-right box and everything marks to market. The
MTM is `(your price − strike) × tonnes`, signed by side — an **estimate** for
fixed-price legs. Pure average (ASP) legs show no MTM until they price, because
they settle at the market average. It is not a substitute for the broker statement.

## Data in / out

- **Import** — paste a CSV or a JSON backup. CSV columns (any order):
  `tradeDate, tradeId, venue, side, product, tonnes, pricing, diff, strike,
  avgStart, avgEnd, prompt, unpriced, status, notes`. Dates accept
  `12-Dec-2025`, `2025-12-12`, or `12/12/2025`.
- **Export backup** (JSON) and **Export CSV** — save copies any time.
- **Sample data** — adds a few generic example rows so you can see it working.
- **Print** — a clean one-page summary.

## Roadmap

- Importer tuned to the exact broker CSV once you have a sample export.
- Physical-position layer so hedges net against actual cargoes.
- Proper averaging P&L (logging daily settlements to build the ASP yourself).
