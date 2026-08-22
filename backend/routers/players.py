from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.player import Player
from schemas.player import PlayerCreate, PlayerUpdate, PlayerResponse
from models.position import Position
from models.player_position import PlayerPosition
from schemas.position import PlayerPositionsUpdate
from schemas.position import PlayerPositionsUpdate, PositionResponse


router = APIRouter(
    prefix="/players",
    tags=["players"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[PlayerResponse])
def get_players(db: Session = Depends(get_db)):
    return db.query(Player).all()

@router.get("/{player_id}", response_model=PlayerResponse)
def get_player(
    player_id: int,
    db: Session = Depends(get_db),
):
    player = (
        db.query(Player)
        .filter(Player.id == player_id)
        .first()
    )

    if not player:
        raise HTTPException(
            status_code=404,
            detail="選手が見つかりません",
        )

    return player

@router.post("", response_model=PlayerResponse, status_code=201)
def create_player(
    player_data: PlayerCreate,
    db: Session = Depends(get_db),
):
    existing_player = (
        db.query(Player)
        .filter(Player.uniform_number == player_data.uniform_number)
        .first()
    )

    if existing_player:
        raise HTTPException(
            status_code=400,
            detail="その背番号は既に使用されています",
        )

    player = Player(
        name=player_data.name,
        uniform_number=player_data.uniform_number,
        batting_hand=player_data.batting_hand,
        throwing_hand=player_data.throwing_hand,
        profile_image=player_data.profile_image,
    )

    db.add(player)
    db.commit()
    db.refresh(player)

    return player

@router.put("/{player_id}", response_model=PlayerResponse)
def update_player(
    player_id: int,
    player_data: PlayerUpdate,
    db: Session = Depends(get_db),
):
    player = (
        db.query(Player)
        .filter(Player.id == player_id)
        .first()
    )

    if not player:
        raise HTTPException(
            status_code=404,
            detail="選手が見つかりません",
        )

    existing_player = (
        db.query(Player)
        .filter(
            Player.uniform_number == player_data.uniform_number,
            Player.id != player_id,
        )
        .first()
    )

    if existing_player:
        raise HTTPException(
            status_code=400,
            detail="その背番号は既に使用されています",
        )

    player.name = player_data.name
    player.uniform_number = player_data.uniform_number
    player.batting_hand = player_data.batting_hand
    player.throwing_hand = player_data.throwing_hand
    player.profile_image = player_data.profile_image
    player.is_active = player_data.is_active

    db.commit()
    db.refresh(player)

    return player

@router.get(
    "/{player_id}/positions",
    response_model=list[PositionResponse],
)
def get_player_positions(
    player_id: int,
    db: Session = Depends(get_db),
):
    player = (
        db.query(Player)
        .filter(Player.id == player_id)
        .first()
    )

    if not player:
        raise HTTPException(
            status_code=404,
            detail="選手が見つかりません",
        )

    return (
        db.query(Position)
        .join(
            PlayerPosition,
            PlayerPosition.position_id == Position.id,
        )
        .filter(PlayerPosition.player_id == player_id)
        .order_by(Position.id)
        .all()
    )


@router.put(
    "/{player_id}/positions",
    response_model=list[PositionResponse],
)
def update_player_positions(
    player_id: int,
    position_data: PlayerPositionsUpdate,
    db: Session = Depends(get_db),
):
    player = (
        db.query(Player)
        .filter(Player.id == player_id)
        .first()
    )

    if not player:
        raise HTTPException(
            status_code=404,
            detail="選手が見つかりません",
        )

    position_ids = list(dict.fromkeys(position_data.position_ids))

    if position_ids:
        positions = (
            db.query(Position)
            .filter(Position.id.in_(position_ids))
            .all()
        )

        found_ids = {position.id for position in positions}

        if found_ids != set(position_ids):
            raise HTTPException(
                status_code=400,
                detail="存在しない守備位置が指定されています",
            )

    db.query(PlayerPosition).filter(
        PlayerPosition.player_id == player_id
    ).delete(synchronize_session=False)

    for position_id in position_ids:
        db.add(
            PlayerPosition(
                player_id=player_id,
                position_id=position_id,
            )
        )

    db.commit()

    return (
        db.query(Position)
        .join(
            PlayerPosition,
            PlayerPosition.position_id == Position.id,
        )
        .filter(PlayerPosition.player_id == player_id)
        .order_by(Position.id)
        .all()
    )