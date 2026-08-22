from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.season import Season
from schemas.season import SeasonCreate, SeasonUpdate, SeasonResponse


router = APIRouter(
    prefix="/seasons",
    tags=["seasons"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[SeasonResponse])
def get_seasons(db: Session = Depends(get_db)):
    return db.query(Season).order_by(Season.year.desc()).all()


@router.get("/{season_id}", response_model=SeasonResponse)
def get_season(
    season_id: int,
    db: Session = Depends(get_db),
):
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

    return season


@router.post("", response_model=SeasonResponse, status_code=201)
def create_season(
    season_data: SeasonCreate,
    db: Session = Depends(get_db),
):
    existing_season = (
        db.query(Season)
        .filter(Season.year == season_data.year)
        .first()
    )

    if existing_season:
        raise HTTPException(
            status_code=400,
            detail="その年度のシーズンは既に存在します",
        )

    season = Season(
        year=season_data.year,
        name=season_data.name,
    )

    db.add(season)
    db.commit()
    db.refresh(season)

    return season


@router.put("/{season_id}", response_model=SeasonResponse)
def update_season(
    season_id: int,
    season_data: SeasonUpdate,
    db: Session = Depends(get_db),
):
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

    existing_season = (
        db.query(Season)
        .filter(
            Season.year == season_data.year,
            Season.id != season_id,
        )
        .first()
    )

    if existing_season:
        raise HTTPException(
            status_code=400,
            detail="その年度のシーズンは既に存在します",
        )

    season.year = season_data.year
    season.name = season_data.name

    db.commit()
    db.refresh(season)

    return season