Remove-Item dist -Recurse
poetry build
pip install .\dist\pluralscan-0.1.0.tar.gz