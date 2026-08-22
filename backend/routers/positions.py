from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.position import Position
from schemas.position import PositionResponse


router = APIRouter(
    prefix="/positions",
    tags=["positions"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[PositionResponse])
def get_positions(db: Session = Depends(get_db)):
    return (
        db.query(Position)
        .order_by(Position.id)
        .all()
    )