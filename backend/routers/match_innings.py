from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.match import Match
from models.match_inning import MatchInning
from models.match_team import MatchTeam
from models.team import Team
from schemas.match_inning import (
    InningResponse,
    MatchInningsUpdate,
    MatchTeamInningsResponse,
)


router = APIRouter(
    prefix="/matches/{match_id}/innings",
    tags=["match-innings"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "",
    response_model=list[MatchTeamInningsResponse],
)
def get_match_innings(
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
        innings = (
            db.query(MatchInning)
            .filter(
                MatchInning.match_team_id == match_team.id
            )
            .order_by(MatchInning.inning_number)
            .all()
        )

        result.append(
            MatchTeamInningsResponse(
                match_team_id=match_team.id,
                team_id=team.id,
                team_name=team.name,
                is_home=match_team.is_home,
                innings=[
                    InningResponse(
                        inning_number=inning.inning_number,
                        runs=inning.runs,
                    )
                    for inning in innings
                ],
            )
        )

    return result


@router.put(
    "",
    response_model=list[MatchTeamInningsResponse],
)
def update_match_innings(
    match_id: int,
    data: MatchInningsUpdate,
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
        db.query(MatchTeam)
        .filter(MatchTeam.match_id == match_id)
        .all()
    )

    if len(match_teams) != 2:
        raise HTTPException(
            status_code=400,
            detail="先に試合の2チームを設定してください",
        )

    match_team_ids = {
        match_team.id
        for match_team in match_teams
    }

    input_team_ids = {
        team.match_team_id
        for team in data.teams
    }

    if input_team_ids != match_team_ids:
        raise HTTPException(
            status_code=400,
            detail="試合に登録されている2チームのイニングを指定してください",
        )

    for team_data in data.teams:
        if len(team_data.innings) == 0:
            continue

        inning_numbers = [
            inning.inning_number
            for inning in team_data.innings
        ]

        if len(set(inning_numbers)) != len(inning_numbers):
            raise HTTPException(
                status_code=400,
                detail="同じイニングを重複して指定することはできません",
            )

        for inning in team_data.innings:
            if inning.inning_number <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="イニング番号は1以上で指定してください",
                )

            if inning.runs < 0:
                raise HTTPException(
                    status_code=400,
                    detail="得点は0以上で指定してください",
                )

    db.query(MatchInning).filter(
        MatchInning.match_team_id.in_(match_team_ids)
    ).delete(synchronize_session=False)

    for team_data in data.teams:
        for inning in team_data.innings:
            db.add(
                MatchInning(
                    match_team_id=team_data.match_team_id,
                    inning_number=inning.inning_number,
                    runs=inning.runs,
                )
            )

    db.commit()

    match_team_data = (
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

    for match_team, team in match_team_data:
        innings = (
            db.query(MatchInning)
            .filter(
                MatchInning.match_team_id == match_team.id
            )
            .order_by(MatchInning.inning_number)
            .all()
        )

        result.append(
            MatchTeamInningsResponse(
                match_team_id=match_team.id,
                team_id=team.id,
                team_name=team.name,
                is_home=match_team.is_home,
                innings=[
                    InningResponse(
                        inning_number=inning.inning_number,
                        runs=inning.runs,
                    )
                    for inning in innings
                ],
            )
        )

    return result