export type StatsRow = {
    rank: number;
    name: string;
    value: string;
};

export type SeasonBattingStat = {
    player_id: number;
    player_name: string;
    uniform_number: number;
    games: number;
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
    batting_average: number;
    on_base_percentage: number;
    slugging_percentage: number;
    ops: number;
};

export type LineupRow = {
    batting_order: number | undefined;
    entry_sequence: number;
    player_id: number | undefined;
    position_id: number | undefined;
    is_starter: boolean;
    entry_inning: number | undefined;
    exit_inning: number | null;
}

export type LineupEntryResponse = {
    id: number;
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

export type MatchLineupResponse = {
    match_team_id: number;
    team_id: number;
    team_name: string;
    is_home: boolean;
    entries: LineupEntryResponse[];
};