from pydantic import BaseModel, ConfigDict


class SeasonCreate(BaseModel):
    year: int
    name: str


class SeasonUpdate(BaseModel):
    year: int
    name: str


class SeasonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    year: int
    name: str