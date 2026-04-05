# ⚙️ NETLIFY ENVIRONMENT VARIABLES - COPY & PASTE

## 🎯 Quick Setup (30 Seconds)

### Step-by-Step:

1. **Go to Netlify Dashboard:**
   ```
   https://app.netlify.com/sites/[your-site-name]/settings/env
   ```

2. **Click "Add a variable"**

3. **Copy and paste these exactly:**

---

## 📋 Variable 1: Supabase URL

**Key:**
```
VITE_SUPABASE_URL
```

**Value:**
```
https://mvehfbmjtycgnzahffod.supabase.co
```

**Scope:** Select all (Production, Deploy Previews, Branch Deploys)

---

## 📋 Variable 2: Supabase Anonymous Key

**Key:**
```
VITE_SUPABASE_ANON_KEY
```

**Value:**
```
[GET THIS FROM SUPABASE - SEE BELOW]
```

**Scope:** Select all (Production, Deploy Previews, Branch Deploys)

---

## 🔑 How to Get Your Supabase Anonymous Key

### Method 1: Direct Link
1. Go to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/settings/api
2. Under "Project API keys" section
3. Find the key labeled **`anon` `public`**
4. Click the **copy icon** 📋
5. Paste into Netlify as `VITE_SUPABASE_ANON_KEY`

### Method 2: Manual Navigation
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: **mvehfbmjtycgnzahffod**
3. Click **Settings** (gear icon) in left sidebar
4. Click **API** in the settings menu
5. Copy the **`anon` `public`** key
6. Paste into Netlify

---

## ✅ Verification

After adding both variables, your Netlify environment variables page should show:

```
✅ VITE_SUPABASE_URL          = https://mvehfbmjtycgnzahffod.supabase.co
✅ VITE_SUPABASE_ANON_KEY     = eyJhbGci... (long string starting with "eyJ")
```

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T** use quotes around the values  
❌ **DON'T** use the service_role key (use anon/public key)  
❌ **DON'T** add trailing spaces  
❌ **DON'T** forget to select all scopes (Production, Previews, Branch)  

✅ **DO** copy the values exactly as shown  
✅ **DO** use the `anon` / `public` key (not `service_role`)  
✅ **DO** select all scopes for each variable  
✅ **DO** save after adding both variables  

---

## 🔒 Security Note

The **`anon` key** is safe to use in client-side code. It's called "anonymous" or "public" because:
- ✅ It's designed to be exposed in browser code
- ✅ Protected by Row Level Security (RLS) policies
- ✅ Cannot bypass security rules
- ✅ Only allows operations permitted by your RLS policies

**NEVER use the `service_role` key** in client-side code - it bypasses all security!

---

## 🎯 After Adding Variables

1. **Trigger a new deploy:**
   - Push new code, OR
   - Go to Deploys tab → Click "Trigger deploy" → "Clear cache and deploy site"

2. **Variables take effect on next build** (not retroactively)

3. **Verify in build logs:**
   ```
   Environment variables:
   - VITE_SUPABASE_URL (set)
   - VITE_SUPABASE_ANON_KEY (set)
   ```

---

## 📱 Testing Locally

To test with the same variables locally, create a `.env` file:

```bash
# .env (DO NOT COMMIT THIS FILE)
VITE_SUPABASE_URL=https://mvehfbmjtycgnzahffod.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ Important:** Add `.env` to your `.gitignore` to prevent committing secrets!

---

## ✅ Quick Checklist

- [ ] Added `VITE_SUPABASE_URL` in Netlify
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Netlify
- [ ] Both variables have all scopes selected
- [ ] Saved changes in Netlify dashboard
- [ ] Triggered new deploy
- [ ] Verified in build logs

---

## 🆘 Need Help?

**Issue:** Can't find Supabase project  
**Solution:** Your project ID is `mvehfbmjtycgnzahffod`

**Issue:** Can't see the anon key  
**Solution:** Go to Settings → API, look under "Project API keys"

**Issue:** Key starts with "eyJ..."  
**Solution:** ✅ Correct! That's the JWT format for Supabase keys

**Issue:** Variables not working after adding  
**Solution:** Clear cache and trigger new deploy

---

**Last Updated:** April 5, 2026  
**Status:** 🟢 Ready to configure
