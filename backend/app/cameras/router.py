from sqlalchemy.future import select
from app.cameras.models import Camera
from app.cameras.schemas import CameraCreate, CameraBase, CameraCalibrate
from app.database import AsyncSession
from fastapi import APIRouter, HTTPException
from starlette import status
from app.workers.router import current_worker

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

@router.get("/", status_code=status.HTTP_200_OK)
async def get_cameras( worker: current_worker ):
    try:
        async with AsyncSession() as session:
            result = await session.execute(select(Camera))
            storages = result.scalars().all()
            return storages

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