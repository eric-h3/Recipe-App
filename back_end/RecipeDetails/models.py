import sys

from django.db import models
from django.db.models import CASCADE, SET_NULL
from decimal import Decimal
from django.contrib.auth.models import User
# Create your models here.


class Recipe(models.Model):
    name = models.CharField(max_length=50)
    av_rating = models.DecimalField(max_digits=2, decimal_places=1, editable=False, default=0)
    total_rating = models.PositiveIntegerField(editable=False, default=0)
    num_rated = models.PositiveIntegerField(editable=False, default=0)
    likes = models.PositiveIntegerField(editable=False, default=0)
    author = models.ForeignKey(to=User, related_name='owned_recipes', on_delete=CASCADE, editable=False)
    main_vid = models.FileField(null=True, blank=True, upload_to='main_vid/')
    main_img = models.ImageField(null=True, blank=True, upload_to='main_img/')
    prep_time = models.PositiveIntegerField()
    cook_time = models.PositiveIntegerField()
    total_time = models.PositiveIntegerField()
    diets = models.CharField(max_length=50)
    cuisine = models.CharField(max_length=50)
    servings = models.PositiveIntegerField(editable=False, default=1)
    base_recipe = models.ForeignKey(to='self', related_name='derived_recipe', blank=True, null=True, on_delete=SET_NULL)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            for ing in self.ingredients.all():
                a = int(self.servings)
                b = Decimal(ing.base_amount)
                ing.serving_amount = a * b
                ing.save()
        super(Recipe, self).save(*args, **kwargs)


class Ingredient(models.Model):
    name = models.CharField(max_length=50, primary_key=True)

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(to=Ingredient, on_delete=CASCADE, related_name='recipeIngredients')
    base_amount = models.DecimalField(max_digits=5, decimal_places=2)
    serving_amount = models.DecimalField(max_digits=5, decimal_places=2, editable=False)
    measuring_unit = models.CharField(max_length=50)

    def __str__(self):
        return "an ingredient from " + str(self.recipe)

    def save(self, *args, **kwargs):
        if not self.serving_amount:
            self.serving_amount = self.base_amount
        super(RecipeIngredient, self).save(*args, **kwargs)


class Step(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=CASCADE, related_name='steps')
    vid = models.FileField(null=True, blank=True, upload_to='step_vid/')
    img = models.ImageField(null=True, blank=True, upload_to='step_img/')
    number = models.CharField(max_length=2)
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=300)
    time_taken = models.PositiveIntegerField()

    def __str__(self):
        return str(self.recipe) + " Step " + self.number


class Comment(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=CASCADE, related_name='recipe_comments')
    commenter = models.ForeignKey(to=User, on_delete=CASCADE, related_name='posted_comments', editable=False)
    content = models.TextField(max_length=100)

    def __str__(self):
        return "a comment to " + str(self.recipe)




