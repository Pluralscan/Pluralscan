from json import dumps
import typer

from cleansecpy.application.usecases.package.new_package_use_case import (
    NewPackageCommand,
    NewPackageUseCase,
)
from cleansecpy.data import AbstractRepositoryFactory
from cleansecpy.infrastructure.processor.fetchers.http_package_fetcher import (
    HttpPackageFetcher,
)
from cleansecpy.infrastructure.source_fetcher.github import GithubSourceFetcher

app = typer.Typer()


@app.command()
def new(name: str, url: str, description: str = None):
    """new command."""
    typer.echo(f"Creating new package: {name} - {url} - {description}")
    command = NewPackageCommand(name, url, description=description)
    source_service = GithubSourceFetcher(HttpPackageFetcher())
    package_repo = AbstractRepositoryFactory.package_repository("memory")
    new_package_use_case = NewPackageUseCase(source_service, package_repo)
    typer.echo(dumps(new_package_use_case.handle(command)))


if __name__ == "__main__":
    app()
