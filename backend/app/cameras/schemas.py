from pydantic import BaseModel, Field


class CameraBase(BaseModel):
    id: int
    title: str = Field(..., examples=["Test Camera"])
    ratio: float
    worker_id: int = Field(..., examples=[1, 2])

class CameraCreate(BaseModel):
    title: str = Field(..., examples=["Test Camera"])

class CameraCalibrate(BaseModel):
    ratio: float
