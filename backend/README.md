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

## Endpoint Documentation

Base url is `localhost:8000/`

### GET `/api/query`

- takes everything the government api does and passes it through
- returns the exact json respone from them
- expects the arguments as url params e.g. `?limit=100&offset=0`

### GET /api/user/queries

- returns a list of queries that the logged in user has
- example response:

```json
[
    {
        "id": 67,
        "created_at": "2024-04-07T04:13:39.668057Z",
        "updated_at": "2024-04-07T04:13:39.668114Z",
        "name": "My Query",
        "resource_id": "fac950c0-00d5-4ec1-a4d3-9cbebf98a305",
        "filters": null,
        "search": null,
        "distinct": false,
        "plain": true,
        "language": "english",
        "limit": 10,
        "offset": 0,
        "fields": null,
        "sort": null,
        "include_total": true,
        "records_format": "objects",
        "user": 1
    },
    {
        "id": 68,
        "created_at": "2024-04-07T04:15:28.227404Z",
        "updated_at": "2024-04-07T04:15:28.227462Z",
        "name": "My Query",
        "resource_id": "fac950c0-00d5-4ec1-a4d3-9cbebf98a305",
        "filters": null,
        "search": null,
        "distinct": false,
        "plain": true,
        "language": "english",
        "limit": 10,
        "offset": 0,
        "fields": null,
        "sort": null,
        "include_total": true,
        "records_format": "objects",
        "user": 1
    }
]
```

### POST `/api/register`

- takes the following json:

```json
{
  "username": USERNAME,
  "password": PASSWORD
}
```

- if successful returns, following json, and sets an HttpOnly cookie automatically containing the authentication token

```json
{
  "message": "success"
}
```

- will error out if the username exists already or invalid data

### POST `/api/login`

- same as register, but will also error out for invalid credentials:

```json
{
  "message": "invalid credentials"
}
```

### POST `/api/logout`

- clears the httpcookie and auth token
