-- ============================================================
-- V2: Initial development data
-- ============================================================

-- Development admin user
-- Password: Admin@123
-- BCrypt hash generated for development use only.

INSERT INTO users (
    name,
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
)
VALUES (
    'System Administrator',
    'admin@sih.local',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoO6Zx4LJQW5cF3fV9V7xWJjG5Zx4mJj7K',
    'ADMIN',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;