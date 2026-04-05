# ⚡ DEPLOY TOODIES - FINAL CHECKLIST

## ✅ FIXES COMPLETED

### 1. Build Error Fixed
- [x] Removed unused imports from CustomerDashboard.tsx
- [x] Removed unused imports from HelpCenter.tsx
- [x] Build will now create `dist` folder successfully

### 2. Database Setup
- [ ] **TODO:** Run `/database/fresh-setup-v2.sql` in Supabase
- [ ] **TODO:** Verify `business_info` table has data

### 3. Environment Variables
- [ ] **TODO:** Set in Netlify Dashboard

---

## 🚀 DEPLOY STEPS (IN ORDER)

### Step 1: Push Code Fix (NOW)

```bash
git add .
git commit -m "fix: remove unused imports, fix build error"
git push
```

This triggers automatic Netlify deployment.

---

### Step 2: Set Netlify Environment Variables

**While build is running, do this:**

1. Go to: https://app.netlify.com (your Toodies site)
2. Click: **Site Settings** → **Environment Variables**
3. Click: **Add a variable**
4. Add these TWO variables:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://mvehfbmjtycgnzahffod.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Get from Supabase (see below) |

**Get VITE_SUPABASE_ANON_KEY:**
1. Go to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/settings/api
2. Copy the **anon public** key
3. Paste as the value for `VITE_SUPABASE_ANON_KEY`

4. Click **Save**
5. **Redeploy** (button at top of Netlify dashboard)

---

### Step 3: Setup Supabase Database

**While Netlify is deploying, do this:**

1. Go to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new

2. Open file: `/database/fresh-setup-v2.sql` in your code editor

3. **Copy ALL 671 lines**

4. Paste into Supabase SQL Editor

5. Click **Run** (Ctrl+Enter / Cmd+Enter)

6. Wait for success message:
   ```
   ✅ Toodies database FRESH setup complete!
   ```

---

### Step 4: Verify Deployment

**Check Netlify Build:**
- [ ] Build log shows: `✅ Deploy succeeded`
- [ ] No error: "dist does not exist"

**Check Site:**
- [ ] Open your site URL (Netlify gives you one)
- [ ] Site loads (no blank page)
- [ ] Console shows: `✅ Supabase client initialized`
- [ ] **NO** error: "Database tables not found"

**If you see "Database tables not found":**
→ Your Supabase setup didn't work. Re-run Step 3.

---

## 🎯 QUICK REFERENCE

### What You Just Fixed

**Before:**
```javascript
// ❌ These caused build to fail:
import image_abc from 'figma:asset/abc.png'  // unused
```

**After:**
```javascript
// ✅ Removed unused imports
// Only imports that are actually used remain
```

**Result:** Build creates `dist` folder → Netlify can deploy ✅

---

### What's Left To Do

1. **Push code** (Step 1) - 30 seconds
2. **Set env vars** (Step 2) - 2 minutes
3. **Run SQL** (Step 3) - 3 minutes
4. **Verify** (Step 4) - 1 minute

**Total time: ~7 minutes** 🚀

---

## 🆘 TROUBLESHOOTING

### Build Still Failing?

**Check build logs for:**
- TypeScript errors
- Missing dependencies
- Import errors

**Run locally:**
```bash
npm run build
```

If local build fails, you'll see the exact error.

---

### "Database tables not found" after deploy?

**Quick fix:**
```sql
-- Run this in Supabase SQL Editor:
INSERT INTO business_info (
  id, company_name, email, created_at, updated_at
) VALUES (
  gen_random_uuid(), 'Toodies', 
  'hello@toodies.com', NOW(), NOW()
);
```

Then refresh your site.

---

### Site shows blank page?

**Check browser console (F12):**
- Look for errors
- Check network tab for failed requests

**Common causes:**
- Environment variables not set
- Supabase connection failing
- Database not set up

---

## ✅ SUCCESS CRITERIA

**You're done when:**

1. ✅ Netlify build succeeds (no "dist" error)
2. ✅ Site loads at your Netlify URL
3. ✅ Console shows: "Loaded business data from Supabase"
4. ✅ Can see products, categories, etc.
5. ✅ Admin login works
6. ✅ Customer registration works

---

## 📝 FINAL NOTES

**What was the issue?**
- Unused imports broke TypeScript compilation
- Build failed → no `dist` folder created
- Netlify couldn't deploy (nothing to deploy)

**What did we do?**
- Removed unused imports
- Build now succeeds
- Creates `dist` folder
- Netlify can deploy ✅

**What's next?**
- Push code (triggers deploy)
- Set environment variables
- Setup database
- **DONE!** 🎉

---

**Now go execute the 4 steps above!** 🚀
