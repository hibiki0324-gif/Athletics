export type Season = {
    id: number;
    year: number;
    name: string;
};

export type MatchTeam = {
    id: number;
    team_id: number;
    team_name: string;
    is_home: boolean;
    final_score: number;
};

export type Inning = {
    inning_number: number;
    runs: number;
};

export type MatchTeamInnings = {
    match_team_id: number;
    team_id: number;
    team_name: string;
    is_home: boolean;
    innings: Inning[];
};

export type LineupEntry = {
    id: number;
    match_team_id: number;
    player_id: number;
    player_name: string;
    uniform_number: number;
    position_id: number;
    position_name: string;
    batting_order: number;
    entry_sequence: number;
    entry_inning: number;
    exit_inning: number | null;
    is_starter: boolean;
};

export type BattingStat = {
    id: number;
    match_team_id: number;
    player_id: number;
    player_name: string;
    uniform_number: number;
    at_bats: number;
    hits: number;
    doubles: number;
    triples: number;
    home_runs: number;
    runs_batted_in: number;
    walks: number;
    hit_by_pitch: number;
    sacrifice_bunts: number;
    sacrifice_flies: number;
    strikeouts: number;
    stolen_bases: number;
};

export type Battery = {
    id: number;
    match_team_id: number;
    pitcher_id: number;
    pitcher_name: string;
    pitcher_uniform_number: number;
    catcher_id: number;
    catcher_name: string;
    catcher_uniform_number: number;
    sequence_no: number;
    entry_inning: number;
    exit_inning: number | null;
};

export type PitchingDecision = {
    id: number;
    match_id: number;
    player_id: number;
    player_name: string;
    uniform_number: number;
    decision: "WIN" | "LOSS" | "SAVE";
};

export type MatchDetail = {
    id: number;
    season: Season;
    match_date: string;
    start_time: string | null;
    venue: string | null;
    teams: MatchTeam[];
    innings: MatchTeamInnings[];
    lineup: LineupEntry[];
    batting_stats: BattingStat[];
    batteries: Battery[];
    pitching_decisions: PitchingDecision[];
};