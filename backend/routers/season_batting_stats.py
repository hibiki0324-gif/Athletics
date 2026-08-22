from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal

from models.season import Season
from models.match import Match
from models.match_team import MatchTeam
from models.match_batting_stat import MatchBattingStat
from models.player import Player

from schemas.season_batting_stat import SeasonBattingStatResponse


router = APIRouter(
    prefix="/seasons",
    tags=["season-batting-stats"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "/{season_id}/batting-stats",
    response_model=list[SeasonBattingStatResponse],
)
def get_season_batting_stats(
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
    # シーズン内の打撃成績を集計
    # --------------------------------
    rows = (
        db.query(
            Player.id.label("player_id"),
            Player.name.label("player_name"),
            Player.uniform_number.label("uniform_number"),

            func.count(
                func.distinct(MatchTeam.match_id)
            ).label("games"),

            func.coalesce(
                func.sum(MatchBattingStat.at_bats),
                0,
            ).label("at_bats"),

            func.coalesce(
                func.sum(MatchBattingStat.hits),
                0,
            ).label("hits"),

            func.coalesce(
                func.sum(MatchBattingStat.doubles),
                0,
            ).label("doubles"),

            func.coalesce(
                func.sum(MatchBattingStat.triples),
                0,
            ).label("triples"),

            func.coalesce(
                func.sum(MatchBattingStat.home_runs),
                0,
            ).label("home_runs"),

            func.coalesce(
                func.sum(MatchBattingStat.runs_batted_in),
                0,
            ).label("runs_batted_in"),

            func.coalesce(
                func.sum(MatchBattingStat.walks),
                0,
            ).label("walks"),

            func.coalesce(
                func.sum(MatchBattingStat.hit_by_pitch),
                0,
            ).label("hit_by_pitch"),

            func.coalesce(
                func.sum(MatchBattingStat.sacrifice_bunts),
                0,
            ).label("sacrifice_bunts"),

            func.coalesce(
                func.sum(MatchBattingStat.sacrifice_flies),
                0,
            ).label("sacrifice_flies"),

            func.coalesce(
                func.sum(MatchBattingStat.strikeouts),
                0,
            ).label("strikeouts"),

            func.coalesce(
                func.sum(MatchBattingStat.stolen_bases),
                0,
            ).label("stolen_bases"),
        )
        .join(
            MatchTeam,
            MatchBattingStat.match_team_id == MatchTeam.id,
        )
        .join(
            Match,
            MatchTeam.match_id == Match.id,
        )
        .join(
            Player,
            MatchBattingStat.player_id == Player.id,
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
    # 成績計算
    # --------------------------------
    result = []

    for row in rows:
        at_bats = row.at_bats
        hits = row.hits
        doubles = row.doubles
        triples = row.triples
        home_runs = row.home_runs
        walks = row.walks
        hit_by_pitch = row.hit_by_pitch
        sacrifice_flies = row.sacrifice_flies

        # 打率
        batting_average = (
            hits / at_bats
            if at_bats > 0
            else 0.0
        )

        # 出塁率
        plate_appearances_for_obp = (
            at_bats
            + walks
            + hit_by_pitch
            + sacrifice_flies
        )

        on_base_percentage = (
            (hits + walks + hit_by_pitch)
            / plate_appearances_for_obp
            if plate_appearances_for_obp > 0
            else 0.0
        )

        # 長打率
        singles = hits - doubles - triples - home_runs

        total_bases = (
            singles
            + (doubles * 2)
            + (triples * 3)
            + (home_runs * 4)
        )

        slugging_percentage = (
            total_bases / at_bats
            if at_bats > 0
            else 0.0
        )

        # OPS
        ops = (
            on_base_percentage
            + slugging_percentage
        )

        result.append(
            {
                "player_id": row.player_id,
                "player_name": row.player_name,
                "uniform_number": row.uniform_number,

                "games": row.games,

                "at_bats": at_bats,
                "hits": hits,
                "doubles": doubles,
                "triples": triples,
                "home_runs": home_runs,
                "runs_batted_in": row.runs_batted_in,

                "walks": walks,
                "hit_by_pitch": hit_by_pitch,
                "sacrifice_bunts": row.sacrifice_bunts,
                "sacrifice_flies": sacrifice_flies,

                "strikeouts": row.strikeouts,
                "stolen_bases": row.stolen_bases,

                "batting_average": round(
                    batting_average,
                    3,
                ),
                "on_base_percentage": round(
                    on_base_percentage,
                    3,
                ),
                "slugging_percentage": round(
                    slugging_percentage,
                    3,
                ),
                "ops": round(
                    ops,
                    3,
                ),
            }
        )

    return result