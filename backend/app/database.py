from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings


engine = create_async_engine(
    url=settings.DATABASE_URL,
    echo=True
)

AsyncSession = async_sessionmaker(bind=engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass