from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

# SQLAlchemyのモデルを登録
from models.player import Player
from models.position import Position
from models.player_position import PlayerPosition

from routers.players import router as players_router


app = FastAPI(title="Athletics API")


@app.get("/")
def read_root():
    return {"message": "Athletics API is running"}


@app.get("/health/db")
def check_database():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {"database": result.scalar() == 1}


app.include_router(players_router)