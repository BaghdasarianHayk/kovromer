import datetime
from typing import List, Dict, Union
from sqlalchemy import text, JSON, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Worker(Base):
    __tablename__ = "worker"
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    full_name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(nullable=False)
    permissions: Mapped[Dict[str, Union[bool, List[str]]]] = mapped_column(JSON, default=Dict)
    is_active: Mapped[bool] = mapped_column(default=True, server_default=text("true"))
    created_at: Mapped[datetime.datetime] = mapped_column(server_default=text("TIMEZONE('utc', now())"))
    updated_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=text("TIMEZONE('utc', now())"), onupdate=datetime.datetime.now(datetime.UTC))