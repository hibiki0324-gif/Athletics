from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.match import Match
from models.match_battery import MatchBattery
from models.match_team import MatchTeam
from models.player import Player
from schemas.match_battery import (
    MatchBatteriesUpdate,
    MatchBatteryResponse,
)


router = APIRouter(
    prefix="/matches",
    tags=["match-batteries"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def to_response(
    battery: MatchBattery,
) -> MatchBatteryResponse:
    return MatchBatteryResponse(
        id=battery.id,
        match_team_id=battery.match_team_id,
        pitcher_id=battery.pitcher.id,
        pitcher_name=battery.pitcher.name,
        pitcher_uniform_number=battery.pitcher.uniform_number,
        catcher_id=battery.catcher.id,
        catcher_name=battery.catcher.name,
        catcher_uniform_number=battery.catcher.uniform_number,
        sequence_no=battery.sequence_no,
        entry_inning=battery.entry_inning,
        exit_inning=battery.exit_inning,
    )


@router.get(
    "/{match_id}/batteries",
    response_model=list[MatchBatteryResponse],
)
def get_batteries(
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

    batteries = (
        db.query(MatchBattery)
        .join(
            MatchTeam,
            MatchBattery.match_team_id == MatchTeam.id,
        )
        .filter(
            MatchTeam.match_id == match_id,
        )
        .order_by(
            MatchBattery.match_team_id,
            MatchBattery.sequence_no,
        )
        .all()
    )

    return [
        to_response(battery)
        for battery in batteries
    ]


@router.put(
    "/{match_id}/batteries",
    response_model=list[MatchBatteryResponse],
)
def update_batteries(
    match_id: int,
    data: MatchBatteriesUpdate,
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

    existing_batteries = (
        db.query(MatchBattery)
        .filter(
            MatchBattery.match_team_id
            == data.match_team_id
        )
        .all()
    )

    existing_by_sequence = {
        battery.sequence_no: battery
        for battery in existing_batteries
    }

    submitted_sequences = set()

    for item in data.batteries:
        pitcher = (
            db.query(Player)
            .filter(Player.id == item.pitcher_id)
            .first()
        )

        if not pitcher:
            raise HTTPException(
                status_code=404,
                detail=f"投手ID {item.pitcher_id} が見つかりません",
            )

        catcher = (
            db.query(Player)
            .filter(Player.id == item.catcher_id)
            .first()
        )

        if not catcher:
            raise HTTPException(
                status_code=404,
                detail=f"捕手ID {item.catcher_id} が見つかりません",
            )

        if item.pitcher_id == item.catcher_id:
            raise HTTPException(
                status_code=400,
                detail="投手と捕手に同じ選手を指定できません",
            )

        if item.sequence_no in submitted_sequences:
            raise HTTPException(
                status_code=400,
                detail="sequence_noは重複できません",
            )

        submitted_sequences.add(item.sequence_no)

        battery = existing_by_sequence.get(
            item.sequence_no
        )

        if battery is None:
            battery = MatchBattery(
                match_team_id=data.match_team_id,
                sequence_no=item.sequence_no,
            )
            db.add(battery)

        battery.pitcher_id = item.pitcher_id
        battery.catcher_id = item.catcher_id
        battery.entry_inning = item.entry_inning
        battery.exit_inning = item.exit_inning

    for battery in existing_batteries:
        if battery.sequence_no not in submitted_sequences:
            db.delete(battery)

    db.commit()

    batteries = (
        db.query(MatchBattery)
        .filter(
            MatchBattery.match_team_id
            == data.match_team_id
        )
        .order_by(MatchBattery.sequence_no)
        .all()
    )

    return [
        to_response(battery)
        for battery in batteries
    ]