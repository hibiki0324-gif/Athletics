import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


DB_HOST = os.getenv("DB_HOST", "db")
DB_DATABASE = os.getenv("DB_DATABASE", "athletics")
DB_USERNAME = os.getenv("DB_USERNAME", "athletics_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "secret")


DATABASE_URL = (
    f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}"
    f"@{DB_HOST}:3306/{DB_DATABASE}"
    f"?charset=utf8mb4"
)


class Base(DeclarativeBase):
    pass


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
