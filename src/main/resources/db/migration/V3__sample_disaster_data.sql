-- ============================================================
-- V3: Sample Comprehensive Disaster Management & Relocation Data
-- For SIH 26191 Demonstration
-- ============================================================

-- 1. HABITATIONS (Disaster-prone settlements)
INSERT INTO habitations (id, name, district, state, population, households, vulnerability_score, geometry, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'Mundakkai Hamlet', 'Wayanad', 'Kerala', 980, 220, 94.5, ST_SetSRID(ST_MakePoint(76.1812, 11.5458), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111102', 'Chooralmala Village', 'Wayanad', 'Kerala', 1420, 310, 89.0, ST_SetSRID(ST_MakePoint(76.1661, 11.5362), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111103', 'Attamala Settlement', 'Wayanad', 'Kerala', 640, 140, 82.0, ST_SetSRID(ST_MakePoint(76.1554, 11.5198), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111104', 'Manohar Bagh Sector', 'Chamoli', 'Uttarakhand', 1850, 390, 91.5, ST_SetSRID(ST_MakePoint(79.5667, 30.5583), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111105', 'Sunil Ward Habitation', 'Chamoli', 'Uttarakhand', 1220, 260, 86.0, ST_SetSRID(ST_MakePoint(79.5721, 30.5645), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111106', 'Singhdhar Zone B', 'Chamoli', 'Uttarakhand', 1450, 310, 88.5, ST_SetSRID(ST_MakePoint(79.5612, 30.5521), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111107', 'Samej Village', 'Shimla', 'Himachal Pradesh', 780, 160, 84.0, ST_SetSRID(ST_MakePoint(77.6251, 31.4285), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111108', 'Malana Riparian Ward', 'Kullu', 'Himachal Pradesh', 1100, 215, 78.5, ST_SetSRID(ST_MakePoint(77.2644, 32.0621), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111109', 'Garamur Char Settlement', 'Majuli', 'Assam', 2400, 490, 76.0, ST_SetSRID(ST_MakePoint(94.2215, 26.9642), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111110', 'Satgharia Coastal Ward', 'Kendrapara', 'Odisha', 1600, 340, 79.5, ST_SetSRID(ST_MakePoint(86.9241, 20.7142), 4326), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 2. HAZARD EVENTS
INSERT INTO hazard_events (id, hazard_type, severity, event_date, source, description, geometry, created_at)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'LANDSLIDE', 96.0, '2024-07-30', 'Geological Survey of India', 'Catastrophic debris flow originating from Vellarimala hills engulfing settlements along riverbed', ST_SetSRID(ST_MakePoint(76.1750, 11.5420), 4326), CURRENT_TIMESTAMP),
    ('22222222-2222-2222-2222-222222222202', 'LAND_SUBSIDENCE', 92.5, '2023-01-05', 'Wadia Institute of Himalayan Geology', 'Severe land subsidence with widening ground fissures and structural damages across slopes', ST_SetSRID(ST_MakePoint(79.5650, 30.5590), 4326), CURRENT_TIMESTAMP),
    ('22222222-2222-2222-2222-222222222203', 'CLOUDBURST', 88.0, '2024-08-01', 'India Meteorological Department', 'Intense localized cloudburst triggering flash floods and debris sweeps in Rampur sub-division', ST_SetSRID(ST_MakePoint(77.6200, 31.4250), 4326), CURRENT_TIMESTAMP),
    ('22222222-2222-2222-2222-222222222204', 'RIVER_EROSION', 79.0, '2024-06-18', 'Assam Water Resources Dept', 'Massive riverbank erosion by Brahmaputra River cutting into habited embankment zones', ST_SetSRID(ST_MakePoint(94.2150, 26.9600), 4326), CURRENT_TIMESTAMP),
    ('22222222-2222-2222-2222-222222222205', 'COASTAL_INUNDATION', 82.0, '2024-05-26', 'Odisha State Disaster Management Authority', 'Sea water ingress and high storm surges during cyclonic depression', ST_SetSRID(ST_MakePoint(86.9200, 20.7100), 4326), CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 3. RED ZONES (Unsafe hazard boundaries)
INSERT INTO red_zones (id, name, risk_level, reason, source, geometry, is_active, created_at, updated_at)
VALUES
    ('33333333-3333-3333-3333-333333333301', 'Wayanad Landslide Core Funnel', 'CRITICAL', 'Direct debris flow channel with 40+ degree slope instability and high rain trigger vulnerability', 'GSI / SDMA Kerala', ST_Multi(ST_GeomFromText('POLYGON((76.155 11.525, 76.195 11.525, 76.195 11.560, 76.155 11.560, 76.155 11.525))', 4326)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-3333-3333-3333-333333333302', 'Joshimath Subsidence Crown Zone', 'CRITICAL', 'Deep-seated shear failure plane with ongoing subterranean water piping and ground slippage', 'CBRI / NGRI', ST_Multi(ST_GeomFromText('POLYGON((79.550 30.545, 79.585 30.545, 79.585 30.575, 79.550 30.575, 79.550 30.545))', 4326)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-3333-3333-3333-333333333303', 'Samej Khad Flash Flood Path', 'HIGH', 'Ephemeral torrent basin susceptible to sudden catastrophic cloudburst surge discharge', 'HP State Disaster Management', ST_Multi(ST_GeomFromText('POLYGON((77.610 31.415, 77.640 31.415, 77.640 31.440, 77.610 31.440, 77.610 31.415))', 4326)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-3333-3333-3333-333333333304', 'Majuli Brahmaputra High Erosion Belt', 'HIGH', 'Unconsolidated alluvial soil experiencing acute toe-erosion at rates exceeding 25m/year', 'Brahmaputra Board', ST_Multi(ST_GeomFromText('POLYGON((94.200 26.945, 94.240 26.945, 94.240 26.980, 94.200 26.980, 94.200 26.945))', 4326)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-3333-3333-3333-333333333305', 'Satgharia Coastal Surge Danger Ring', 'MEDIUM', 'Intertidal lowlands subject to high sea level rise and recurring storm tidal breaches', 'INCOIS / OSDMA', ST_Multi(ST_GeomFromText('POLYGON((86.900 20.695, 86.945 20.695, 86.945 20.730, 86.900 20.730, 86.900 20.695))', 4326)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 4. RELOCATION SITES (Safe candidate relocation destinations)
INSERT INTO relocation_sites (id, name, district, state, available_area, existing_population, infrastructure_score, accessibility_score, safety_score, geometry, is_active, created_at, updated_at)
VALUES
    ('44444444-4444-4444-4444-444444444401', 'Meppadi Safe Ridge Township', 'Wayanad', 'Kerala', 125000, 350, 86.0, 88.0, 95.0, ST_SetSRID(ST_MakePoint(76.1280, 11.5540), 4326), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('44444444-4444-4444-4444-444444444402', 'Pipalkoti Terraced Habitat Complex', 'Chamoli', 'Uttarakhand', 180000, 600, 82.0, 84.0, 92.0, ST_SetSRID(ST_MakePoint(79.4298, 30.4312), 4326), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('44444444-4444-4444-4444-444444444403', 'Rampur Safe Heights Model Colony', 'Shimla', 'Himachal Pradesh', 95000, 280, 84.0, 86.0, 89.0, ST_SetSRID(ST_MakePoint(77.6050, 31.4010), 4326), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('44444444-4444-4444-4444-444444444404', 'Jorhat North Resilient Enclave', 'Jorhat', 'Assam', 220000, 850, 90.0, 92.0, 96.0, ST_SetSRID(ST_MakePoint(94.2180, 26.7580), 4326), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('44444444-4444-4444-4444-444444444405', 'Rajnagar Elevated Cyclone Shelter Zone', 'Kendrapara', 'Odisha', 140000, 480, 85.0, 82.0, 93.0, ST_SetSRID(ST_MakePoint(86.8610, 20.5820), 4326), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 5. CARRYING CAPACITY ASSESSMENTS
INSERT INTO capacity_assessments (id, relocation_site_id, available_area, existing_population, estimated_capacity, available_capacity, infrastructure_capacity_score, water_capacity_score, accessibility_score, overall_capacity_score, assessment_date)
VALUES
    ('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 125000, 350, 3500, 3150, 88.0, 91.0, 88.0, 89.0, CURRENT_TIMESTAMP),
    ('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444402', 180000, 600, 5100, 4500, 84.0, 86.0, 84.0, 84.6, CURRENT_TIMESTAMP),
    ('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444403', 95000, 280, 2700, 2420, 83.0, 85.0, 86.0, 84.6, CURRENT_TIMESTAMP),
    ('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444404', 220000, 850, 6200, 5350, 91.0, 94.0, 92.0, 92.3, CURRENT_TIMESTAMP),
    ('55555555-5555-5555-5555-555555555505', '44444444-4444-4444-4444-444444444405', 140000, 480, 4000, 3520, 86.0, 88.0, 82.0, 85.3, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 6. DISASTER HISTORY
INSERT INTO disaster_history (id, habitation_id, hazard_type, event_date, severity, affected_population, deaths, property_loss, source)
VALUES
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111101', 'LANDSLIDE', '2024-07-30', 98.0, 890, 214, 45000000, 'Kerala SDMA Official Report'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111102', 'LANDSLIDE', '2024-07-30', 95.0, 1350, 168, 62000000, 'Kerala SDMA Official Report'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111104', 'LAND_SUBSIDENCE', '2023-01-10', 92.0, 1600, 0, 85000000, 'Uttarakhand Disaster Management Authority'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111107', 'CLOUDBURST', '2024-08-01', 89.0, 720, 14, 18000000, 'HP State Revenue & Disaster Dept')
ON CONFLICT (id) DO NOTHING;
