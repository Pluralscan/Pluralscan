# Pluralscan Development

## Environment

Windows 11 with :
- Visual Studio Code
- Python 3.10.0
- Docker
- MongoDB 5.0.5 Community
- MongoDB Compass
- Postman

### VSC IDE Configuration
https://code.visualstudio.com/download
#### **Extensions**

Recommanded extensions are defined inside `.vscode/extensions`.

#### **Virtual Environment**
https://code.visualstudio.com/docs/python/python-tutorial#_start-vs-code-in-a-project-workspace-folder

A best practice among Python developers is to avoid installing packages into a global interpreter environment. You instead use a project-specific virtual environment that contains a copy of a global interpreter. Once you activate that environment, any packages you then install are isolated from other environments.

##### **Setup virtual environment**
```powershell
py -3 -m venv .venv
.venv\scripts\activate
```
