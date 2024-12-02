import datetime
from sqlalchemy import text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Camera(Base):
    __tablename__ = "camera"
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    ratio: Mapped[float] = mapped_column(nullable=False, server_default=text('1.0'), default=1.0)
    worker_id: Mapped[str] = mapped_column(ForeignKey("worker.id"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(server_default=text("TIMEZONE('utc', now())"))
    updated_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=text("TIMEZONE('utc', now())"), onupdate=datetime.datetime.now(datetime.UTC))