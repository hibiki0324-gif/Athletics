from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.match import Match
from models.match_batting_stat import MatchBattingStat
from models.player import Player
from models.match_team import MatchTeam
from schemas.match_batting_stat import (
    MatchBattingStatResponse,
    MatchBattingStatsUpdate,
)


router = APIRouter(
    prefix="/matches",
    tags=["match-batting-stats"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "/{match_id}/batting-stats",
    response_model=list[MatchBattingStatResponse],
)
def get_batting_stats(
    match_id: int,
    db: Session = Depends(get_db),
):
    match = (
        db.query(Match)
        .filter(Match.id == match_id)
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=404,
            detail="試合が見つかりません",
        )

    stats = (
        db.query(
            MatchBattingStat,
            Player.name,
            Player.uniform_number,
        )
        .join(
            Player,
            MatchBattingStat.player_id == Player.id,
        )
        .join(
            MatchBattingStat.match_team,
        )
        .filter(
            MatchBattingStat.match_team.has(
                match_id=match_id
            )
        )
        .order_by(
            MatchBattingStat.match_team_id,
            MatchBattingStat.player_id,
        )
        .all()
    )

    return [
        MatchBattingStatResponse(
            id=stat.id,
            match_team_id=stat.match_team_id,
            player_id=stat.player_id,
            player_name=name,
            uniform_number=uniform_number,
            at_bats=stat.at_bats,
            hits=stat.hits,
            doubles=stat.doubles,
            triples=stat.triples,
            home_runs=stat.home_runs,
            runs_batted_in=stat.runs_batted_in,
            walks=stat.walks,
            hit_by_pitch=stat.hit_by_pitch,
            sacrifice_bunts=stat.sacrifice_bunts,
            sacrifice_flies=stat.sacrifice_flies,
            strikeouts=stat.strikeouts,
            stolen_bases=stat.stolen_bases,
        )
        for stat, name, uniform_number in stats
    ]


@router.put(
    "/{match_id}/batting-stats",
    response_model=list[MatchBattingStatResponse],
)
def update_batting_stats(
    match_id: int,
    data: MatchBattingStatsUpdate,
    db: Session = Depends(get_db),
):
    match = (
        db.query(Match)
        .filter(Match.id == match_id)
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=404,
            detail="試合が見つかりません",
        )

    match_team = (
        db.query(MatchTeam)
        .filter(
            MatchTeam.id == data.match_team_id,
            MatchTeam.match_id == match_id,
        )
        .first()
    )

    if not match_team:
        raise HTTPException(
            status_code=404,
            detail="指定された試合チームが見つかりません",
        )

    existing_stats = (
        db.query(MatchBattingStat)
        .filter(
            MatchBattingStat.match_team_id
            == data.match_team_id
        )
        .all()
    )

    existing_by_player = {
        stat.player_id: stat
        for stat in existing_stats
    }

    submitted_player_ids = set()

    for item in data.stats:
        player = (
            db.query(Player)
            .filter(Player.id == item.player_id)
            .first()
        )

        if not player:
            raise HTTPException(
                status_code=404,
                detail=f"選手ID {item.player_id} が見つかりません",
            )

        submitted_player_ids.add(item.player_id)

        stat = existing_by_player.get(item.player_id)

        if stat is None:
            stat = MatchBattingStat(
                match_team_id=data.match_team_id,
                player_id=item.player_id,
            )
            db.add(stat)

        stat.at_bats = item.at_bats
        stat.hits = item.hits
        stat.doubles = item.doubles
        stat.triples = item.triples
        stat.home_runs = item.home_runs
        stat.runs_batted_in = item.runs_batted_in
        stat.walks = item.walks
        stat.hit_by_pitch = item.hit_by_pitch
        stat.sacrifice_bunts = item.sacrifice_bunts
        stat.sacrifice_flies = item.sacrifice_flies
        stat.strikeouts = item.strikeouts
        stat.stolen_bases = item.stolen_bases

    for stat in existing_stats:
        if stat.player_id not in submitted_player_ids:
            db.delete(stat)

    db.commit()

    stats = (
        db.query(
            MatchBattingStat,
            Player.name,
            Player.uniform_number,
        )
        .join(
            Player,
            MatchBattingStat.player_id == Player.id,
        )
        .filter(
            MatchBattingStat.match_team_id
            == data.match_team_id
        )
        .order_by(MatchBattingStat.player_id)
        .all()
    )

    return [
        MatchBattingStatResponse(
            id=stat.id,
            match_team_id=stat.match_team_id,
            player_id=stat.player_id,
            player_name=name,
            uniform_number=uniform_number,
            at_bats=stat.at_bats,
            hits=stat.hits,
            doubles=stat.doubles,
            triples=stat.triples,
            home_runs=stat.home_runs,
            runs_batted_in=stat.runs_batted_in,
            walks=stat.walks,
            hit_by_pitch=stat.hit_by_pitch,
            sacrifice_bunts=stat.sacrifice_bunts,
            sacrifice_flies=stat.sacrifice_flies,
            strikeouts=stat.strikeouts,
            stolen_bases=stat.stolen_bases,
        )
        for stat, name, uniform_number in stats
    ]