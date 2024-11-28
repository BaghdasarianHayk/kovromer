from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.workers.router import router as worker_router
from app.cameras.router import router as camera_router
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(worker_router)
app.include_router(camera_router)