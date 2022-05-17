# CleanSecPy

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
