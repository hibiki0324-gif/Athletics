from sqlalchemy import BigInteger, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MatchBattingStat(Base):
    __tablename__ = "match_batting_stats"

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

    at_bats: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    hits: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    doubles: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    triples: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    home_runs: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    runs_batted_in: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    walks: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    hit_by_pitch: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    sacrifice_bunts: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    sacrifice_flies: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    strikeouts: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    stolen_bases: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    match_team = relationship("MatchTeam")
    player = relationship("Player")