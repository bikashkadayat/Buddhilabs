-- Buddhi Labs - leads table (PostgreSQL). Created automatically by server.js on first start; kept for reference/migrations.
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid() on PostgreSQL < 13

CREATE TABLE IF NOT EXISTS leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(150) NOT NULL,
  organization  VARCHAR(150),
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(50),
  interest      VARCHAR(100) NOT NULL,
  budget_range  VARCHAR(100),
  message       TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  source_page   VARCHAR(255),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_interest   ON leads (interest);
