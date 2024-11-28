from fastapi import FastAPI
from app.workers.router import router as worker_router
from app.cameras.router import router as camera_router
app = FastAPI()

app.include_router(worker_router)
app.include_router(camera_router)