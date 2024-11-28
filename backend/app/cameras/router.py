from typing import List

from sqlalchemy.future import select
from app.cameras.models import Camera
from app.cameras.schemas import CameraCreate, CameraBase, CameraCalibrate
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

@router.patch("/{camera_id}", status_code=status.HTTP_200_OK)
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