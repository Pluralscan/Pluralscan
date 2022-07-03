import typer

app = typer.Typer()


@app.command()
def create(project: str):
    """create"""
    typer.echo(f"Creating analyzer: {project}")

@app.command()
def add_executable(project: str):
    """create"""
    typer.echo(f"Creating analyzer: {project}")

if __name__ == "__main__":
    app()
