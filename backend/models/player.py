from sqlalchemy import BigInteger, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    uniform_number: Mapped[int] = mapped_column(
        nullable=False,
        unique=True,
    )

    batting_hand: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    throwing_hand: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    profile_image: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    player_positions = relationship(
        "PlayerPosition",
        back_populates="player",
        cascade="all, delete-orphan",
    )