from django.db import models
from apps.common.models import UuidModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Token(UuidModel):
    name = models.CharField(max_length=255, help_text="Name of the token")
    ticker = models.CharField(max_length=10, unique=True, help_text="Ticker symbol for the token")
    description = models.TextField(help_text="Description of the token")
    image = models.ImageField(upload_to='tokens/') 

    website_url = models.URLField(max_length=200, blank=True, null=True)
    telegram_url = models.URLField(max_length=200, blank=True, null=True)
    twitter_url = models.URLField(max_length=200, blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens')
    date_created = models.DateTimeField(auto_now_add=True)
    chains = models.ManyToManyField()

    def __str__(self):
        return self.name
