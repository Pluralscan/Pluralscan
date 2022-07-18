import typer
from pluralscan.application.usecases.projects.create_project import \
    CreateProjectUseCase

app = typer.Typer()


@app.command()
def add(project: str):
    """add"""
    new_project_use_case = CreateProjectUseCase()
    typer.echo(f"Creating project: {project}")


@app.command()
def list_projects():
    """list"""
    typer.echo("Listing projects")


if __name__ == "__main__":
    app()
