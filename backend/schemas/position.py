from pydantic import BaseModel, ConfigDict


class PositionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class PlayerPositionsUpdate(BaseModel):
    position_ids: list[int]