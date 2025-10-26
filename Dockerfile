# Use Python 3.11 slim base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy pyproject.toml and install dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy the rest of the application files
COPY . .

# Expose port 8080
EXPOSE 8080

# Start Gunicorn server to run the Flask application
CMD ["gunicorn", "-b", "0.0.0.0:8080", "-w", "4", "app:app"]
