# Generated by Django 4.1.7 on 2023-04-03 21:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recipe', '0002_rename_media_step_img_remove_ingredient_unit_and_more'),
        ('social', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='last_touched',
        ),
        migrations.AddField(
            model_name='profile',
            name='shopping_list',
            field=models.ManyToManyField(related_name='shopping_list', to='recipe.recipe'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, unique=True),
        ),
        migrations.DeleteModel(
            name='Comment',
        ),
    ]