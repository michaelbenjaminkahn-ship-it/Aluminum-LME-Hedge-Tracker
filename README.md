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

## Adding & editing trades

**+ Add trade** opens a clean ticket with the fields up front: trade date, buy or
sell, number of lots, price (USD/tonne), customer name, customer PO #, prompt
date, and customer delivery month. When the trade settles, enter a **close
price** and the app shows the realized **Trade P&L = (close − price) × lots**
(flipped for a sell). LME/hedge specifics (venue, ASP differential, strike,
unpriced lots, averaging dates) live in an optional **Hedge details** section.

## What it shows

- **Summary cards** — net open position (lots), open long, open short, **realized
  P&L** (settled trades), and **open MTM** (unsettled trades marked vs the price
  you type in the top box).
- **Position by Customer Delivery Month** — long/short lots, net, settled P&L, and
  open MTM per delivery month. Click a month to expand the trades inside it.
- **Trade Ledger** — every trade, sortable and filterable (by side, by
  open/settled, or search customer/PO). Double-click a row to edit.

## Valuation

`Trade P&L = (close − price) × lots`, flipped for a sell (a sale profits when the
price falls). Open trades show an indicative mark-to-market vs the current price
you enter in the top box, until a close price settles them.

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
