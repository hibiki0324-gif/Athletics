from datetime import date, time

from pydantic import BaseModel, ConfigDict


class MatchCreate(BaseModel):
    season_id: int
    match_date: date
    start_time: time | None = None
    venue: str | None = None


class MatchUpdate(BaseModel):
    season_id: int
    match_date: date
    start_time: time | None = None
    venue: str | None = None


class MatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    season_id: int
    match_date: date
    start_time: time | None
    venue: str | None


class MatchDetailResponse(BaseModel):
    id: int

    season: dict

    match_date: date
    start_time: time | None
    venue: str | None

    teams: list[dict]
    innings: list[dict]
    lineup: list[dict]
    batting_stats: list[dict]
    batteries: list[dict]
    pitching_decisions: list[dict]