-- ============================================================
-- V4: Fix development admin password hash
-- Password: Admin@123
-- ============================================================

UPDATE users
SET password_hash = '$2a$10$o7Q3SOdj4LHmrnMvlvzAVOBLtoVqhfjfCu139DmM153A8zk/3t91W'
WHERE email = 'admin@sih.local';
