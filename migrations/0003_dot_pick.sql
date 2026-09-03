ALTER TABLE apps ADD COLUMN is_dot_pick INTEGER NOT NULL DEFAULT 0 CHECK (is_dot_pick IN (0, 1));

CREATE UNIQUE INDEX IF NOT EXISTS apps_single_dot_pick
ON apps(is_dot_pick)
WHERE is_dot_pick = 1;
