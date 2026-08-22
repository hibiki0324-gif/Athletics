from sqlalchemy import BigInteger, ForeignKey, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MatchBattery(Base):
    __tablename__ = "match_batteries"

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

    pitcher_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "players.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    catcher_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "players.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    sequence_no: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
    )

    entry_inning: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
    )

    exit_inning: Mapped[int | None] = mapped_column(
        SmallInteger,
        nullable=True,
    )

    match_team = relationship("MatchTeam")

    pitcher = relationship(
        "Player",
        foreign_keys=[pitcher_id],
    )

    catcher = relationship(
        "Player",
        foreign_keys=[catcher_id],
    )