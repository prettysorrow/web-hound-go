FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV REPO_ROOT=/app
ENV FETCHING_SERVER_HOST=0.0.0.0
ENV FETCHING_SERVER_PORT=8090

EXPOSE 8090

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8090"]