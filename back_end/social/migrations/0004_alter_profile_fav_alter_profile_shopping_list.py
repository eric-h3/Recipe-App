# Generated by Django 4.1.7 on 2023-04-11 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RecipeDetails', '0001_initial'),
        ('social', '0003_alter_profile_avi'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='fav',
            field=models.ManyToManyField(related_name='fav', to='RecipeDetails.recipe'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='shopping_list',
            field=models.ManyToManyField(related_name='shopping_list', to='RecipeDetails.recipe'),
        ),
    ]
