-- ============================================================
-- SIH Hazard-Based Red Zone & Relocation Assessment System
-- V1 - Initial Database Schema
-- PostgreSQL + PostGIS
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ANALYST',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_role
        CHECK (role IN ('ADMIN', 'AUTHORITY', 'ANALYST'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);


-- ============================================================
-- 2. HABITATIONS
-- ============================================================

CREATE TABLE habitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    population INTEGER NOT NULL DEFAULT 0,
    households INTEGER NOT NULL DEFAULT 0,
    vulnerability_score DOUBLE PRECISION DEFAULT 0,
    geometry GEOMETRY(Point, 4326),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_habitation_population
        CHECK (population >= 0),

    CONSTRAINT chk_habitation_households
        CHECK (households >= 0),

    CONSTRAINT chk_vulnerability_score
        CHECK (vulnerability_score >= 0 AND vulnerability_score <= 100)
);

CREATE INDEX idx_habitations_district
    ON habitations(district);

CREATE INDEX idx_habitations_state
    ON habitations(state);

CREATE INDEX idx_habitations_vulnerability
    ON habitations(vulnerability_score);

CREATE INDEX idx_habitations_geometry
    ON habitations USING GIST(geometry);


-- ============================================================
-- 3. HAZARD EVENTS
-- ============================================================

CREATE TABLE hazard_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hazard_type VARCHAR(50) NOT NULL,
    severity DOUBLE PRECISION NOT NULL DEFAULT 0,
    event_date DATE NOT NULL,
    source VARCHAR(255),
    description TEXT,
    geometry GEOMETRY(Geometry, 4326),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_hazard_severity
        CHECK (severity >= 0 AND severity <= 100)
);

CREATE INDEX idx_hazard_events_type
    ON hazard_events(hazard_type);

CREATE INDEX idx_hazard_events_date
    ON hazard_events(event_date);

CREATE INDEX idx_hazard_events_geometry
    ON hazard_events USING GIST(geometry);


-- ============================================================
-- 4. DISASTER HISTORY
-- ============================================================

CREATE TABLE disaster_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habitation_id UUID NOT NULL,
    hazard_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    severity DOUBLE PRECISION DEFAULT 0,
    affected_population INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    property_loss DOUBLE PRECISION DEFAULT 0,
    source VARCHAR(255),

    CONSTRAINT fk_disaster_habitation
        FOREIGN KEY (habitation_id)
        REFERENCES habitations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_disaster_severity
        CHECK (severity >= 0 AND severity <= 100),

    CONSTRAINT chk_affected_population
        CHECK (affected_population >= 0),

    CONSTRAINT chk_deaths
        CHECK (deaths >= 0),

    CONSTRAINT chk_property_loss
        CHECK (property_loss >= 0)
);

CREATE INDEX idx_disaster_history_habitation
    ON disaster_history(habitation_id);

CREATE INDEX idx_disaster_history_type
    ON disaster_history(hazard_type);

CREATE INDEX idx_disaster_history_date
    ON disaster_history(event_date);


-- ============================================================
-- 5. HAZARD ASSESSMENTS
-- ============================================================

CREATE TABLE hazard_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habitation_id UUID NOT NULL,
    flood_risk DOUBLE PRECISION DEFAULT 0,
    landslide_risk DOUBLE PRECISION DEFAULT 0,
    cloudburst_risk DOUBLE PRECISION DEFAULT 0,
    erosion_risk DOUBLE PRECISION DEFAULT 0,
    overall_hazard_score DOUBLE PRECISION DEFAULT 0,
    assessment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50),

    CONSTRAINT fk_assessment_habitation
        FOREIGN KEY (habitation_id)
        REFERENCES habitations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_flood_risk
        CHECK (flood_risk >= 0 AND flood_risk <= 100),

    CONSTRAINT chk_landslide_risk
        CHECK (landslide_risk >= 0 AND landslide_risk <= 100),

    CONSTRAINT chk_cloudburst_risk
        CHECK (cloudburst_risk >= 0 AND cloudburst_risk <= 100),

    CONSTRAINT chk_erosion_risk
        CHECK (erosion_risk >= 0 AND erosion_risk <= 100),

    CONSTRAINT chk_overall_hazard_score
        CHECK (overall_hazard_score >= 0 AND overall_hazard_score <= 100)
);

CREATE INDEX idx_assessments_habitation
    ON hazard_assessments(habitation_id);

CREATE INDEX idx_assessments_score
    ON hazard_assessments(overall_hazard_score);


-- ============================================================
-- 6. RED ZONES
-- ============================================================

CREATE TABLE red_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    risk_level VARCHAR(30) NOT NULL,
    reason TEXT,
    source VARCHAR(255),
    geometry GEOMETRY(MultiPolygon, 4326),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_red_zone_risk
        CHECK (risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'))
);

CREATE INDEX idx_red_zones_risk
    ON red_zones(risk_level);

CREATE INDEX idx_red_zones_geometry
    ON red_zones USING GIST(geometry);


-- ============================================================
-- 7. RELOCATION SITES
-- ============================================================

