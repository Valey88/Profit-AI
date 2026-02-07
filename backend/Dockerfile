FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install poetry or pip requirements
COPY pyproject.toml poetry.lock* /app/

# We'll just use pip for simplicity with the pyproject.toml via pip install . or similar
# actually, let's keep it simple and install the dependencies directly
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-ansi --no-root

COPY . /app

# Install project
RUN poetry install --no-interaction --no-ansi --no-root

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
