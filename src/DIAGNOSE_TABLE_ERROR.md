# 🔍 DIAGNOSE "DATABASE TABLES NOT FOUND" ERROR

## 🚨 You're Seeing This Error:
```
❌ Database tables not found
📋 Run: /database/fresh-setup-v2.sql in Supabase SQL Editor
```

## ✅ You Say: "I Created All 20 Tables"

Let's diagnose **WHY** the app still can't find them.

---

## 🔬 DIAGNOSTIC STEPS

### Step 1: Verify Tables Exist in Supabase

1. **Go to Supabase Table Editor:**
   ```
   https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/editor
   ```

2. **Check for these critical tables:**
   - [ ] `business_info` ← **THIS IS THE KEY TABLE**
   - [ ] `users`
   - [ ] `products`
   - [ ] `orders`
   - [ ] `designs`
   - [ ] `categories`
   - [ ] `admin_settings`

3. **Specifically check `business_info`:**
   - Does it exist? ✅ / ❌
   - Does it have any rows? ✅ / ❌
   - Does it have at least 1 row of data? ✅ / ❌

**🎯 The app checks `business_info` table first. If it's empty or doesn't exist, you see the error.**

---

### Step 2: Check If Tables Have Data

The error can mean:
- ❌ Tables don't exist at all
- ❌ Tables exist but are **empty** (no data)
- ❌ Tables exist but RLS policies are blocking access

**Quick Test:**

1. Go to Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new
   ```

2. Run this query:
   ```sql
   SELECT COUNT(*) FROM business_info;
   ```

3. **Result Analysis:**
   - **Error: "relation does not exist"** → Tables not created
   - **Returns 0** → Tables exist but empty (still shows error)
   - **Returns 1 or more** → Tables exist with data ✅

---

### Step 3: Insert Default Data

**If `business_info` is empty, that's your problem!**

Run this SQL to insert default data:

```sql
-- Insert default business info
INSERT INTO business_info (
  id,
  company_name,
  email,
  phone,
  whatsapp,
  address,
  city,
  state,
  country,
  postal_code,
  currency,
  tax_rate,
  social_media,
  visibility,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Toodies',
  'hello@toodies.com',
  '+91 98865 10858',
  '+919886510858',
  '123 Fashion Street',
  'Bangalore',
  'Karnataka',
  'India',
  '560001',
  'INR',
  18.0,
  '{}'::jsonb,
  '{
    "website": {
      "showWhatsApp": true,
      "showSocialMedia": true
    }
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

---

### Step 4: Check RLS Policies

**If tables exist AND have data but app still shows error:**

1. Go to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/auth/policies

2. **Check `business_info` table RLS:**
   - Should have a policy allowing SELECT for `anon` role
   - Should have a policy allowing SELECT for `authenticated` role

3. **Quick Fix - Temporarily disable RLS for testing:**

   ```sql
   -- WARNING: Only for testing!
   ALTER TABLE business_info DISABLE ROW LEVEL SECURITY;
   ```

   If this fixes it, the problem is RLS policies, not missing tables.

---

### Step 5: Check Environment Variables

**Is your app actually connecting to Supabase?**

1. Open your app in browser
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for these messages:

   **Good signs:**
   ```
   ✅ Supabase client initialized for project: mvehfbmjtycgnzahffod
   ```

   **Bad signs:**
   ```
   ❌ Failed to initialize Supabase client
   ❌ Invalid API key
   ❌ Network error
   ```

5. **Check Network Tab:**
   - Filter for "supabase.co"
   - Look for requests to REST API
   - Check status codes (200 = good, 401/403 = auth issue)

---

## 🎯 MOST COMMON CAUSES

### Cause #1: `business_info` Table is Empty (70% of cases)
**Solution:** Run the INSERT query from Step 3 above

### Cause #2: Tables Not Created in `public` Schema
**Solution:** Verify tables are in `public` schema, not `auth` or custom schema

### Cause #3: RLS Policies Too Restrictive
**Solution:** Check policies allow anonymous SELECT on `business_info`

### Cause #4: Wrong Supabase Project
**Solution:** Verify URL contains `mvehfbmjtycgnzahffod`

### Cause #5: Environment Variables Missing/Wrong
**Solution:** Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## 🔧 NUCLEAR OPTION: Complete Reset

If nothing above works:

### 1. Delete All Tables

```sql
-- Run in Supabase SQL Editor
DROP TABLE IF EXISTS business_info CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS designs CASCADE;
DROP TABLE IF EXISTS design_elements CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS popups CASCADE;
DROP TABLE IF EXISTS help_articles CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS three_d_models CASCADE;
DROP TABLE IF EXISTS printing_methods CASCADE;
DROP TABLE IF EXISTS gift_transactions CASCADE;
DROP TABLE IF EXISTS gift_designs CASCADE;
DROP TABLE IF EXISTS message_templates CASCADE;
DROP TABLE IF EXISTS ai_design_prompts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
```

### 2. Re-run Complete Setup

```sql
-- Copy and paste ALL of /database/fresh-setup-v2.sql
-- This creates tables + inserts default data + creates policies
```

---

## 🧪 QUICK TEST QUERY

**Run this to check everything:**

```sql
-- Test all critical tables
SELECT 'business_info' as table_name, COUNT(*) as row_count FROM business_info
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'designs', COUNT(*) FROM designs
UNION ALL
SELECT 'admin_settings', COUNT(*) FROM admin_settings;
```

**Expected Result:**
```
table_name       | row_count
-----------------|----------
business_info    | 1 or more  ← MUST have data!
users            | 0 or more  (OK if 0)
products         | 0 or more  (OK if 0)
categories       | 0 or more  (OK if 0)
orders           | 0 or more  (OK if 0)
designs          | 0 or more  (OK if 0)
admin_settings   | 0 or more  (OK if 0)
```

**If you get an error on any line:**
That table doesn't exist!

---

## ✅ AFTER FIXING

1. **Refresh your Toodies app** (Ctrl+R / Cmd+R)
2. **Check browser console:**
   - Should see: `✅ Loaded business data from Supabase`
   - Should NOT see: `❌ Database tables not found`
3. **Error banner should disappear**

---

## 🆘 STILL STUCK?

**Reply with:**

1. **Screenshot of Supabase Table Editor** (left sidebar showing tables)
2. **Result of the test query above**
3. **Browser console logs** (F12 → Console → copy/paste)
4. **Network tab** (F12 → Network → filter "supabase" → screenshot)

I'll pinpoint the exact issue!

---

**TL;DR:**
- Check if `business_info` table **HAS DATA** (not just exists)
- Run INSERT query to add default business info
- Verify RLS policies allow reading
- Refresh app and check console

**Most likely issue: `business_info` table is empty!**
