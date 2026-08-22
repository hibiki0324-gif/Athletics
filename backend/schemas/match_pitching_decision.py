from typing import Literal

from pydantic import BaseModel, ConfigDict


PitchingDecisionType = Literal[
    "WIN",
    "LOSS",
    "SAVE",
]


class MatchPitchingDecisionItem(BaseModel):
    player_id: int
    decision: PitchingDecisionType


class MatchPitchingDecisionResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    match_id: int
    player_id: int
    player_name: str
    uniform_number: int
    decision: PitchingDecisionType


class MatchPitchingDecisionUpdate(BaseModel):
    decisions: list[MatchPitchingDecisionItem]