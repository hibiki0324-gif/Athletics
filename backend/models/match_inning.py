from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MatchInning(Base):
    __tablename__ = "match_innings"

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

    inning_number: Mapped[int] = mapped_column(
        nullable=False,
    )

    runs: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )