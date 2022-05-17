# CleanSecPy

## Definitions

- **SAST**: Source code analysis tools, also known as Static Application Security Testing (SAST) Tools, can help analyze source code or compiled versions of code to help find security flaws. **SAST tools can be added into your IDE**. Such tools can help you detect issues during software development. SAST tool feedback can save time and effort, especially when compared to finding vulnerabilities later in the development cycle.

## Requirements

### Development
- pytest (unit and integration testing)
- pytest-cov (code coverage and reporting)
- pep8 (code formating)
- pylint (linter)

### Dependencies

See `requirements.txt`.

## Run

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
