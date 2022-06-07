# Set the base image
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

# Install dotnet dependencies
RUN dotnet tool install -g roslynator.dotnet.cli

WORKDIR /app

# Copy application and resources
COPY requirements.txt .
COPY setup.py .
COPY /cleansecpy .
COPY /resources .

# Install python
RUN pip3 install -r requirements.txt --no-cache-dir

CMD ["python3", "./cleansecpy/presentation"]