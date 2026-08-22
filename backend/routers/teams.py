from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.team import Team
from schemas.team import TeamCreate, TeamUpdate, TeamResponse


router = APIRouter(
    prefix="/teams",
    tags=["teams"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[TeamResponse])
def get_teams(db: Session = Depends(get_db)):
    return (
        db.query(Team)
        .order_by(Team.name)
        .all()
    )


@router.get("/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: int,
    db: Session = Depends(get_db),
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        raise HTTPException(
            status_code=404,
            detail="チームが見つかりません",
        )

    return team


@router.post("", response_model=TeamResponse, status_code=201)
def create_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db),
):
    existing_team = (
        db.query(Team)
        .filter(Team.name == team_data.name)
        .first()
    )

    if existing_team:
        raise HTTPException(
            status_code=400,
            detail="そのチーム名は既に登録されています",
        )

    team = Team(
        name=team_data.name,
    )

    db.add(team)
    db.commit()
    db.refresh(team)

    return team


@router.put("/{team_id}", response_model=TeamResponse)
def update_team(
    team_id: int,
    team_data: TeamUpdate,
    db: Session = Depends(get_db),
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        raise HTTPException(
            status_code=404,
            detail="チームが見つかりません",
        )

    existing_team = (
        db.query(Team)
        .filter(
            Team.name == team_data.name,
            Team.id != team_id,
        )
        .first()
    )

    if existing_team:
        raise HTTPException(
            status_code=400,
            detail="そのチーム名は既に登録されています",
        )

    team.name = team_data.name
    team.is_active = team_data.is_active

    db.commit()
    db.refresh(team)

    return team