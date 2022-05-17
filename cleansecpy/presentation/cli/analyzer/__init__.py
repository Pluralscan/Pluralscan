import typer

app = typer.Typer()

@app.command()
def create(project: str):
    typer.echo(f"Creating analyzer: {project}")

if __name__ == "__main__":
    app()