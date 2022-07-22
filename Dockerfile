FROM amd64/ubuntu:jammy as base

# Setup environment variables
ENV PIP_NO_CACHE_DIR=off \
    POETRY_VIRTUALENVS_IN_PROJECT=false \
    VIRTUAL_ENV=/opt/venv \
    POETRY_VERSION=1.1.13 \
    DOTNET_VERSION=6.0

# Install Dotnet
RUN apt update
RUN apt install -y wget
RUN wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb 
RUN dpkg -i packages-microsoft-prod.deb
RUN apt update
RUN apt install apt-transport-https 
RUN apt install -y dotnet-sdk-${DOTNET_VERSION} dotnet-runtime-${DOTNET_VERSION}

# Install Golang
RUN apt install -y golang-go

# Install Java Dev Kit
RUN apt install -y openjdk-18-jdk

# Install python and pip
RUN apt install -y python3-pip python3-venv python-is-python3

# Install poetry
RUN pip install "poetry==$POETRY_VERSION"
RUN pip install --upgrade setuptools wheel

# Install git
RUN apt install -y git

FROM base AS builder
# Copy application and resources
WORKDIR /home
COPY . .

# Activate virtual environment
RUN python -m venv $VIRTUAL_ENV
RUN . $VIRTUAL_ENV/bin/activate

# Build & install Pluralscan core
WORKDIR /home/pluralscan-core
RUN poetry build -vvv
RUN $VIRTUAL_ENV/bin/pip install --no-cache-dir ./dist/*.whl

# Install FastApi
WORKDIR /home/pluralscan-fastapi
RUN poetry install --no-dev
RUN poetry add tzdata

FROM base AS production
COPY --from=builder /home/pluralscan-fastapi /app
COPY --from=builder $VIRTUAL_ENV $VIRTUAL_ENV
WORKDIR /app

#Expose the required port
EXPOSE 5400

# Run web application
CMD ["poetry", "run", "gunicorn", "--bind", ":5400", "--workers", "3", "backend.wsgi:application"]
