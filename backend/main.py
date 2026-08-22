from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine

# SQLAlchemyのモデルを登録
from models.player import Player
from models.position import Position
from models.player_position import PlayerPosition
from models.match_battery import MatchBattery
from models.match_pitching_decision import MatchPitchingDecision

from routers.players import router as players_router
from routers.seasons import router as seasons_router
from routers.teams import router as teams_router
from routers.positions import router as positions_router
from routers.matches import router as matches_router
from routers.match_teams import router as match_teams_router
from routers.match_innings import router as match_innings_router
from routers.match_lineup import router as match_lineup_router
from routers.match_batting_stats import router as match_batting_stats_router
from routers.match_batteries import router as match_batteries_router
from routers.match_pitching_decisions import (
    router as match_pitching_decisions_router,
)
from routers.season_batting_stats import router as season_batting_stats_router
from routers.season_pitching_decisions import (
    router as season_pitching_decisions_router,
)


app = FastAPI(title="Athletics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Athletics API is running"}

@app.get("/health/db")
def check_database():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {"database": result.scalar() == 1}

app.include_router(players_router)
app.include_router(seasons_router)
app.include_router(teams_router)
app.include_router(positions_router)
app.include_router(matches_router)
app.include_router(match_teams_router)
app.include_router(match_innings_router)
app.include_router(match_lineup_router)
app.include_router(match_batting_stats_router)
app.include_router(match_batteries_router)
app.include_router(match_pitching_decisions_router)
app.include_router(season_batting_stats_router)
app.include_router(season_pitching_decisions_router)