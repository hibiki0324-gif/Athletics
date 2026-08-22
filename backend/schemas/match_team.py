from pydantic import BaseModel


class MatchTeamInput(BaseModel):
    team_id: int
    is_home: bool
    final_score: int = 0


class MatchTeamsUpdate(BaseModel):
    teams: list[MatchTeamInput]


class MatchTeamResponse(BaseModel):
    id: int
    team_id: int
    team_name: str
    is_home: bool
    final_score: int