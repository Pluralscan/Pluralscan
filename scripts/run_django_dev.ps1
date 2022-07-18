# Set current dir to django root dir
Set-Location ..\webapp

# Define env variables
$env:DJANGO_DEBUG = 'ON'

poetry run python manage.py makemigrations
poetry run python manage.py migrate
#poetry run python manage.py createsuperuser --email admin@example.com --username admin
poetry run python manage.py runserver