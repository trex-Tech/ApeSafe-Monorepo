# Generated by Django 5.1.1 on 2024-10-24 18:14

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tokens', '0002_rename_facebook_url_token_telegram_url_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(help_text='Name of the chain', max_length=255)),
                ('contract_address', models.CharField(help_text='Contract address of the chain', max_length=255)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='token',
            name='chains',
            field=models.ManyToManyField(to='tokens.chain'),
        ),
    ]
