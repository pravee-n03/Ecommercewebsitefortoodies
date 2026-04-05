# 🔧 Fix Database Tables Error - DO THIS NOW

## ❌ Error You're Seeing:

```
❌ Database tables not found
📋 Run: /database/fresh-setup-v2.sql in Supabase SQL Editor
```

---

## ✅ Fix in 3 Steps (2 minutes)

### **Step 1: Open Supabase SQL Editor**

Click this link (opens in new tab):

**🔗 https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod/sql/new**

Or manually:
1. Go to: https://supabase.com/dashboard
2. Click on project: **mvehfbmjtycgnzahffod**
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

---

### **Step 2: Copy the SQL Script**

**Method A: Copy from this project**

1. Open file: `/database/fresh-setup-v2.sql`
2. Select ALL (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)

**Method B: Use the script below** (scroll down to "Complete SQL Script")

---

### **Step 3: Run in Supabase**

1. Paste the SQL into the Supabase SQL Editor
2. Click **RUN** button (or press Ctrl+Enter / Cmd+Enter)
3. Wait 5-10 seconds
4. Look for success message:

```
✅ Success. No rows returned
```

---

## 🎯 Visual Guide

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
├─────────────────────────────────────────┤
│  Left Sidebar:                          │
│  ├─ 🏠 Home                             │
│  ├─ 🗄️  Database                        │
│  ├─ 📊 SQL Editor  ← CLICK HERE        │
│  ├─ 🔐 Authentication                   │
│  └─ ⚙️  Settings                        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  SQL Editor                             │
├─────────────────────────────────────────┤
│  [+ New Query]  ← CLICK HERE           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Paste SQL here →                  │ │
│  │                                   │ │
│  │ DROP TABLE IF EXISTS...           │ │
│  │ CREATE TABLE users...             │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [▶ RUN]  ← CLICK TO EXECUTE           │
└─────────────────────────────────────────┘
```

---

## 📋 What This Script Does

The SQL script will:

1. **Drop all existing tables** (clean slate)
2. **Create 20 new tables**:
   - ✅ users
   - ✅ categories
   - ✅ products
   - ✅ product_variations
   - ✅ printing_methods
   - ✅ saved_customer_designs
   - ✅ cart_items
   - ✅ orders
   - ✅ order_items
   - ✅ coupons
   - ✅ business_info
   - ✅ admin_settings
   - ✅ ai_config
   - ✅ ai_feature_settings
   - ✅ ai_provider_configs
   - ✅ three_d_model_configs
   - ✅ message_templates
   - ✅ help_articles
   - ✅ popup_messages
   - ✅ invoices
   - ✅ invoice_items

3. **Set up Row Level Security (RLS)**
4. **Create user profile trigger**
5. **Insert sample data** (categories, printing methods)

---

## 🔍 Verification

After running the SQL:

1. **Refresh your Toodies app**
2. **Check for error banner**:
   - ❌ Before: "Database tables not found"
   - ✅ After: Banner disappears!

3. **Try admin login**:
   - Email: `m78787531@gmail.com`
   - Password: `9886510858@TcbToponeAdmin`

4. **Navigate to Settings**:
   - If Settings page loads → ✅ Database working!

---

## 🆘 Troubleshooting

### "Supabase project is paused"

**Solution:**
1. Go to: https://supabase.com/dashboard/project/mvehfbmjtycgnzahffod
2. Click **Resume project** button
3. Wait 30 seconds
4. Run SQL script again

### "Permission denied" error

**Solution:**
1. Make sure you're logged into Supabase
2. Make sure you're on the correct project: `mvehfbmjtycgnzahffod`
3. You need **Owner** or **Admin** access to run SQL

### "Syntax error" in SQL

**Solution:**
1. Make sure you copied the **entire** SQL script
2. Don't modify any SQL code
3. Check for any extra characters at beginning/end
4. Re-copy from `/database/fresh-setup-v2.sql`

### SQL runs but app still shows error

**Solution:**
1. Hard refresh the app (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Open app in incognito/private window
4. Check browser console (F12) for specific errors

---

## 📦 Complete SQL Script (671 lines)

**⚠️ Important: Copy this ENTIRE script (scroll to see all)**

```sql
-- ============================================
-- TOODIES FRESH DATABASE SETUP V2
-- This will DROP existing tables and recreate them
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. DROP ALL EXISTING TABLES (CASCADE)
-- ============================================

DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS popup_messages CASCADE;
DROP TABLE IF EXISTS help_articles CASCADE;
DROP TABLE IF EXISTS message_templates CASCADE;
DROP TABLE IF EXISTS three_d_model_configs CASCADE;
DROP TABLE IF EXISTS ai_config CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS business_info CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS saved_customer_designs CASCADE;
DROP TABLE IF EXISTS printing_methods CASCADE;
DROP TABLE IF EXISTS product_variations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop AI feature tables
DROP TABLE IF EXISTS ai_provider_configs CASCADE;
DROP TABLE IF EXISTS ai_feature_settings CASCADE;

-- Drop helper function
DROP FUNCTION IF EXISTS is_admin();

-- Drop trigger and function for auto user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  is_verified BOOLEAN DEFAULT false,
  mobile_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  model_3d_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variations (sizes, colors, etc.)
CREATE TABLE product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  price DECIMAL(10,2) NOT NULL,
  additional_price DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Printing Methods
CREATE TABLE printing_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_unit DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Customer Designs (with approval workflow)
CREATE TABLE saved_customer_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  design_name TEXT NOT NULL,
  design_data JSONB NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variation_id UUID REFERENCES product_variations(id) ON DELETE SET NULL,
  printing_method_id UUID REFERENCES printing_methods(id) ON DELETE SET NULL,
  preview_image_url TEXT,
  estimated_price DECIMAL(10,2),
  admin_set_price DECIMAL(10,2),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approval_date TIMESTAMPTZ,
  approval_notes TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'submitted', 'approved', 'in_production')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES product_variations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  custom_design_id UUID REFERENCES saved_customer_designs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variation_id UUID REFERENCES product_variations(id) ON DELETE SET NULL,
  color TEXT,
  size TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  custom_design_url TEXT,
  two_d_design_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Info
CREATE TABLE business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  tax_id TEXT,
  logo_url TEXT,
  website TEXT,
  social_media JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Settings
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency TEXT DEFAULT 'USD',
  tax_rate DECIMAL(5,2) DEFAULT 0,
  shipping_enabled BOOLEAN DEFAULT true,
  default_shipping_cost DECIMAL(10,2) DEFAULT 0,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  maintenance_mode BOOLEAN DEFAULT false,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy AI Config (kept for backwards compatibility)
CREATE TABLE ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('none', 'replicate', 'stability', 'custom')),
  api_key TEXT,
  is_enabled BOOLEAN DEFAULT false,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Feature Settings (global toggles)
CREATE TABLE ai_feature_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL,
  feature_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Provider Configs (Paperspace, etc.)
CREATE TABLE ai_provider_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('image', 'text', 'both')),
  is_active BOOLEAN DEFAULT false,
  api_key TEXT,
  endpoint TEXT,
  model TEXT,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3D Model Configs
CREATE TABLE three_d_model_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  model_url TEXT NOT NULL,
  texture_urls JSONB,
  camera_position JSONB,
  camera_target JSONB,
  light_settings JSONB,
  annotations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message Templates
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms', 'notification')),
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Help Articles
CREATE TABLE help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Popup Messages
CREATE TABLE popup_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  target_page TEXT,
  display_duration INTEGER DEFAULT 5000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  billing_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE printing_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_customer_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feature_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE popup_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  USING (is_admin());

-- Categories policies
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- Products policies
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (is_admin());

-- Product variations policies
CREATE POLICY "Anyone can view product variations"
  ON product_variations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product variations"
  ON product_variations FOR ALL
  USING (is_admin());

-- Printing methods policies
CREATE POLICY "Anyone can view active printing methods"
  ON printing_methods FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage printing methods"
  ON printing_methods FOR ALL
  USING (is_admin());

-- Saved designs policies
CREATE POLICY "Users can view their own designs"
  ON saved_customer_designs FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can create their own designs"
  ON saved_customer_designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
  ON saved_customer_designs FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can delete their own designs"
  ON saved_customer_designs FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- Cart items policies
CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (is_admin());

-- Order items policies
CREATE POLICY "Users can view their order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can manage order items"
  ON order_items FOR ALL
  USING (is_admin());

-- Coupons policies
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (is_admin());

-- Business info policies
CREATE POLICY "Anyone can view business info"
  ON business_info FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage business info"
  ON business_info FOR ALL
  USING (is_admin());

