# Dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt /app   

RUN pip install -r requirements.txt

COPY . /app   

EXPOSE 8080

CMD gunicorn -b 0.0.0.0:8080 -w 4 app:app
