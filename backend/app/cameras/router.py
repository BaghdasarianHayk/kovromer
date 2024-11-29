import base64
from typing import List
import cv2
import numpy as np
from sqlalchemy.future import select
from app.cameras.models import Camera
from app.cameras.schemas import CameraCreate, CameraBase, CameraCalibrate, ImageBase64
from app.database import AsyncSession
from fastapi import APIRouter, HTTPException
from starlette import status
from app.workers.router import current_worker, get_current_worker
from collections import defaultdict
from fastapi import WebSocket, WebSocketDisconnect

router = APIRouter(
    prefix="/cameras",
    tags=['cameras']
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CameraBase)
async def add_camera( worker: current_worker, create_storage_request: CameraCreate):
    if not worker.permissions.get("add_camera"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вам необходимо разрешение на выполнение этой операции.",
        )

    create_camera_model = Camera(
        title=create_storage_request.title,
        worker_id=worker.id
    )

    try:
        async with AsyncSession() as session:
            async with session.begin():
                session.add(create_camera_model)

        return create_camera_model

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла непредвиденная ошибка. Повторите попытку позже. {str(e)}"
        )

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[CameraBase])
async def get_cameras( worker: current_worker ):
    try:
        async with AsyncSession() as session:
            result = await session.execute(select(Camera))
            cameras = result.scalars().all()
            return cameras

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла непредвиденная ошибка. Повторите попытку позже. {str(e)}"
        )

@router.patch("/{camera_id}", status_code=status.HTTP_200_OK, response_model=CameraBase)
async def calibrate_camera( worker: current_worker, data: CameraCalibrate, camera_id: int ):
    if not worker.permissions.get("calibrate_camera"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вам необходимо разрешение на выполнение этой операции.",
        )
    try:
        async with AsyncSession() as session:
            result = await session.execute(select(Camera).where(Camera.id == camera_id))
            camera_db = result.scalars().first()

            if not camera_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Камера с ID {camera_db} не найдена."
                )

            camera_db.ratio = data.ratio

            await session.commit()

            return camera_db

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла непредвиденная ошибка. Повторите попытку позже. {str(e)}"
        )

@router.post("/detect_carpet", status_code=status.HTTP_200_OK)
async def detect_carpet_base64(payload: ImageBase64):
    try:
        # Decode Base64 string into bytes
        base64_image = payload.base64_image.split(",")[-1]
        decoded_data = base64.b64decode(base64_image)

        # Convert bytes to NumPy array for OpenCV
        np_data = np.frombuffer(decoded_data, np.uint8)
        image_bgr = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        if image_bgr is None:
            raise HTTPException(status_code=400, detail="Invalid image data.")

        # Detect carpet
        coordinates = detect_carpet_coordinates(image_bgr)
        return coordinates

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ConnectionManager:
    def __init__(self):
        self.active_connections: defaultdict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, camera_id: int):
        await websocket.accept()
        self.active_connections[camera_id].append(websocket)

    def disconnect(self, websocket: WebSocket, camera_id: int):
        if camera_id in self.active_connections:
            self.active_connections[camera_id].remove(websocket)
            if not self.active_connections[camera_id]:  # Remove empty list
                del self.active_connections[camera_id]

    async def broadcast(self, message: str, camera_id: int):
        if camera_id in self.active_connections:
            for connection in self.active_connections[camera_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/{camera_id}/ws")
async def websocket_endpoint(websocket: WebSocket, token: str, camera_id: int):
    try:
        worker = await get_current_worker(token)
        if not worker or not worker.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token.")

        worker_id = worker.id

        async with AsyncSession() as session:
            if camera_id == 0:
                result = await session.execute(
                    select(Camera).order_by(Camera.id.asc()).limit(1)
                )
            else:
                result = await session.execute(
                    select(Camera).where(Camera.id == camera_id)
                )
            camera = result.scalars().first()

            if not camera:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Camera with id: {camera_id} doesn't exist!")

        await manager.connect(websocket, camera_id)

        try:
            while True:
                data = await websocket.receive_text()

                if worker_id == camera.worker_id:
                    await manager.broadcast(data, camera_id)
                else:
                    print(f"Unauthorized send attempt by user ID: {worker_id}")
        except WebSocketDisconnect:
            manager.disconnect(websocket, camera_id)
        except Exception as e:
            print(f"Unexpected error: {e}")
            manager.disconnect(websocket, camera_id)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred.")
    except HTTPException as e:
        await websocket.close(code=e.status_code)
        raise e

def detect_carpet_coordinates(image_array: np.ndarray):
    """Detects carpet and returns normalized coordinates."""
    height, width = image_array.shape[:2]

    # Convert to HSV and remove green chroma
    hsv = cv2.cvtColor(image_array, cv2.COLOR_BGR2HSV)
    lower_green = np.array([35, 50, 50])
    upper_green = np.array([85, 255, 255])
    mask = cv2.inRange(hsv, lower_green, upper_green)
    mask_inv = cv2.bitwise_not(mask)
    result = cv2.bitwise_and(image_array, image_array, mask=mask_inv)
    gray = cv2.cvtColor(result, cv2.COLOR_BGR2GRAY)

    # Find contours and the largest one
    contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        raise HTTPException(status_code=400, detail="No carpet detected.")

    largest_contour = max(contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(largest_contour)
    box = cv2.boxPoints(rect)
    box = np.array(sorted(box, key=lambda p: (p[0], p[1])))

    return [
        {"x": round(float(box[0][0]) / width, 4), "y": round(float(box[0][1]) / height, 4)},  # Top-left
        {"x": round(float(box[2][0]) / width, 4), "y": round(float(box[2][1]) / height, 4)},  # Bottom-right
        {"x": round(float(box[3][0]) / width, 4), "y": round(float(box[3][1]) / height, 4)},  # Top-right
        {"x": round(float(box[1][0]) / width, 4), "y": round(float(box[1][1]) / height, 4)}  # Bottom-left

    ]