from pydantic import BaseModel


class InningInput(BaseModel):
    inning_number: int
    runs: int = 0


class MatchTeamInningsInput(BaseModel):
    match_team_id: int
    innings: list[InningInput]


class MatchInningsUpdate(BaseModel):
    teams: list[MatchTeamInningsInput]


class InningResponse(BaseModel):
    inning_number: int
    runs: int


class MatchTeamInningsResponse(BaseModel):
    match_team_id: int
    team_id: int
    team_name: str
    is_home: bool
    innings: list[InningResponse]