CREATE TABLE relocation_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    available_area DOUBLE PRECISION DEFAULT 0,
    existing_population INTEGER DEFAULT 0,
    infrastructure_score DOUBLE PRECISION DEFAULT 0,
    accessibility_score DOUBLE PRECISION DEFAULT 0,
    safety_score DOUBLE PRECISION DEFAULT 0,
    geometry GEOMETRY(Point, 4326),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_available_area
        CHECK (available_area >= 0),

    CONSTRAINT chk_existing_population
        CHECK (existing_population >= 0),

    CONSTRAINT chk_infrastructure_score
        CHECK (infrastructure_score >= 0 AND infrastructure_score <= 100),

    CONSTRAINT chk_accessibility_score
        CHECK (accessibility_score >= 0 AND accessibility_score <= 100),

    CONSTRAINT chk_safety_score
        CHECK (safety_score >= 0 AND safety_score <= 100)
);

CREATE INDEX idx_relocation_sites_district
    ON relocation_sites(district);

CREATE INDEX idx_relocation_sites_geometry
    ON relocation_sites USING GIST(geometry);


-- ============================================================
-- 8. CAPACITY ASSESSMENTS
-- ============================================================

CREATE TABLE capacity_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relocation_site_id UUID NOT NULL,
    available_area DOUBLE PRECISION DEFAULT 0,
    existing_population INTEGER DEFAULT 0,
    estimated_capacity INTEGER DEFAULT 0,
    available_capacity INTEGER DEFAULT 0,
    infrastructure_capacity_score DOUBLE PRECISION DEFAULT 0,
    water_capacity_score DOUBLE PRECISION DEFAULT 0,
    accessibility_score DOUBLE PRECISION DEFAULT 0,
    overall_capacity_score DOUBLE PRECISION DEFAULT 0,
    assessment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_capacity_site
        FOREIGN KEY (relocation_site_id)
        REFERENCES relocation_sites(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_estimated_capacity
        CHECK (estimated_capacity >= 0),

    CONSTRAINT chk_available_capacity
        CHECK (available_capacity >= 0),

    CONSTRAINT chk_infrastructure_capacity
        CHECK (infrastructure_capacity_score >= 0
               AND infrastructure_capacity_score <= 100),

    CONSTRAINT chk_water_capacity
        CHECK (water_capacity_score >= 0
               AND water_capacity_score <= 100),

    CONSTRAINT chk_capacity_accessibility
        CHECK (accessibility_score >= 0
               AND accessibility_score <= 100),

    CONSTRAINT chk_overall_capacity
        CHECK (overall_capacity_score >= 0
               AND overall_capacity_score <= 100)
);

CREATE INDEX idx_capacity_site
    ON capacity_assessments(relocation_site_id);

CREATE INDEX idx_capacity_score
    ON capacity_assessments(overall_capacity_score);


-- ============================================================
-- 9. RELOCATION PRIORITIES
-- ============================================================

CREATE TABLE relocation_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habitation_id UUID NOT NULL,
    hazard_score DOUBLE PRECISION DEFAULT 0,
    vulnerability_score DOUBLE PRECISION DEFAULT 0,
    historical_risk_score DOUBLE PRECISION DEFAULT 0,
    population_score DOUBLE PRECISION DEFAULT 0,
    overall_priority_score DOUBLE PRECISION DEFAULT 0,
    priority_level VARCHAR(30) NOT NULL,
    recommended_timeline VARCHAR(30),
    recommended_site_id UUID,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_priority_habitation
        FOREIGN KEY (habitation_id)
        REFERENCES habitations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_priority_site
        FOREIGN KEY (recommended_site_id)
        REFERENCES relocation_sites(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_priority_hazard
        CHECK (hazard_score >= 0 AND hazard_score <= 100),

    CONSTRAINT chk_priority_vulnerability
        CHECK (vulnerability_score >= 0 AND vulnerability_score <= 100),

    CONSTRAINT chk_priority_history
        CHECK (historical_risk_score >= 0 AND historical_risk_score <= 100),

    CONSTRAINT chk_priority_population
        CHECK (population_score >= 0 AND population_score <= 100),

    CONSTRAINT chk_priority_overall
        CHECK (overall_priority_score >= 0 AND overall_priority_score <= 100),

    CONSTRAINT chk_priority_level
        CHECK (priority_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),

    CONSTRAINT chk_recommended_timeline
        CHECK (
            recommended_timeline IS NULL OR
            recommended_timeline IN (
                'IMMEDIATE',
                'SHORT_TERM',
                'MEDIUM_TERM'
            )
        )
);

CREATE INDEX idx_priorities_habitation
    ON relocation_priorities(habitation_id);

CREATE INDEX idx_priorities_level
    ON relocation_priorities(priority_level);

CREATE INDEX idx_priorities_score
    ON relocation_priorities(overall_priority_score);

CREATE INDEX idx_priorities_site
    ON relocation_priorities(recommended_site_id);


-- ============================================================
-- END OF V1
-- ============================================================
