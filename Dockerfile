# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Load environment variables from the .env file
ENV OPENAI_API_KEY=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


# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "main.py"]
