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