from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PlayerPosition(Base):
    __tablename__ = "player_positions"

    player_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("players.id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )

    position_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("positions.id", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True,
    )

    player = relationship(
        "Player",
        back_populates="player_positions",
    )

    position = relationship(
        "Position",
        back_populates="player_positions",
    )