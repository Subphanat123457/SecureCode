# Generated by Django 5.0.6 on 2024-06-07 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_customuser_lockout_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='last_login_ip',
            field=models.GenericIPAddressField(blank=True, null=True),
        ),
    ]
