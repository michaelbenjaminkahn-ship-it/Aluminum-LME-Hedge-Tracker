# One-time setup: the shared book (Supabase)

This makes you and your team share **one live book** that you both log into. It's
free at your volume. You do this once; it takes about 10 minutes. Anything you
get stuck on, send me the step number.

---

## Step 1 — Create a free Supabase project
1. Go to **https://supabase.com** → **Start your project** → sign in with GitHub or email.
2. Click **New project**.
   - **Name:** `excel-metals-hedges`
   - **Database password:** make one up and save it somewhere (you rarely need it).
   - **Region:** pick the closest (e.g. East US).
3. Click **Create new project** and wait ~2 minutes while it sets up.

## Step 2 — Copy your two connection values
1. In the project, open **Project Settings** (gear, bottom-left) → **API**.
2. Copy these two and paste them to me (both are safe to share — the anon key is
   designed to be public):
   - **Project URL** — looks like `https://abcd1234.supabase.co`
   - **Project API keys → `anon` `public`** — a long string starting `eyJ…`

## Step 3 — Create the table (copy/paste)
1. Left sidebar → **SQL Editor** → **New query**.
2. Paste the block below and click **Run**. It should say "Success".

```sql
-- Shared hedge book
create table if not exists public.hedges (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Lock it down: only signed-in users (your team) can read/write
alter table public.hedges enable row level security;

create policy "authenticated read"   on public.hedges for select to authenticated using (true);
create policy "authenticated insert" on public.hedges for insert to authenticated with check (true);
create policy "authenticated update" on public.hedges for update to authenticated using (true) with check (true);
create policy "authenticated delete" on public.hedges for delete to authenticated using (true);

-- Live updates so both of you see changes instantly
alter publication supabase_realtime add table public.hedges;
```

## Step 4 — Lock signups to just you two
1. Left sidebar → **Authentication** → **Sign In / Providers** (or **Providers**).
2. Make sure **Email** is enabled.
3. Find **Allow new users to sign up** and turn it **OFF**. (This stops strangers
   creating accounts. You'll add your two accounts by hand next.)

## Step 5 — Create your two logins
1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Add yourself: your email + a password. Tick **Auto Confirm User**.
3. **Add user** again for each teammate: their email + a password (share it with them).

## Step 6 — Hand it to me
Send me the **Project URL** and the **anon public key** from Step 2. I'll bake them
into the app and push, so you and your team just open the link and sign in.

> Prefer to do it yourself? Open the app, click **Connect shared book**, paste the
> two values, and Connect. You'd do that once on each computer.

---

### What this gives you
- One shared book. When anyone adds a trade, the others see it live.
- Private: only your two logins can see it.
- Your data lives in your own Supabase project, which you own and control.

### Good to know
- The free tier is ample for this. If a project sits unused for a long time
  Supabase may pause it — opening the dashboard resumes it.
- **Export backup** in the app still works and is a good habit.
