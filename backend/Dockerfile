# ---------------------------------------------------------------------------
# Stage 1 – dependency installation (cached layer)
# ---------------------------------------------------------------------------
FROM python:3.11-slim AS deps

WORKDIR /install

# System-level build dependencies for Pillow and cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libffi-dev \
        libjpeg-dev \
        zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install/pkg -r requirements.txt


# ---------------------------------------------------------------------------
# Stage 2 – runtime image (lean)
# ---------------------------------------------------------------------------
FROM python:3.11-slim AS runtime

WORKDIR /app

# Runtime system libraries for Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
        libjpeg62-turbo \
        zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from the build stage
COPY --from=deps /install/pkg /usr/local

# Copy application source
COPY . .

# Cloud Run injects PORT; default to 8080 if not set
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Non-root user for least-privilege execution
RUN addgroup --system trustmark && adduser --system --ingroup trustmark trustmark
USER trustmark

# Expose the port Cloud Run will route traffic to
EXPOSE 8080

# uvicorn with multiple workers; adjust --workers to match Cloud Run vCPUs
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2", "--log-level", "info"]