-- Admin settings policies
CREATE POLICY "Admins can view settings"
  ON admin_settings FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage settings"
  ON admin_settings FOR ALL
  USING (is_admin());

-- AI config policies
CREATE POLICY "Admins can view AI config"
  ON ai_config FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage AI config"
  ON ai_config FOR ALL
  USING (is_admin());

-- AI feature settings policies
CREATE POLICY "Anyone can view AI feature settings"
  ON ai_feature_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage AI feature settings"
  ON ai_feature_settings FOR ALL
  USING (is_admin());

-- AI provider configs policies
CREATE POLICY "Admins can view AI provider configs"
  ON ai_provider_configs FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage AI provider configs"
  ON ai_provider_configs FOR ALL
  USING (is_admin());

-- 3D model configs policies
CREATE POLICY "Anyone can view 3D model configs"
  ON three_d_model_configs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage 3D model configs"
  ON three_d_model_configs FOR ALL
  USING (is_admin());

-- Message templates policies
CREATE POLICY "Admins can manage message templates"
  ON message_templates FOR ALL
  USING (is_admin());

-- Help articles policies
CREATE POLICY "Anyone can view published help articles"
  ON help_articles FOR SELECT
  USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage help articles"
  ON help_articles FOR ALL
  USING (is_admin());

-- Popup messages policies
CREATE POLICY "Anyone can view active popup messages"
  ON popup_messages FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage popup messages"
  ON popup_messages FOR ALL
  USING (is_admin());

-- Invoices policies
CREATE POLICY "Admins can manage invoices"
  ON invoices FOR ALL
  USING (is_admin());

-- Invoice items policies
CREATE POLICY "Admins can manage invoice items"
  ON invoice_items FOR ALL
  USING (is_admin());

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Auto-create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. INSERT SAMPLE DATA
-- ============================================

-- Sample categories
INSERT INTO categories (name, description, display_order) VALUES
  ('T-Shirts', 'Custom printed t-shirts', 1),
  ('Hoodies', 'Custom hoodies and sweatshirts', 2),
  ('Mugs', 'Custom printed mugs', 3),
  ('Posters', 'Custom posters and wall art', 4);

-- Sample printing methods
INSERT INTO printing_methods (name, description, price_per_unit) VALUES
  ('DTG Printing', 'Direct to Garment - Best for detailed designs', 5.00),
  ('Screen Printing', 'Traditional screen printing - Best for bulk orders', 3.00),
  ('Sublimation', 'Dye sublimation printing - Best for all-over prints', 7.00),
  ('Vinyl Cut', 'Cut vinyl graphics - Best for simple designs', 4.00);

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Show success message
DO $$
BEGIN
  RAISE NOTICE '✅ Toodies database FRESH setup complete! All 20 tables created.';
  RAISE NOTICE '📋 Tables: users, categories, products, product_variations, printing_methods,';
  RAISE NOTICE '           saved_customer_designs, cart_items, orders, order_items, coupons,';
  RAISE NOTICE '           business_info, admin_settings, ai_config, ai_feature_settings,';
  RAISE NOTICE '           ai_provider_configs, three_d_model_configs, message_templates,';
  RAISE NOTICE '           help_articles, popup_messages, invoices, invoice_items';
  RAISE NOTICE '🔐 Row Level Security (RLS) enabled on all tables';
  RAISE NOTICE '🎯 Sample data inserted: 4 categories, 4 printing methods';
  RAISE NOTICE '✨ Automatic user profile creation trigger activated';
END $$;
```

---

## ✅ After Running SQL

1. **Refresh your Toodies app**
2. **Error banner should disappear**
3. **Try logging in as admin**
4. **Navigate to Settings to confirm database is working**

---

## 📞 Still Having Issues?

If the error persists after running the SQL:

1. **Check Supabase project status**:
   - Go to dashboard
   - Make sure project is not paused
   - Check for any alerts

2. **Verify SQL ran successfully**:
   - Look for green checkmark in SQL Editor
   - Check for error messages in red

3. **Hard refresh the app**:
   - Press Ctrl+Shift+R (Windows/Linux)
   - Press Cmd+Shift+R (Mac)

4. **Check browser console**:
   - Press F12
   - Click "Console" tab
   - Look for specific error messages

---

**Your database will be ready in 2 minutes!** 🚀
