# Tools

## Roslyn Analyzers

- https://github.com/dotnet/roslyn-analyzers

## Roslynator Cli

- A custom build with unpublished source is provided (fix issues with output)
- https://github.com/JosefPihrt/Roslynator/blob/master/docs/cli/analyze-command.md

## SonarQube

- Official Docker Image: https://hub.docker.com/_/sonarqube
```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```
Once your instance is up and running, Log in to http://localhost:9000 using System Administrator credentials:

- login: admin
- password: admin

## Sonar Scanner

- Sonar Scanner Dotnet: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-msbuild/
- https://github.com/SonarSource/sonar-scanner-cli

## Others

- AsyncFixer: https://github.com/semihokur/AsyncFixer
- Security Code Scan: https://security-code-scan.github.io/
- StyleCop Analyzers: https://github.com/DotNetAnalyzers/StyleCopAnalyzers
