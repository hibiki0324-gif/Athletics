-- Athletics Database
-- Player / Team / Match related tables

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
-- seasons
-- ============================================
CREATE TABLE seasons (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    year SMALLINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_seasons_year (year)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- teams
-- ============================================
CREATE TABLE teams (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_teams_name (name)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- matches
-- ============================================
CREATE TABLE matches (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    season_id BIGINT UNSIGNED NOT NULL,
    match_date DATE NOT NULL,
    start_time TIME NULL,
    venue VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_matches_season_date (season_id, match_date),
    KEY idx_matches_match_date (match_date),

    CONSTRAINT fk_matches_season
        FOREIGN KEY (season_id)
        REFERENCES seasons (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- match_teams
-- ============================================
CREATE TABLE match_teams (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_id BIGINT UNSIGNED NOT NULL,
    team_id BIGINT UNSIGNED NOT NULL,
    is_home BOOLEAN NOT NULL,
    final_score INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_match_teams_match_team (match_id, team_id),
    UNIQUE KEY uk_match_teams_match_home (match_id, is_home),

    KEY idx_match_teams_team (team_id),

    CONSTRAINT fk_match_teams_match
        FOREIGN KEY (match_id)
        REFERENCES matches (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_teams_team
        FOREIGN KEY (team_id)
        REFERENCES teams (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- match_innings
-- ============================================
CREATE TABLE match_innings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_team_id BIGINT UNSIGNED NOT NULL,
    inning_number SMALLINT UNSIGNED NOT NULL,
    runs INT UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (id),

    UNIQUE KEY uk_match_innings_team_inning (
        match_team_id,
        inning_number
    ),

    CONSTRAINT fk_match_innings_match_team
        FOREIGN KEY (match_team_id)
        REFERENCES match_teams (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- match_lineup_entries
--
-- A player appearance / defensive-position history
-- for a specific match.
-- ============================================
CREATE TABLE match_lineup_entries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_team_id BIGINT UNSIGNED NOT NULL,
    player_id BIGINT UNSIGNED NOT NULL,
    position_id BIGINT UNSIGNED NOT NULL,
    batting_order TINYINT UNSIGNED NOT NULL,
    entry_sequence SMALLINT UNSIGNED NOT NULL,
    entry_inning SMALLINT UNSIGNED NOT NULL,
    exit_inning SMALLINT UNSIGNED NULL,
    is_starter BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_match_lineup_entry_sequence (
        match_team_id,
        entry_sequence
    ),

    KEY idx_match_lineup_player (
        player_id
    ),

    KEY idx_match_lineup_batting_order (
        match_team_id,
        batting_order
    ),

    KEY idx_match_lineup_position (
        position_id
    ),

    CONSTRAINT fk_match_lineup_entries_match_team
        FOREIGN KEY (match_team_id)
        REFERENCES match_teams (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_lineup_entries_player
        FOREIGN KEY (player_id)
        REFERENCES players (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_lineup_entries_position
        FOREIGN KEY (position_id)
        REFERENCES positions (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- match_batting_stats
-- ============================================
CREATE TABLE match_batting_stats (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_team_id BIGINT UNSIGNED NOT NULL,
    player_id BIGINT UNSIGNED NOT NULL,

    at_bats INT UNSIGNED NOT NULL DEFAULT 0,
    hits INT UNSIGNED NOT NULL DEFAULT 0,
    doubles INT UNSIGNED NOT NULL DEFAULT 0,
    triples INT UNSIGNED NOT NULL DEFAULT 0,
    home_runs INT UNSIGNED NOT NULL DEFAULT 0,
    runs_batted_in INT UNSIGNED NOT NULL DEFAULT 0,

    walks INT UNSIGNED NOT NULL DEFAULT 0,
    hit_by_pitch INT UNSIGNED NOT NULL DEFAULT 0,

    sacrifice_bunts INT UNSIGNED NOT NULL DEFAULT 0,
    sacrifice_flies INT UNSIGNED NOT NULL DEFAULT 0,

    strikeouts INT UNSIGNED NOT NULL DEFAULT 0,
    stolen_bases INT UNSIGNED NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_match_batting_stats_team_player (
        match_team_id,
        player_id
    ),

    KEY idx_match_batting_stats_player (
        player_id
    ),

    CONSTRAINT fk_match_batting_stats_match_team
        FOREIGN KEY (match_team_id)
        REFERENCES match_teams (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_batting_stats_player
        FOREIGN KEY (player_id)
        REFERENCES players (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- match_pitching_decisions
--
-- Win / Loss / Save only.
-- Detailed pitching statistics are not managed
-- at this stage.
-- ============================================
CREATE TABLE match_pitching_decisions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_id BIGINT UNSIGNED NOT NULL,
    player_id BIGINT UNSIGNED NOT NULL,
    decision VARCHAR(10) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_match_pitching_decisions_player (
        match_id,
        player_id
    ),

    KEY idx_match_pitching_decisions_player (
        player_id
    ),

    CONSTRAINT chk_match_pitching_decisions_decision
        CHECK (decision IN ('WIN', 'LOSS', 'SAVE')),

    CONSTRAINT fk_match_pitching_decisions_match
        FOREIGN KEY (match_id)
        REFERENCES matches (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_pitching_decisions_player
        FOREIGN KEY (player_id)
        REFERENCES players (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- match_batteries
--
-- Battery history for a specific team in a match.
-- Multiple rows can exist when the pitcher/catcher
-- changes during a game.
-- ============================================
CREATE TABLE match_batteries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_team_id BIGINT UNSIGNED NOT NULL,
    pitcher_id BIGINT UNSIGNED NOT NULL,
    catcher_id BIGINT UNSIGNED NOT NULL,
    sequence_no SMALLINT UNSIGNED NOT NULL,
    entry_inning SMALLINT UNSIGNED NOT NULL,
    exit_inning SMALLINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_match_batteries_sequence (
        match_team_id,
        sequence_no
    ),

    KEY idx_match_batteries_pitcher (
        pitcher_id
    ),

    KEY idx_match_batteries_catcher (
        catcher_id
    ),

    CONSTRAINT fk_match_batteries_match_team
        FOREIGN KEY (match_team_id)
        REFERENCES match_teams (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_batteries_pitcher
        FOREIGN KEY (pitcher_id)
        REFERENCES players (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_match_batteries_catcher
        FOREIGN KEY (catcher_id)
        REFERENCES players (id)
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
-- Initial season master data
-- ============================================
INSERT INTO seasons (
    year,
    name
) VALUES (
    2026,
    '2026年シーズン'
);


-- ============================================
-- Initial team master data
-- ============================================
INSERT INTO teams (
    name,
    is_active
) VALUES (
    'アスレチックス',
    TRUE
);


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