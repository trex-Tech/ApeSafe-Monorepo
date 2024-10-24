# Apesafe Backend

```

## Project Setup

create virtual environment
python -m venv venv
activate virtual environment

```bash
source env/Scripts/activate # (Windows)
source env/bin/activate # (Linux)
```

create media directories

## Creating new Django Apps

1. Run this command.

```bash
mkdir apps/<app_name> && python manage.py startapp <app_name> apps/<app_name>
```

2. Edit the `app.py` file of the newly created app so the name of the application config class follows the format below.

```py
class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
```

3. Add the application to the installed applications list in the `config/settings/base.py`

## Creating new models

1. Subclass the UuidModel in `common/models.py` so that the id of every model can be UUID

```py
from apps.common.models import UuidModel
class NewModel(UuidModel):
    pass
```