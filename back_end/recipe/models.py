import os
from django import forms
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User



class Diet(models.Model):
    name = models.CharField(max_length = 100, blank = False)
    cuisine = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(1)], default = 0)
    
    def __str__(self):
        return self.name


class Ingredient(models.Model):
    name = models.CharField(max_length = 256, blank = False)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length = 100, blank = False)
    diets = models.ManyToManyField(Diet, related_name='recipe_diet')
    cuisine = models.ManyToManyField(Diet, related_name='recipe_cuisine')
    serve = models.PositiveIntegerField(blank = False, default = 1)
    steps = [] # A list containing steps
    av_rating = models.DecimalField(max_digits=2, decimal_places=1, editable=False, default=0)
    total_rating = models.PositiveIntegerField(editable=False, default=0)
    num_rated = models.PositiveIntegerField(editable=False, default=0)
    likes = models.PositiveIntegerField(editable=False, default=0)
    prep_time = models.PositiveIntegerField(null=False, default = 0)
    cook_time = models.PositiveIntegerField(null=False, default = 0)
    total_time = models.PositiveIntegerField(null=False, default = 0)
    base_recipe = models.ForeignKey(to='self', related_name='derived_recipe', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return (self.title)


class RecipeMedia(models.Model):
    recipe = models.ForeignKey(Recipe, null=False, on_delete=models.CASCADE, related_name="recipe_media")
    media = models.FileField(blank = False, upload_to="uploads/recipe_media")
    thumbnail = models.PositiveIntegerField(blank = True, validators=[MinValueValidator(0), MaxValueValidator(1)], default = 0)

    def filename(self):
        return os.path.basename(self.media.name)


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='recipeIngredients')
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    measuring_unit = models.CharField(max_length=50)

    def __str__(self):
        return "an ingredient from " + str(self.recipe)

    def save(self, *args, **kwargs):
        if not self.serving_amount:
            self.serving_amount = self.base_amount
        super(RecipeIngredient, self).save(*args, **kwargs)


class Rating(models.Model):
    value = models.FloatField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)


class Step(models.Model):
    txt = models.CharField(max_length = 1000, blank = False)
    vid = models.FileField(blank = True, upload_to='uploads/steps/vid')
    img = models.FileField(blank = True, upload_to='uploads/steps/img')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    time_taken = models.PositiveIntegerField(null=True)

    def __str__(self):
        return str(self.recipe) + " Step " + self.number
    

class Comment(models.Model):
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, null=False)
    content = models.CharField(max_length = 1000)
    media = models.FileField(blank = True, upload_to='uploads/comments')

    def __str__(self):
        return "a comment to " + str(self.recipe)

