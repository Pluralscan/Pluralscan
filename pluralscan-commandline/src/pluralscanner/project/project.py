import typer
from pluralscan.application.usecases.project.new_project_use_case import \
    NewProjectUseCase

app = typer.Typer()


@app.command()
def add(project: str):
    """add"""
    new_project_use_case = NewProjectUseCase()
    typer.echo(f"Creating project: {project}")


@app.command()
def list_projects():
    """list"""
    typer.echo("Listing projects")


if __name__ == "__main__":
    app()
