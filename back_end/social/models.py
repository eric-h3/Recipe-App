from django.db import models
from django.contrib.auth.models import User
from RecipeDetails.models import Recipe


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    avi = models.ImageField(default='avatars/default.png', upload_to='avatars', blank=True, null=False)
    bio = models.CharField(max_length=100, null=True)
    phone_num = models.CharField(max_length=15, null=True)
    fav = models.ManyToManyField(Recipe, related_name='fav')
    last_touched = [] # 
    shopping_list = models.ManyToManyField(Recipe, related_name='shopping_list')

