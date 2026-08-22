from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.database import SessionLocal

from models.season import Season
from models.match import Match
from models.match_pitching_decision import MatchPitchingDecision
from models.player import Player

from schemas.season_pitching_decision import (
    SeasonPitchingDecisionResponse,
)


router = APIRouter(
    prefix="/seasons",
    tags=["season-pitching-decisions"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "/{season_id}/pitching-decisions",
    response_model=list[SeasonPitchingDecisionResponse],
)
def get_season_pitching_decisions(
    season_id: int,
    db: Session = Depends(get_db),
):
    # --------------------------------
    # シーズン存在確認
    # --------------------------------
    season = (
        db.query(Season)
        .filter(Season.id == season_id)
        .first()
    )

    if not season:
        raise HTTPException(
            status_code=404,
            detail="シーズンが見つかりません",
        )

    # --------------------------------
    # 投手勝敗・セーブを集計
    # --------------------------------
    rows = (
        db.query(
            Player.id.label("player_id"),
            Player.name.label("player_name"),
            Player.uniform_number.label("uniform_number"),

            func.sum(
                case(
                    (
                        MatchPitchingDecision.decision == "WIN",
                        1,
                    ),
                    else_=0,
                )
            ).label("wins"),

            func.sum(
                case(
                    (
                        MatchPitchingDecision.decision == "LOSS",
                        1,
                    ),
                    else_=0,
                )
            ).label("losses"),

            func.sum(
                case(
                    (
                        MatchPitchingDecision.decision == "SAVE",
                        1,
                    ),
                    else_=0,
                )
            ).label("saves"),
        )
        .join(
            Player,
            MatchPitchingDecision.player_id == Player.id,
        )
        .join(
            Match,
            MatchPitchingDecision.match_id == Match.id,
        )
        .filter(
            Match.season_id == season_id
        )
        .group_by(
            Player.id,
            Player.name,
            Player.uniform_number,
        )
        .order_by(
            Player.uniform_number
        )
        .all()
    )

    # --------------------------------
    # レスポンス生成
    # --------------------------------
    return [
        {
            "player_id": row.player_id,
            "player_name": row.player_name,
            "uniform_number": row.uniform_number,
            "wins": int(row.wins or 0),
            "losses": int(row.losses or 0),
            "saves": int(row.saves or 0),
        }
        for row in rows
    ]