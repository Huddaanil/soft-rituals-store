-- ============================================================
-- Soft Rituals STORE — link to the Business App's costing
-- Adds one column: which Business-App product this shop product
-- is linked to, so its calculated "Selling price each" can flow in.
-- Additive + idempotent. Safe to run / re-run any time.
-- ============================================================

alter table public.store_products
  add column if not exists cost_ref text;
