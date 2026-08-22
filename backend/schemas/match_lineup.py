from pydantic import BaseModel


class LineupEntryInput(BaseModel):
    player_id: int
    position_id: int
    batting_order: int
    entry_sequence: int
    entry_inning: int
    exit_inning: int | None = None
    is_starter: bool = False


class MatchLineupUpdate(BaseModel):
    match_team_id: int
    entries: list[LineupEntryInput]


class LineupEntryResponse(BaseModel):
    id: int
    player_id: int
    player_name: str
    uniform_number: int
    position_id: int
    position_name: str
    batting_order: int
    entry_sequence: int
    entry_inning: int
    exit_inning: int | None
    is_starter: bool


class MatchLineupResponse(BaseModel):
    match_team_id: int
    team_id: int
    team_name: str
    is_home: bool
    entries: list[LineupEntryResponse]