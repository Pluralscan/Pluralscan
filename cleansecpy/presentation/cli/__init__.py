import typer

from cleansecpy.presentation.cli import analyzer, package, project


app = typer.Typer(invoke_without_command=True)
app.add_typer(project.app, name='project')
app.add_typer(analyzer.app, name='analyzer')
app.add_typer(package.app, name='package')


@app.callback(invoke_without_command=True)
def main(context: typer.Context):
    if context.invoked_subcommand is None:
        typer.echo("Initialize CleanSecPy Interactive Cli")
        command = typer.prompt("Command")
