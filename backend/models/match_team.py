from sqlalchemy import BigInteger, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MatchTeam(Base):
    __tablename__ = "match_teams"

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

    team_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "teams.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )

    is_home: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    final_score: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )