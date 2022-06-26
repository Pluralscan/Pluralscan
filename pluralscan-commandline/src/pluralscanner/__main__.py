import typer

from .analyzer import analyzer
from .package import package
from .project import project

app = typer.Typer(invoke_without_command=True)
app.add_typer(project.app, name='project')
app.add_typer(analyzer.app, name='analyzer')
app.add_typer(package.app, name='package')


@app.callback(invoke_without_command=True)
def main(context: typer.Context):
    """main"""
    if context.invoked_subcommand is None:
        typer.echo("Initialize CleanSecPy Interactive Cli")
        command = typer.prompt("Command")
        typer.echo(command)


if __name__ == "__main__":
    app()
