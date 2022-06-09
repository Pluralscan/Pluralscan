# CleanSecPy

Perform's code quality and security analysis with many tools.

## Abstract

CleanSecPy is a **POC/POW project** that try to demonstrate how to realize a complexe business oriented software in Python.

The repository is structured into many layers *(Multi Module N-Tier Architecture)* and follow principles inspired from:
- Clean Architecture
- Hexagonal Architecture
- Domain Driven Design (DDD)

## Goals

- Fetch source code packages from **various locations** *(Github, Gitlab, Disk...)*.
- Perform code analysis on a package with **various analyzer's** *(Roslyn, Sonar, Security Code Scan...)*.
- Centralize and persist analysis reports into a **generic business model representation**.

## Stack

### Python

- Python 3.10 (Runtime)
- Poetry (Package Management)
- Django 4.0.5 (Backend Web Framework)
- Django Rest Framework (API)
- pytest
- pytest-cov

### NodeJS

- Node 16.13.0 (Runtime)
- Svelte (Frontend Web Framework)

### Data Management

- MongoDB

### Containerization

- Docker

## Docker

### Build fresh image

```powershell
mkdir cleansecpy
cd cleansecpy
git clone
# Following command used the Dockerfile to build a new container image.
docker build -t cleansecpy .
```

### Run image

```powershell
docker run -dp 5400:5400 --env DJANGO_DEBUG=ON cleansecpy
```

Navigate to http://localhost:5400

## Development

### Core

Location: cleansecpy

#### Domain

Contains all the entities related to the business.

### Commandline

TODO.

### Web Application

#### Svelte SPA (Single Page Application)

##### Install

```
cd webapp/frontend
npm install
```

##### Run Svelte Rollup Dev Server (Hot Reloading)

```
cd webapp/frontend
npm run dev
```

#### Django Backend SSR (Server Side Rendering)

##### Run development server on Windows

```powershell
cd scripts
./run_django_dev.ps1
```

## Tests

**Unit tests**

**Integration tests**

## Coverage
https://coverage.readthedocs.io/

**Code coverage analysis with HTML report**

```powershell
py -m coverage html --skip-empty
cd htmlcov
```

## Console Cli

### Commands

#### **cleansecpy project**

| Title                      | Description                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| cleansecpy project command | The **cleansecpy project** command provides a convenient option to add, remove, and list projects.|

##### Synopsis

```shell
python -m cleansecpy package [<PROJECT_ID>] [command]

python -m cleansecpy package [command] -h|--help
```

#### **cleansecpy package**

| Title                      | Description                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| cleansecpy package command | The **cleansecpy package** command provides a convenient option to add, remove, and list packages in a project. |

##### Synopsis

```shell
python -m cleansecpy package [<PROJECT_ID>] [command]

python -m cleansecpy package [command] -h|--help
```
