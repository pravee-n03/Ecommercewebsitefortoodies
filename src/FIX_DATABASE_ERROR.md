# 🔧 Fix "Database Tables Not Found" Error

## ❌ Current Error:
```
Database tables not found
Run: /database/fresh-setup-v2.sql in Supabase SQL Editor
```

---

## ✅ THE FIX (Choose Your Speed)

### 🚀 Super Fast (1 minute)
→ **[DATABASE_1MIN_FIX.md](/DATABASE_1MIN_FIX.md)** - Quick copy/paste

### 📖 Detailed Guide (2 minutes)
→ **[DATABASE_FIX_NOW.md](/DATABASE_FIX_NOW.md)** - Step-by-step with visuals

---

## 🎯 What You Need to Do

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Open Supabase SQL Editor                           │
│     https://supabase.com/dashboard/...                 │
│                                                         │
│  2. Copy SQL from /database/fresh-setup-v2.sql         │
│                                                         │
│  3. Paste → Click RUN                                  │
│                                                         │
│  4. Refresh your app (Ctrl+Shift+R)                    │
│                                                         │
│  ✅ Done!                                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 What the SQL Does

This SQL script will:

✅ **Create 20 database tables**:
- users
- categories  
- products
- product_variations
- printing_methods
- saved_customer_designs
- cart_items
- orders
- order_items
- coupons
- business_info
- admin_settings
- ai_config
- ai_feature_settings
- ai_provider_configs
- three_d_model_configs
- message_templates
- help_articles
- popup_messages
- invoices
- invoice_items

✅ **Set up Row Level Security (RLS)**  
✅ **Create automatic triggers**  
✅ **Insert sample data**

**Time:** ~10 seconds to run

---

## 🔗 Quick Access Links

| Link | Purpose |
|------|---------|
| [Supabase SQL Editor](https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new) | Run SQL here |
| [Supabase Dashboard](https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod) | Check project status |
| `/database/fresh-setup-v2.sql` | SQL script to copy |
| `/DATABASE_1MIN_FIX.md` | Quick fix guide |
| `/DATABASE_FIX_NOW.md` | Detailed guide |

---

## 🎬 Visual Guide

```
   YOUR APP                    SUPABASE
      │                            │
      │  1. Shows error            │
      ├───────────────────────────>│
      │  "Tables not found"        │
      │                            │
      │                            │  2. Open SQL Editor
      │                            │     Copy script
      │                            │     Click RUN
      │                            ├────────┐
      │                            │        │
      │                            │  ✓ Creates 20 tables
      │                            │  ✓ Sets up security
      │                            │  ✓ Adds sample data
      │                            │        │
      │                            │<───────┘
      │  3. Refresh app            │
      │  (Ctrl+Shift+R)            │
      │                            │
      │<───────────────────────────┤
      │  ✅ Error gone!            │
      │  ✅ App working!           │
      │                            │
```

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Open Supabase SQL Editor | 10 seconds |
| Copy SQL script | 5 seconds |
| Paste & Run | 5 seconds |
| SQL execution | 10 seconds |
| Refresh app | 2 seconds |
| **TOTAL** | **~30 seconds** |

---

## 🆘 Common Issues

### Issue #1: "Project is paused"

**Solution:**
```
1. Go to Supabase dashboard
2. Click "Resume project" button  
3. Wait 30 seconds
4. Run SQL again
```

### Issue #2: "Can't find SQL Editor"

**Solution:**
```
1. Go to: https://supabase.com/dashboard
2. Click project: mvehfbmjtycgnzahffod
3. Left sidebar → "SQL Editor"
4. Click "New Query" button
```

### Issue #3: "SQL runs but error remains"

**Solution:**
```
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache
3. Try incognito/private window
4. Check browser console (F12) for errors
```

---

## ✅ Verification

After running the SQL, you should see:

**In Supabase:**
```sql
✅ Success. No rows returned
-- Plus notice messages about tables created
```

**In Your App:**
- ❌ Error banner disappears
- ✅ Settings page loads
- ✅ Admin dashboard works
- ✅ Products page loads

**Test Admin Login:**
- Email: `m78787531@gmail.com`
- Password: `9886510858@TcbToponeAdmin`

---

## 📋 Checklist

Before running SQL:
- [ ] Supabase project is active (not paused)
- [ ] You're logged into Supabase
- [ ] SQL Editor is open
- [ ] You have the complete SQL script

After running SQL:
- [ ] SQL executed without errors
- [ ] App refreshed (hard refresh)
- [ ] Error banner gone
- [ ] Admin login works
- [ ] Settings page loads

---

## 🎉 Success Looks Like This

**Before:**
```
┌──────────────────────────────────────┐
│ ⚠️ Database Setup Required          │
│ ❌ Database tables not found         │
│ 📋 Run: /database/fresh-setup-v2.sql│
└──────────────────────────────────────┘
```

**After:**
```
┌──────────────────────────────────────┐
│ Welcome to Toodies Admin             │
│ ✅ All systems operational           │
│ 📊 20 tables ready                   │
└──────────────────────────────────────┘
```

---

## 🚀 Ready?

**Pick your speed:**

1. **🏃 Fast Track (1 min):** [`DATABASE_1MIN_FIX.md`](/DATABASE_1MIN_FIX.md)
2. **📖 Detailed (2 min):** [`DATABASE_FIX_NOW.md`](/DATABASE_FIX_NOW.md)

**Or just do this:**

1. Open: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new
2. Copy: `/database/fresh-setup-v2.sql` (all 671 lines)
3. Paste → RUN
4. Refresh app

**Done!** ✨

---

**Questions?** Check the detailed guides above or look for error messages in browser console (F12).

**Last Updated:** April 4, 2026  
**Status:** Ready to fix your database in 30 seconds! 🚀
