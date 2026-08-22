from sqlalchemy import BigInteger, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MatchPitchingDecision(Base):
    __tablename__ = "match_pitching_decisions"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    match_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "matches.id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    player_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "players.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    decision: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    match = relationship(
        "Match"
    )

    player = relationship(
        "Player"
    )