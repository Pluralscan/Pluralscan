# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base

# Install dotnet dependencies
RUN dotnet tool install -g roslynator.dotnet.cli

# Setup environment variables
ENV PIP_NO_CACHE_DIR=off \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    VENV_PATH=/opt/venv \
    POETRY_VERSION=1.1.13

# Install python and pip
RUN apt-get update -y && apt-get upgrade -y &&  apt-get install python3 python3-pip python-is-python3 python3-venv -y

# Install poetry
RUN pip install "poetry==$POETRY_VERSION"

FROM base AS builder

# Define working directory
WORKDIR /home

# Copy application and resources
COPY . .

# Install python dependencies
RUN python -m venv $VENV_PATH
RUN . $VENV_PATH/bin/activate

# Build & install Pluralscan core
WORKDIR /home/pluralscan-core
RUN poetry build -vvv
RUN $VENV_PATH/bin/pip install ./dist/*.whl

# Build Pluralsan TS Api Client
#WORKDIR /home/pluralscan-api-client
#RUN npm run build

# Install Django API
WORKDIR /home/pluralscan-webapp
RUN poetry install

#RUN poetry run python manage.py makemigrations
#RUN poetry run python manage.py migrate
#RUN poetry run python manage.py createsuperuser --email admin@example.com --username admin

FROM base AS production
COPY --from=builder /home/pluralscan-webapp /app
COPY --from=builder $VENV_PATH /app/.venv
WORKDIR /app

#Expose the required port
EXPOSE 5400

# Run web application
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:5400"]