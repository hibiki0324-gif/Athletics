from pydantic import BaseModel


class SeasonBattingStatResponse(BaseModel):
    player_id: int
    player_name: str
    uniform_number: int

    games: int

    at_bats: int
    hits: int
    doubles: int
    triples: int
    home_runs: int
    runs_batted_in: int

    walks: int
    hit_by_pitch: int
    sacrifice_bunts: int
    sacrifice_flies: int

    strikeouts: int
    stolen_bases: int

    batting_average: float
    on_base_percentage: float
    slugging_percentage: float
    ops: float