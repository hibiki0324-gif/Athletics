from datetime import date, time

from sqlalchemy import BigInteger, Date, ForeignKey, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    season_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "seasons.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    match_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    start_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    venue: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )