-- ============================================
-- MIGRATION 009: Add collection_images + hero text columns to business_info
-- Run this in Supabase SQL Editor
-- ============================================

-- Add collection_images column (array of 4 image URLs for "Crafted for the Bold" section)
ALTER TABLE business_info
  ADD COLUMN IF NOT EXISTS collection_images JSONB DEFAULT '[]'::jsonb;

-- Optional: hero section text customization columns
ALTER TABLE business_info
  ADD COLUMN IF NOT EXISTS hero_heading TEXT,
  ADD COLUMN IF NOT EXISTS hero_subheading TEXT,
  ADD COLUMN IF NOT EXISTS hero_cta_primary TEXT,
  ADD COLUMN IF NOT EXISTS hero_cta_secondary TEXT;

-- Also ensure categories table has display_order and is_active columns
-- (needed if running the fresh-setup-v2 schema)
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Success notice
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 009 complete: collection_images + hero text columns added to business_info';
END $$;
