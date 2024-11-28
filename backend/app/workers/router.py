from sqlalchemy.future import select

from app.config import settings
from app.database import AsyncSession
from app.workers.models import Worker
import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError

from app.workers.schemas import WorkerCreate, Token, WorkerUpdate, WorkerBase

router = APIRouter(
    prefix="/workers",
    tags=['workers']
)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='workers/token')

async def get_current_worker(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        worker_id: int = payload.get('id')

        if not email or not worker_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Не удалось подтвердить личность сотрудника.",
                headers={"WWW-Authenticate": "Bearer"}
            )

        async with AsyncSession() as session:
            result = await session.execute(
                select(Worker).where(Worker.id == worker_id, Worker.email == email)
            )
            worker = result.scalars().first()

            if not worker:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Пользователь не найден или неактивен.",
                    headers={"WWW-Authenticate": "Bearer"}
                )

            if not worker.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Пользователь заблокирован.",
                )

            return worker

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Недействительный токен. {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла непредвиденная ошибка. Повторите попытку позже. {str(e)}"
        )

current_worker = Annotated[Worker, Depends(get_current_worker)]


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=WorkerBase)
async def add_worker( create_worker_request: WorkerCreate):
    # if not worker.permissions.get("add_worker"):
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Вам необходимо разрешение на выполнение этой операции.",
    #     )

    hashed_password = bcrypt_context.hash(create_worker_request.password)
    create_worker_model = Worker(
        email=create_worker_request.email,
        full_name=create_worker_request.full_name,
        role=create_worker_request.role,
        permissions=create_worker_request.permissions,
        hashed_password=hashed_password,
    )

    try:
        async with AsyncSession() as session:
            async with session.begin():
                session.add(create_worker_model)

        return create_worker_model


    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла ошибка: {str(e)}"
        )

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[WorkerBase])
async def get_workers( worker: current_worker ):

    if not worker.permissions.get("get_workers"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет разрешения на выполнение этой операции.",
        )

    try:
        async with AsyncSession() as session:
            result = await session.execute(select(Worker))
            workers = result.scalars().all()
            await session.commit()
            return workers

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла ошибка: {str(e)}"
        )

@router.get("/me", status_code=status.HTTP_200_OK, response_model=WorkerBase)
async def get_current_worker_info(worker: current_worker):
    try:
        async with AsyncSession() as session:
            result = await session.execute(
                select(Worker).where(Worker.id == worker.id)
            )
            await session.commit()
            worker_db = result.scalars().first()

        if not worker_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Worker with id: {worker.id} not found."
            )

        if not worker_db.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Пользователь заблокирован."
            )

        return worker_db


    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла ошибка: {str(e)}"
        )

@router.get("/{worker_id}", status_code=status.HTTP_200_OK, response_model=WorkerBase)
async def get_worker( worker_id: int, worker: current_worker ):
    if not worker.permissions.get("get_workers"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет разрешения на выполнение этой операции.",
        )

    try:
        async with AsyncSession() as session:
            result = await session.execute(select(Worker).where(Worker.id == worker_id))
            worker_info = result.scalars().first()
            await session.commit()

            if not worker_info:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Работник с ID {worker_id} не найден.",
                )

            return worker_info


    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла ошибка: {str(e)}"
        )

@router.patch("/{worker_id}", status_code=status.HTTP_200_OK, response_model=WorkerBase)
async def update_worker(worker_id: int, worker: current_worker, data: WorkerUpdate):

    if not worker.permissions.get("update_worker"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет разрешения на выполнение этой операции.",
        )

    try:
        async with AsyncSession() as session:
            result = await session.execute(select(Worker).where(Worker.id == worker_id))
            worker_info = result.scalars().first()

            if not worker_info:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Работник с ID {worker_id} не найден."
                )

            if not bcrypt_context.verify(data.old_password, worker_info.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Неверный старый пароль."
                )

            worker_info.full_name = data.full_name
            worker_info.role = data.role
            worker_info.password = bcrypt_context.hash(data.new_password)
            worker_info.is_active = data.is_active
            worker_info.permissions = data.permissions

            await session.commit()

            return {"detail": "Данные работника успешно обновлены."}


    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла ошибка: {str(e)}"
        )

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        async with AsyncSession() as session:
            async with session.begin():
                result = await session.execute(
                    select(Worker).where(Worker.email == form_data.username)
                )
                worker = result.scalars().first()

            if not worker:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь с таким email не существует."
                )

            if not bcrypt_context.verify(form_data.password, worker.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Неверный пароль."
                )

            if not worker.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь заблокирован."
                )

            token = jwt.encode(
                {
                    'sub': worker.email,
                    'id': worker.id,
                    'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=12)
                },
                SECRET_KEY,
                algorithm=ALGORITHM
            )

            return {'access_token': token, 'token_type': 'bearer'}


    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Произошла ошибка: {str(e)}"
        )