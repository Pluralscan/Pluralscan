# Pluralscan

Pluralscan is a quality and security analysis platform aimed to provides a single solution for :
- Static Application Security Testing (SAST)
- Software Composition Analysis (SCA)
- License Checking
- Code Quality Analisys
- Open-souce solution benchmarking

## Abstract

Pluralscan should be currently considered as a **POC/POW project** that try to demonstrate how to realize a complexe business oriented software in Python by following **clean architecture practices**.

## Goals

- Fetch source code packages from **various locations** *(Git, Github, Gitlab, Disk...)*.
- Perform code analysis on a package with **various analyzer's** *(Roslyn, Sonar, Security Code Scan...)*.
- Centralize and persist analysis reports into a **generic business model representation**.

## Roadmap

### Pre-Release

- Ensure validation logic exists for each layer of pluralscan-core.
- Ensure consistency ()
- At least 60% code coverage for pluralscan-core.
- Logging.
- Clean exception handling.
- Documentation for pluralscan-core.
- Documentation for API.

### Release V1

- Move from Svelte 3 to **Svelte Kit**
  - Justification: Even if svelte kit is still in beta, must have features likes routing are natively implemented. However, the opinated way to realize scallable and maintenable front-end application, is the foremost reason of this choice.
- Implements abstract filesystem for store resources (packages, source code, tools...)
- Build a rules registry:
  - Mapper:
    - Dependency Check
    - Roslyn
    - ...
- Ensure aggregates consistency.
- Ensure scalability.


## Main Convention

- Hint Typing

## Try with Docker

### Build fresh image

##### Dotnet
```bash
mkdir pluralscan
cd pluralscan
git clone https://github.com/pluralscan/pluralscan.git
docker build -t pluralscan/pluralscan .
```

### Run image

```bash
docker run -dp 5400:5400 --env DJANGO_DEBUG=ON pluralscan/pluralscan
```

Navigate to http://localhost:5400


## Stack Overview

### Core Business Packages

- **Python 3.10** as language and runtime environment
- [poetry]()
- [django]()
- [gunicorn]()
- [pytest]()
- [pytest-cov]()
- [mypy](https://github.com/python/mypy) for static type checking.
- [python-rq](https://python-rq.org/) for queuing jobs and process them in background with workers **(Redis is required)**.

#### Recommendation

- Use [pathlib]() for handling cross-platform file path.


### Commandline CLI Application

- **Python 3.10*** as language and runtime environment

### Backend Web Application (API + SPA Rendering)

- **Python 3.10*** as language and runtime environment
- [Django Rest Framework]() as web framework used for API and serving SPA
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers) for handling cors

### Front-end Web Application

- **NodeJS 16.13.0** as runtime environment
- **Typescript** as main language
- **Svelte 3** as front-end framework
- [Carbon Design System for Svelte]() as design framework 
- [jest]() to run unit and integration tests
- [ts-jest]() which allow to write tests in Typescript
- [svelte-jester](https://github.com/svelteness/svelte-jester)
- [tailwindcss](https://tailwindcss.com/)

### Data Management & Persistence

- Memory
- MongoDB 5+
- Redis

### Containerization

- Docker

### Cloud Infrastructure

- Azure App Service
- Azure Registry

### Static Code Analyzis Tools

- Security Code Scan
- Dependency Check
- Roslyn
- Roslynator
- SonarQube
- KICS

## Development

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with:

#### Extensions for Python

- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

#### Extensions for Svelte

- [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

### Core

**Location:** pluralscan-core

**Language:** Python 3.10

**Architecture:** 

Clean Architecture/Onion Architecture/Ports & Adapters (Hexagonal)... all these are pretty much names for the same thing, and they all boil down to the dependency inversion principle: **high-level modules** (the domain) **MUST NOT** depend on **low-level** ones (the infrastructure)

#### Domain

Contains all the entities related to the business.

#### Application

The Application package references the Domain package.

This project is using DTO to define commands, queries, and their respective use cases. The use cases are the processes that can be triggered in our Application Core by one or several User Interfaces in our application.

This package also defines abstract interactors that are used for things like **Data Access** or **Business Logic Processing** inside the use-cases. However, the implementation for the interfaces lives in the Infrastructure package.


#### Data

The data folder contains sub-packages related to data access implementation.

Pluralsec currently provides implementation for persist data insides **Memory** and **MongoDB**.

#### Infrastructure

This package contains the implementation for the interfaces defined in the Application package.

### Commandline

TODO.

### Web Application

#### **Svelte SPA (Single Page Application)**

##### Install

```bash
cd webapp/frontend
npm install
```

##### Run Svelte Rollup Dev Server (Hot Reloading)

```bash
cd webapp/frontend
npm run dev
```

##### Build and upgrade front-end libs (until npm)

###### Powershell
```powershell
cd webapp/frontend
npm run build
Copy-Item -Path "dist" -Destination "..\webapp\frontend\libs" -Recurse
```

##### Check

To verifiy if the project is error free, you can use the CLI tool svelte-check. It acts like an editor asking for errors against all of .svelte files.

```bash
npx svelte-check
```

##### Add another Svelte website from template
```bash
cd webapp
npx degit sveltejs/template new_svelte_front
cd new_svelte_front
npm install
```

#### **Django Backend API + SSR (Server Side Rendering)**

##### Run development server (Windows)

```powershell
cd scripts
./run_django_dev.ps1
```

##### Add a new application into Django project

```powershell
cd webapp/backend
poetry run django-admin startapp new_app_name
```

##### Debug

From VS Code Debug View, run the "Debug Django WebApp" profile for start a dev web service with debuging.

More info about django-admin runserver: https://docs.djangoproject.com/en/4.0/ref/django-admin/#runserver

## Tests

### Usecases

- [Shedule Package Scan](pluralscan-core/src/__tests__/integration_tests_application/usecases/scans/test_schedule_scan.py)
- [Scan Package](pluralscan-core/src/__tests__/integration_tests_application/usecases/scans/test_run_scan.py)

### Scan Package

## Coverage
https://coverage.readthedocs.io/

**Code coverage analysis with HTML report**

```powershell
py -m coverage html --skip-empty
cd htmlcov
```

## References

### Python

- [PEP 563 – Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)