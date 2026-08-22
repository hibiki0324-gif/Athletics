from pydantic import BaseModel


class MatchBatteryItem(BaseModel):
    pitcher_id: int
    catcher_id: int
    sequence_no: int
    entry_inning: int
    exit_inning: int | None = None


class MatchBatteriesUpdate(BaseModel):
    match_team_id: int
    batteries: list[MatchBatteryItem]


class MatchBatteryResponse(BaseModel):
    id: int
    match_team_id: int

    pitcher_id: int
    pitcher_name: str
    pitcher_uniform_number: int

    catcher_id: int
    catcher_name: str
    catcher_uniform_number: int

    sequence_no: int
    entry_inning: int
    exit_inning: int | None