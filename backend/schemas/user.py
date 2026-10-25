from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    login_id: str
    password: str
    player_id: int | None = None
    is_admin: bool = False


class UserUpdate(BaseModel):
    login_id: str
    player_id: int | None = None
    is_admin: bool
    is_active: bool


# password_hash はレスポンスに含めない
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    login_id: str
    player_id: int | None
    is_admin: bool
    is_active: bool
    last_login_at: datetime | None
