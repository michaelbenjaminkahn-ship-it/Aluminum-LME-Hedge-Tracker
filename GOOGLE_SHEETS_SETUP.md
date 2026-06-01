# Setup: Google Sheet as the back end

This makes your **Google Sheet the master copy** of every trade. You work in the
Sheet directly; Nathan (and you) use the app to add trades and see the summary.
A small Apps Script connects the two. One-time, ~10 minutes.

```
   Nathan / you  ──▶  the app (Add hedge form + summary)
                          │  reads & writes via Apps Script
                          ▼
                    your Google Sheet   ◀── you edit / analyse directly
```

---

## Step 1 — Create the Sheet
1. Go to **https://sheets.google.com** → **Blank spreadsheet**.
2. Name it e.g. **Excel Metals — Hedge Book**.
3. You can leave it empty; the script creates a tab called **Hedges** with the
   right column headers the first time it runs.

## Step 2 — Add the connector script
1. In the Sheet: menu **Extensions → Apps Script**.
2. Delete whatever sample code is shown.
3. Open **`apps-script/Code.gs`** from this repo, copy the whole file, and paste
   it into the editor.
4. Near the top, change this line to a passcode you choose (this is what you and
   Nathan will type into the app):
   ```js
   const PASSCODE = 'change-me-to-a-shared-passcode';
   ```
5. Click the **Save** icon.

## Step 3 — Deploy it as a web app
1. Top-right: **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → choose **Web app**.
3. Set:
   - **Description:** anything (e.g. "hedge tracker").
   - **Execute as:** **Me**.
   - **Who has access:** **Anyone**.
     *(This means "anyone with the link can reach the script" — the passcode is
     what actually protects your data. Don't post the link publicly.)*
4. Click **Deploy**. Google will ask you to **authorize** — approve it (you may
   see an "unverified app" screen → **Advanced → go to … (unsafe)** → Allow;
   that warning is normal for your own scripts).
5. Copy the **Web app URL** — it ends in **`/exec`**.

## Step 4 — Connect the app
Two ways:
- **Easiest:** open the app, click **Connect shared book**, paste the **Web app
  URL** and your **passcode**, and Connect. (Each person does this once on their
  computer/browser.)
- **Or** send me the Web app URL and I'll bake it into the app so people only
  need the passcode.

That's it. Add a trade in the app → a new row appears in your Sheet. Edit a row
in the Sheet → click **Refresh** in the app (it also auto-refreshes every ~30s
and whenever you return to the tab).

---

## Working in the Sheet (important)
- **Don't rename or delete the header row**, and **never edit the `id` column** —
  that's how the app matches rows.
- You **can** add your own extra columns to the right (notes, P&L workings,
  formulas, pivot tables on another tab) — the app ignores them.
- Dates work best as plain `YYYY-MM-DD` text.

## Changing things later
- **Change the passcode:** edit `PASSCODE` in the script, Save, then
  **Deploy → Manage deployments → Edit → Deploy** (or just save — existing
  deployment uses the latest code). Tell everyone the new passcode.
- **Re-deploy after editing the script:** Deploy → Manage deployments → ✏️ →
  **Version: New version** → Deploy, so the live URL uses your changes.

## Security, honestly
The passcode is a **shared secret**, not individual logins. It's good for a small
trusted team and keeps casual eyes out, but anyone you give the link + passcode to
can read and write. If you later want real per-person logins, we switch to the
Supabase option (see `SUPABASE_SETUP.md`). Keep **Export backup** as a habit.
