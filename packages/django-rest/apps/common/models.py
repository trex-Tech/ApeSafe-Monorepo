from django.db import models
import uuid

class UuidModel(models.Model):
    id = models.UUIDField(
        editable=False,
        db_index=True,
        default=uuid.uuid4,
        primary_key=True,
        null=False,
        blank=False,
    )

    class Meta:
        abstract = True