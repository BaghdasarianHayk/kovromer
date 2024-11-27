from fastapi import FastAPI
from app.workers.router import router as worker_router

app = FastAPI()

app.include_router(worker_router)