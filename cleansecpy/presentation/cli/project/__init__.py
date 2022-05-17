import typer

from cleansecpy.application.usecases.project.new_project_use_case import NewProjectUseCase

app = typer.Typer()

@app.command()
def add(project: str):
    new_project_use_case = NewProjectUseCase()
    typer.echo(f"Creating project: {project}")

@app.command()
def list():
    typer.echo(f"Listing projects")

if __name__ == "__main__":
    app()