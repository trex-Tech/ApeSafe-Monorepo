# Generated by Django 5.1.1 on 2024-10-25 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tokens', '0003_chain_token_chains'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='ticker',
            field=models.CharField(help_text='Ticker symbol for the token', max_length=20, unique=True),
        ),
    ]
