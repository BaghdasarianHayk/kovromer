FROM python:3.12.7-slim

RUN pip install --default-timeout=100 asyncpg
RUN pip install --default-timeout=100 python-jose[cryptography]
RUN pip install --default-timeout=100 fastapi[standard]
RUN pip install --default-timeout=100 passlib[bcrypt]==1.7.4
RUN pip install --default-timeout=100 pydantic-settings
RUN pip install --default-timeout=100 SQLAlchemy[asyncio]==2.0.36

COPY . . 

CMD [ "python", "main.py" ]
