-- ============================================================
-- V5: Add Hazard & RedZone Provenance (Auditable Data Origin)
-- ============================================================

-- Add external provenance fields to hazard_events
ALTER TABLE hazard_events
    ADD COLUMN IF NOT EXISTS external_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_hazard_events_external_id
    ON hazard_events(external_id);

-- Add external provenance fields to red_zones
ALTER TABLE red_zones
    ADD COLUMN IF NOT EXISTS external_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_red_zones_external_id
    ON red_zones(external_id);

-- Ensure all legacy / seed records carry an honest, transparent source tag
UPDATE hazard_events
SET source = 'MANUAL_FIELD_REPORT',
    fetched_at = COALESCE(created_at, CURRENT_TIMESTAMP)
WHERE source IS NULL OR source = '' OR source = 'SEED';

UPDATE red_zones
SET source = 'MANUAL_FIELD_REPORT',
    fetched_at = COALESCE(created_at, CURRENT_TIMESTAMP)
WHERE source IS NULL OR source = '' OR source = 'SEED';
