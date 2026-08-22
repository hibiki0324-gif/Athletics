from pydantic import BaseModel, ConfigDict, Field, model_validator


class MatchBattingStatItem(BaseModel):
    player_id: int

    at_bats: int = Field(default=0, ge=0)
    hits: int = Field(default=0, ge=0)
    doubles: int = Field(default=0, ge=0)
    triples: int = Field(default=0, ge=0)
    home_runs: int = Field(default=0, ge=0)
    runs_batted_in: int = Field(default=0, ge=0)
    walks: int = Field(default=0, ge=0)
    hit_by_pitch: int = Field(default=0, ge=0)
    sacrifice_bunts: int = Field(default=0, ge=0)
    sacrifice_flies: int = Field(default=0, ge=0)
    strikeouts: int = Field(default=0, ge=0)
    stolen_bases: int = Field(default=0, ge=0)

    @model_validator(mode="after")
    def validate_batting_stats(self):
        if self.hits > self.at_bats:
            raise ValueError(
                "安打数は打数を超えることができません"
            )

        if (
            self.doubles
            + self.triples
            + self.home_runs
            > self.hits
        ):
            raise ValueError(
                "二塁打、三塁打、本塁打の合計は安打数を超えることができません"
            )

        if self.strikeouts > self.at_bats:
            raise ValueError(
                "三振数は打数を超えることができません"
            )

        return self


class MatchBattingStatsUpdate(BaseModel):
    match_team_id: int
    stats: list[MatchBattingStatItem]


class MatchBattingStatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    match_team_id: int
    player_id: int
    player_name: str
    uniform_number: int

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