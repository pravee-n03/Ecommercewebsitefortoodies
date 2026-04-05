# 🔧 DATABASE ERROR TROUBLESHOOTING FLOWCHART

```
START: You see "Database tables not found" error
│
├─❓ Did you run /database/fresh-setup-v2.sql?
│  │
│  ├─ NO → Go run it now!
│  │       └─ See: /database/EXECUTE_THIS_NOW.md
│  │       └─ Then: REFRESH APP
│  │
│  └─ YES → Continue below ↓
│
├─❓ Do tables exist in Supabase Table Editor?
│  │  (Check: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/editor)
│  │
│  ├─ NO → Tables weren't created!
│  │       └─ Re-run: /database/fresh-setup-v2.sql
│  │       └─ Make sure you copied ALL 671 lines
│  │       └─ Check for SQL errors in editor
│  │
│  └─ YES → Continue below ↓
│
├─❓ Does business_info table have data?
│  │  Run: SELECT COUNT(*) FROM business_info;
│  │
│  ├─ Returns 0 → TABLE IS EMPTY! (This is your problem)
│  │       └─ FIX: Run /database/INSERT_DEFAULT_DATA.sql
│  │       └─ OR: See /FIX_EMPTY_TABLES.md
│  │       └─ Then: REFRESH APP → FIXED! ✅
│  │
│  ├─ Returns error → Table doesn't exist
│  │       └─ Re-run: /database/fresh-setup-v2.sql
│  │
│  └─ Returns 1+ → Has data, continue below ↓
│
├─❓ Is app connecting to correct Supabase project?
│  │  Check browser console for:
│  │  "Supabase client initialized for project: mvehfbmjtycgnzahffod"
│  │
│  ├─ Different project ID → WRONG PROJECT!
│  │       └─ Fix environment variables:
│  │           VITE_SUPABASE_URL=https://mvehfbmjtycgnzahffod.supabase.co
│  │       └─ See: /NETLIFY_ENV_VARS_SETUP.md
│  │
│  ├─ Connection error → Check environment variables
│  │       └─ Must have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
│  │       └─ See: /NETLIFY_ENV_VARS_SETUP.md
│  │
│  └─ Correct project ID → Continue below ↓
│
├─❓ Are RLS policies blocking access?
│  │  Test by temporarily disabling RLS:
│  │  ALTER TABLE business_info DISABLE ROW LEVEL SECURITY;
│  │
│  ├─ Error goes away → RLS POLICIES TOO RESTRICTIVE!
│  │       └─ Re-run: /database/fresh-setup-v2.sql
│  │           (It sets up correct policies)
│  │       └─ Or manually add policy:
│  │           CREATE POLICY "Allow public read"
│  │           ON business_info FOR SELECT
│  │           TO anon, authenticated
│  │           USING (true);
│  │
│  └─ Still showing error → Continue below ↓
│
├─❓ Are tables in the correct schema?
│  │  Tables should be in "public" schema
│  │
│  ├─ In different schema → Drop and recreate
│  │       └─ See /DIAGNOSE_TABLE_ERROR.md (Nuclear Option)
│  │
│  └─ In public schema → Continue below ↓
│
└─❓ Check browser network tab (F12 → Network)
   │  Filter for "supabase.co"
   │
   ├─ 401/403 errors → Authentication issue
   │       └─ Check VITE_SUPABASE_ANON_KEY is correct
   │       └─ Get from: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/settings/api
   │
   ├─ 404 errors → Table doesn't exist or wrong schema
   │       └─ Re-run: /database/fresh-setup-v2.sql
   │
   ├─ 500 errors → Database error
   │       └─ Check Supabase logs
   │
   └─ 200 but empty response → Empty table (back to step 3)
          └─ Run: /database/INSERT_DEFAULT_DATA.sql


═══════════════════════════════════════════════════════════
                    QUICK REFERENCE
═══════════════════════════════════════════════════════════

90% OF ISSUES ARE ONE OF THESE:

1. 🔴 Tables not created
   → Run: /database/fresh-setup-v2.sql

2. 🔴 Tables exist but EMPTY
   → Run: /database/INSERT_DEFAULT_DATA.sql
   → OR: See /FIX_EMPTY_TABLES.md

3. 🔴 Environment variables missing
   → See: /NETLIFY_ENV_VARS_SETUP.md

4. 🔴 RLS policies blocking access
   → Re-run: /database/fresh-setup-v2.sql
   → (It includes correct policies)

═══════════════════════════════════════════════════════════


MOST LIKELY ISSUE (70% of cases):
┌─────────────────────────────────────────────────────────┐
│ Tables exist but business_info table is EMPTY           │
│                                                          │
│ QUICK FIX:                                              │
│ Run this SQL:                                           │
│                                                          │
│ INSERT INTO business_info (                             │
│   id, company_name, email, created_at, updated_at       │
│ ) VALUES (                                              │
│   gen_random_uuid(), 'Toodies',                        │
│   'hello@toodies.com', NOW(), NOW()                     │
│ );                                                      │
│                                                          │
│ Then: Refresh app → Fixed! ✅                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 DETAILED GUIDES FOR EACH ISSUE

| Issue | Guide |
|-------|-------|
| Tables not created | `/database/EXECUTE_THIS_NOW.md` |
| Tables empty | `/FIX_EMPTY_TABLES.md` |
| Need diagnostics | `/DIAGNOSE_TABLE_ERROR.md` |
| Environment vars | `/NETLIFY_ENV_VARS_SETUP.md` |
| Complete setup | `/database/fresh-setup-v2.sql` |

---

## 🎯 FASTEST PATH TO FIX

**Don't waste time diagnosing. Just do this:**

1. Go to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new

2. Copy ALL of: `/database/fresh-setup-v2.sql`

3. Paste and Run

4. Wait for success message

5. Refresh app

**Done! 99% chance this fixes it.** ✅

---

**If still broken after this, see /DIAGNOSE_TABLE_ERROR.md**
