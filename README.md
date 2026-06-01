# Aluminium Hedge Tracker — Excel Metals LLC

A clean, simple tracker for primary-aluminium LME and OTC hedges — built to
replace a cluttered broker tool and hard-to-read statements with something neat,
easy to print, and shared live between you and your team.

## Three ways it runs

The screens are identical in every mode; only *where the data lives* changes.

- **Google Sheet back end (recommended)** — your Google Sheet is the master copy.
  You work in the Sheet directly; the app is the entry form + summary that reads
  and writes to it via a small Apps Script, gated by a shared passcode. One-time
  ~10-min setup: see **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)** and
  **[apps-script/Code.gs](apps-script/Code.gs)**.
- **Supabase back end** — one live shared book with real per-person logins.
  Use this instead if you want individual accounts rather than a shared passcode:
  see **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**.
- **Local mode** — open `index.html` with nothing configured and it works
  entirely in your own browser (data stored locally, synced via Export/Import).
  Good for trying it out.

Connect a back end any time via the **Connect shared book** button in the app.

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
