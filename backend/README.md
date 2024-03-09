# Backend

Built using [Django](https://djangoproject.com/) and [Django Rest Framework](https://www.django-rest-framework.org/)

- OpenAPI Spec provided by: [drf-spectacular](https://drf-spectacular.readthedocs.io/en/latest/)

## Versioning

- Developed and tested against Python 3.12.2
- All package requirements can be found in `requirements.txt`
  - Run `pip install -r requirements.txt` to get setup

## Developing

> [!NOTE]
> These commands should be run inside the `backend` directory

If model changes are made you need make and apply migrations to the database.

1. `python manage.py makemigrations` to create the migrations
   - If you have any issues with your models, it should let you know
2. `python manage.py migrate` to apply your migrations

To run the server use: `python manage.py

### Admin Dashboard

Default admin login:

- Username: `root`
- Password: `123`

If you want to make a new super user, run: `python manage.py createsuperuser`
