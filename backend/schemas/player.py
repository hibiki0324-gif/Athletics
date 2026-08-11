from pydantic import BaseModel, ConfigDict


class PlayerCreate(BaseModel):
    name: str
    uniform_number: int
    batting_hand: str
    throwing_hand: str
    profile_image: str | None = None


class PlayerUpdate(BaseModel):
    name: str
    uniform_number: int
    batting_hand: str
    throwing_hand: str
    profile_image: str | None = None
    is_active: bool


class PlayerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    uniform_number: int
    batting_hand: str
    throwing_hand: str
    profile_image: str | None
    is_active: bool