from sqlalchemy import BigInteger, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MatchLineupEntry(Base):
    __tablename__ = "match_lineup_entries"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    match_team_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "match_teams.id",
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

    position_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "positions.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    batting_order: Mapped[int] = mapped_column(
        nullable=False,
    )

    entry_sequence: Mapped[int] = mapped_column(
        nullable=False,
    )

    entry_inning: Mapped[int] = mapped_column(
        nullable=False,
    )

    exit_inning: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    is_starter: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )