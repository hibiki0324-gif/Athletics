from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.match import Match
from models.match_lineup_entry import MatchLineupEntry
from models.match_team import MatchTeam
from models.player import Player
from models.position import Position
from models.team import Team
from schemas.match_lineup import (
    LineupEntryResponse,
    MatchLineupResponse,
    MatchLineupUpdate,
)


router = APIRouter(
    prefix="/matches/{match_id}/lineup",
    tags=["match-lineup"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "",
    response_model=list[MatchLineupResponse],
)
def get_match_lineup(
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

    match_teams = (
        db.query(MatchTeam, Team)
        .join(
            Team,
            Team.id == MatchTeam.team_id,
        )
        .filter(MatchTeam.match_id == match_id)
        .order_by(MatchTeam.is_home.desc())
        .all()
    )

    result = []

    for match_team, team in match_teams:
        entries = (
            db.query(
                MatchLineupEntry,
                Player,
                Position,
            )
            .join(
                Player,
                Player.id == MatchLineupEntry.player_id,
            )
            .join(
                Position,
                Position.id == MatchLineupEntry.position_id,
            )
            .filter(
                MatchLineupEntry.match_team_id == match_team.id
            )
            .order_by(
                MatchLineupEntry.batting_order,
                MatchLineupEntry.entry_sequence,
            )
            .all()
        )

        result.append(
            MatchLineupResponse(
                match_team_id=match_team.id,
                team_id=team.id,
                team_name=team.name,
                is_home=match_team.is_home,
                entries=[
                    LineupEntryResponse(
                        id=entry.id,
                        player_id=entry.player_id,
                        player_name=player.name,
                        uniform_number=player.uniform_number,
                        position_id=entry.position_id,
                        position_name=position.name,
                        batting_order=entry.batting_order,
                        entry_sequence=entry.entry_sequence,
                        entry_inning=entry.entry_inning,
                        exit_inning=entry.exit_inning,
                        is_starter=entry.is_starter,
                    )
                    for entry, player, position in entries
                ],
            )
        )

    return result


@router.put(
    "",
    response_model=MatchLineupResponse,
)
def update_match_lineup(
    match_id: int,
    data: MatchLineupUpdate,
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
            status_code=400,
            detail="指定されたチームはこの試合に登録されていません",
        )

    if not data.entries:
        raise HTTPException(
            status_code=400,
            detail="出場選手を1人以上指定してください",
        )

    # 打順チェック
    batting_orders = [
        entry.batting_order
        for entry in data.entries
    ]

    if any(order < 1 for order in batting_orders):
        raise HTTPException(
            status_code=400,
            detail="打順は1以上で指定してください",
        )

    # 選手・守備位置の存在チェック
    player_ids = {
        entry.player_id
        for entry in data.entries
    }

    position_ids = {
        entry.position_id
        for entry in data.entries
    }

    players = (
        db.query(Player)
        .filter(Player.id.in_(player_ids))
        .all()
    )

    positions = (
        db.query(Position)
        .filter(Position.id.in_(position_ids))
        .all()
    )

    if len(players) != len(player_ids):
        raise HTTPException(
            status_code=400,
            detail="存在しない選手が指定されています",
        )

    if len(positions) != len(position_ids):
        raise HTTPException(
            status_code=400,
            detail="存在しない守備位置が指定されています",
        )

    # 既存データを置き換える
    db.query(MatchLineupEntry).filter(
        MatchLineupEntry.match_team_id == match_team.id
    ).delete(synchronize_session=False)

    for entry in data.entries:
        db.add(
            MatchLineupEntry(
                match_team_id=match_team.id,
                player_id=entry.player_id,
                position_id=entry.position_id,
                batting_order=entry.batting_order,
                entry_sequence=entry.entry_sequence,
                entry_inning=entry.entry_inning,
                exit_inning=entry.exit_inning,
                is_starter=entry.is_starter,
            )
        )

    db.commit()

    team = (
        db.query(Team)
        .filter(Team.id == match_team.team_id)
        .first()
    )

    entries = (
        db.query(
            MatchLineupEntry,
            Player,
            Position,
        )
        .join(
            Player,
            Player.id == MatchLineupEntry.player_id,
        )
        .join(
            Position,
            Position.id == MatchLineupEntry.position_id,
        )
        .filter(
            MatchLineupEntry.match_team_id == match_team.id
        )
        .order_by(
            MatchLineupEntry.batting_order,
            MatchLineupEntry.entry_sequence,
        )
        .all()
    )

    return MatchLineupResponse(
        match_team_id=match_team.id,
        team_id=team.id,
        team_name=team.name,
        is_home=match_team.is_home,
        entries=[
            LineupEntryResponse(
                id=entry.id,
                player_id=entry.player_id,
                player_name=player.name,
                uniform_number=player.uniform_number,
                position_id=entry.position_id,
                position_name=position.name,
                batting_order=entry.batting_order,
                entry_sequence=entry.entry_sequence,
                entry_inning=entry.entry_inning,
                exit_inning=entry.exit_inning,
                is_starter=entry.is_starter,
            )
            for entry, player, position in entries
        ],
    )