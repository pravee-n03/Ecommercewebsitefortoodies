# 🚀 EXECUTE DATABASE SETUP NOW

## ⚡ Quick Start (3 Steps)

### Step 1: Open Supabase SQL Editor
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **mvehfbmjtycgnzahffod**
3. Click **SQL Editor** in the left sidebar (or go directly to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new)

### Step 2: Copy & Paste the SQL
1. Open the file: **`/database/fresh-setup-v2.sql`**
2. Copy **ALL** the contents (671 lines)
3. Paste into the Supabase SQL Editor

### Step 3: Run It!
1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait ~5-10 seconds for completion
3. You should see: ✅ `"Toodies database FRESH setup complete! All 20 tables created with RLS policies and auto-trigger for admin user."`

---

## ✅ What This Does

This script will:
- **DROP** all existing tables (if any) to start fresh
- **CREATE** all 20 tables needed for Toodies:
  - `users` (extends auth.users with automatic trigger)
  - `categories`, `products`, `product_variations`
  - `printing_methods`, `saved_customer_designs`
  - `cart_items`, `orders`, `order_items`
  - `coupons`, `business_info`, `admin_settings`
  - `ai_config`, `three_d_model_configs`
  - `message_templates`, `help_articles`, `popup_messages`
  - `invoices`, `invoice_items`
  - `chat_conversations`, `chat_messages`
- **CREATE** indexes for performance
- **ENABLE** Row Level Security (RLS) on all tables
- **CREATE** the `is_admin()` helper function
- **CREATE** all RLS policies for secure data access
- **CREATE** automatic trigger to populate `users` table from `auth.users`
- **SET** your email (`m78787531@gmail.com`) as admin automatically

---

## 🔐 Admin Account

When you sign up with **m78787531@gmail.com**, the trigger will automatically:
- Create a user profile in the `users` table
- Set your `role` to `'admin'`
- Give you full admin access to the platform

**Any other email** will be set as `role = 'customer'` automatically.

---

## 🎯 After Running This

Once you've executed the SQL script:

1. ✅ **All database tables will be ready**
2. ✅ **RLS policies will protect your data**
3. ✅ **Admin account will auto-create on first signup**
4. ✅ **Your app will work with Supabase (no more "table does not exist" errors)**

---

## 🆘 Troubleshooting

### Error: "permission denied"
- Make sure you're logged into Supabase
- Make sure you selected the correct project

### Error: "function auth.uid() does not exist"
- You might be in the wrong database
- Make sure you're in the **SQL Editor** (not the Table Editor)

### Tables not showing up
- Go to **Table Editor** in the left sidebar
- Refresh the page
- You should see all 20 tables listed

---

## 📋 Quick Copy Command

If you're on a Unix/Mac system and want to copy the file to clipboard:

```bash
cat database/fresh-setup-v2.sql | pbcopy
```

Or on Linux:
```bash
cat database/fresh-setup-v2.sql | xclip -selection clipboard
```

---

## 🎉 You're All Set!

After running this script, your Toodies platform will be ready to:
- Accept user signups
- Create custom designs
- Manage products and orders
- Handle the admin approval workflow
- Process payments
- And everything else!

**Now go run that SQL script! 🚀**
