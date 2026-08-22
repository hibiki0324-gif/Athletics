from sqlalchemy import BigInteger, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Season(Base):
    __tablename__ = "seasons"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    year: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
        unique=True,
    )

    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )