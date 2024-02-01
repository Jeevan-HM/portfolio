# Use Python 3.11 slim base image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose port 8080
EXPOSE 8080

# Start Gunicorn server to run the Flask application
CMD ["gunicorn", "-b", "0.0.0.0:8080", "-w", "4", "app:app"]
