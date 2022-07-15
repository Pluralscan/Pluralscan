from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import uvicorn

from configs.environment import get_environment_variables
from routers.v1.analyzer_router import ANALYZER_ROUTER
from routers.v1.package_router import PACKAGE_ROUTER
from routers.v1.project_router import PROJECT_ROUTER

env = get_environment_variables()

# Core Application Instance
app = FastAPI(
    title=env.APP_NAME,
    version=env.API_VERSION,
)


# CORS
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5400",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(PROJECT_ROUTER)
app.include_router(ANALYZER_ROUTER)
app.include_router(PACKAGE_ROUTER)

app.mount('', StaticFiles(directory="pluralscan-svelte/public/", html=True), name="static")


if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=5400, reload=True)
