from pydantic import BaseModel


class SeasonPitchingDecisionResponse(BaseModel):
    player_id: int
    player_name: str
    uniform_number: int

    wins: int
    losses: int
    saves: int