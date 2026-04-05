-- ⚡ QUICK FIX: Insert Default Data to Fix "Database Tables Not Found" Error
-- Run this in Supabase SQL Editor if your tables exist but are empty

-- This fixes the error by adding required default data to business_info table
-- The app checks this table first - if empty, it shows "tables not found"

-- ============================================
-- 1. INSERT DEFAULT BUSINESS INFO
-- ============================================
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
  '{
    "instagram": "",
    "facebook": "",
    "twitter": "",
    "linkedin": ""
  }'::jsonb,
  '{
    "website": {
      "showWhatsApp": true,
      "showSocialMedia": true,
      "showPhone": true,
      "showEmail": true
    }
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. INSERT DEFAULT ADMIN SETTINGS
-- ============================================
INSERT INTO admin_settings (
  id,
  admin_password_hash,
  approval_required,
  payment_after_approval,
  smtp_settings,
  payment_gateway,
  platform_settings,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '$2a$10$YourHashedPasswordHere', -- You'll set real password through UI
  true,
  true,
  '{
    "host": "",
    "port": 587,
    "user": "",
    "from": "hello@toodies.com"
  }'::jsonb,
  '{
    "razorpay": {
      "enabled": false,
      "keyId": "",
      "mode": "test"
    },
    "stripe": {
      "enabled": false,
      "publishableKey": "",
      "mode": "test"
    }
  }'::jsonb,
  '{
    "maintenanceMode": false,
    "allowSignups": true,
    "requireEmailVerification": false
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. INSERT SAMPLE CATEGORIES (Optional)
-- ============================================
INSERT INTO categories (id, name, description, image_url, is_active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'T-Shirts', 'Custom printed t-shirts', '', true, NOW(), NOW()),
  (gen_random_uuid(), 'Hoodies', 'Custom printed hoodies', '', true, NOW(), NOW()),
  (gen_random_uuid(), 'Mugs', 'Custom printed mugs', '', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to confirm data was inserted:
SELECT 
  'business_info' as table_name, 
  COUNT(*) as row_count 
FROM business_info

UNION ALL

SELECT 
  'admin_settings', 
  COUNT(*) 
FROM admin_settings

UNION ALL

SELECT 
  'categories', 
  COUNT(*) 
FROM categories;

-- Expected output:
-- table_name      | row_count
-- ----------------|----------
-- business_info   | 1
-- admin_settings  | 1  
-- categories      | 3

-- ✅ If you see counts above, refresh your Toodies app!
-- The "Database tables not found" error should disappear.
