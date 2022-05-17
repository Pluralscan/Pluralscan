# SARIF

An optimized process for find code errors is crucial for any organization which rely on critical software system.

## What is SARIF ?

SARIF (Static Analysis Results Interchange Format) is a JSON-based static analysis results exchange format for the output of static analysis tools. It is meant to interact with other tools: IDEs, integrated code checking analysis tools (such as SonarQube), continuous integration systems...

Each product has its own standard to which it must conform, which lead to :
- unintelligible representation of the data (product quality impact)
- code duplication
- a hazy understanding of the domain 

By introducing SARIF, we get a unified format and convention that's must be followed in any development.

## How SARIF is generated ?

SARIF is a unified format. You can get a SARIF report using different static analyzers and tools.

## Why handle SARIF ?

## Integration

- VSCode: https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer