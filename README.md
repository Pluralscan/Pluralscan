# CleanSecPy

Perform's code quality and security analysis with many tools.

## Abstract

CleanSecPy is a **POC/POW project** that try to demonstrate how to realize a complexe business oriented software in Python.

The repository is structured into many layers *(Multi Module N-Tier Architecture)* and follow principles inspired from:
- Clean Architecture
- Hexagonal Architecture
- Domain Driven Design (DDD)

## Goals

- Fetch source code packages from **various locations** *(Git, Github, Gitlab, Disk...)*.
- Perform code analysis on a package with **various analyzer's** *(Roslyn, Sonar, Security Code Scan...)*.
- Centralize and persist analysis reports into a **generic business model representation**.

## Try with Docker

### Build fresh image

```bash
mkdir cleansecpy
cd cleansecpy
git clone https://github.com/gromatluidgi/cleansecpy.git
docker build -t luciustack/cleansecpy .
```

### Run image

```bash
docker run -dp 5400:5400 --env DJANGO_DEBUG=ON luciustack/cleansecpy
```

Navigate to http://localhost:5400

## Stack Overview

### Core Business Packages

- **Python 3.10*** (Runtime)
- **Poetry** (Package Management)
- **Django 4.0.5** (Backend Web Framework)
- **Gunicorn** (Web Server)
- **pytest**
- **pytest-cov**

### Commandline CLI Application

- **Python 3.10*** as language and runtime environment

### Backend Web Application (SSR + API)

- **Python 3.10*** as language and runtime environment
- Django Rest Framework (API)

### Front-end Web Application

- **NodeJS 16.13.0** as runtime environment
- **Typescript** as main language
- **Svelte 3** as front-end framework -
- **Carbon Design System for Svelte** - 
- **jest** to run tests
- **ts-jest** which allow to write tests in Typescript
- **svelte-jester** - https://github.com/svelteness/svelte-jester

### Data Management & Persistence

- Memory
- MongoDB

### Containerization

- Docker

### Cloud Infrastructure

- Azure App Service

### Static Code Analyzis Tools

- Security Code Scan
- Roslyn
- Roslynator
- SonarQube
- KICS

## Project Structures

### Inside the cleansecpy folder

## Development

### Core

Location: cleansecpy

#### Domain

Contains all the entities related to the business.

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

**Unit tests**

**Integration tests**

## Coverage
https://coverage.readthedocs.io/

**Code coverage analysis with HTML report**

```powershell
py -m coverage html --skip-empty
cd htmlcov
```
