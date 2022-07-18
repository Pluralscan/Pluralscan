# from json import dumps

# import typer
# from pluralscan.application.usecases.packages.create_package import (
#     NewPackageCommand, NewPackageUseCase)
# from pluralscan.data import AbstractRepositoryFactory
# from pluralscan.infrastructure.processor.fetchers.http_package_fetcher import \
#     HttpPackageFetcher

# app = typer.Typer()


# @app.command()
# def new(name: str, url: str, description: str = None):
#     """new command."""
#     typer.echo(f"Creating new package: {name} - {url} - {description}")
#     command = NewPackageCommand(name, url, description=description)
#     # source_service = GithubSourceFetcher(HttpPackageFetcher())
#     # package_repo = AbstractRepositoryFactory.package_repository("memory")
#     # new_package_use_case = NewPackageUseCase(source_service, package_repo)
#     # typer.echo(dumps(new_package_use_case.handle(command)))


# if __name__ == "__main__":
#     app()
