# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base

# Install dotnet dependencies
RUN dotnet tool install -g roslynator.dotnet.cli

# Setup environment variables
ENV PIP_NO_CACHE_DIR=off \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    VENV_PATH=/opt/venv

# Install python and pip
RUN apt-get update -y && apt-get upgrade -y &&  apt-get install python3 python3-pip python-is-python3 python3-venv -y

FROM base AS builder

# Define working directory
WORKDIR /home

# Copy application and resources
COPY . .

# Install python dependencies
#RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3 -
RUN pip install -r requirements.txt
RUN python -m venv $VENV_PATH
RUN . $VENV_PATH/bin/activate

# Build cleansecpy core
RUN poetry build -vvv

# Install cleansecpy core
RUN $VENV_PATH/bin/pip install ./dist/*.whl

# Build webapp
WORKDIR /home/webapp

RUN poetry install
RUN poetry run python manage.py makemigrations
RUN poetry run python manage.py migrate
RUN poetry run python manage.py createsuperuser --email admin@example.com --username admin

FROM base AS production
COPY --from=builder /home/webapp /app
COPY --from=builder $VENV_PATH /app/.venv
WORKDIR /app

#Expose the required port
EXPOSE 5400
# Run web application
RUN pip install poetry
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:5400"]