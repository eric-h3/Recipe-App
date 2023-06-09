# Generated by Django 4.1.7 on 2023-04-04 22:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0004_rename_base_amount_recipeingredient_amount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='media',
            field=models.FileField(blank=True, upload_to='uploads/comments'),
        ),
        migrations.AlterField(
            model_name='recipemedia',
            name='media',
            field=models.FileField(upload_to='uploads/recipe_media'),
        ),
        migrations.AlterField(
            model_name='step',
            name='img',
            field=models.FileField(blank=True, upload_to='uploads/steps/img'),
        ),
        migrations.AlterField(
            model_name='step',
            name='vid',
            field=models.FileField(blank=True, upload_to='uploads/steps/vid'),
        ),
    ]
