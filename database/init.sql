-- Athletics Database
-- Player related tables

-- ============================================
-- Connection character set
-- ============================================
SET NAMES utf8mb4;

USE athletics;

-- ============================================
-- players
-- ============================================
CREATE TABLE players (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    uniform_number INT UNSIGNED NOT NULL,
    batting_hand VARCHAR(10) NOT NULL,
    throwing_hand VARCHAR(10) NOT NULL,
    profile_image VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_players_uniform_number (uniform_number)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- positions
-- ============================================
CREATE TABLE positions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_positions_name (name)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- player_positions
-- ============================================
CREATE TABLE player_positions (
    player_id BIGINT UNSIGNED NOT NULL,
    position_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (player_id, position_id),

    CONSTRAINT fk_player_positions_player
        FOREIGN KEY (player_id)
        REFERENCES players (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_player_positions_position
        FOREIGN KEY (position_id)
        REFERENCES positions (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- Initial position master data
-- ============================================
INSERT INTO positions (name) VALUES
('投手'),
('捕手'),
('一塁手'),
('二塁手'),
('三塁手'),
('遊撃手'),
('左翼手'),
('中堅手'),
('右翼手');


-- ============================================
-- Initial player data
-- ============================================
INSERT INTO players (
    name,
    uniform_number,
    batting_hand,
    throwing_hand,
    profile_image,
    is_active
) VALUES
(
    '今村 響',
    38,
    '右',
    '右',
    NULL,
    TRUE
),
(
    '岡嶋 竜也',
    6,
    '右',
    '右',
    NULL,
    TRUE
);


-- ============================================
-- Initial player-position assignments
-- ============================================

-- 今村 響 → 一塁手
INSERT INTO player_positions (
    player_id,
    position_id
)
SELECT
    p.id,
    pos.id
FROM players p
JOIN positions pos
    ON pos.name = '一塁手'
WHERE p.uniform_number = 38;


-- 岡嶋 竜也 → 投手
INSERT INTO player_positions (
    player_id,
    position_id
)
SELECT
    p.id,
    pos.id
FROM players p
JOIN positions pos
    ON pos.name = '投手'
WHERE p.uniform_number = 6;