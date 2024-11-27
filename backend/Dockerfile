FROM python:3.12.7

RUN pip3 install --upgrade pip
RUN pip3 install "sqlalchemy[asyncio]"

COPY . . 

CMD [ "python", "main.py" ]
