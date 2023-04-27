from django.contrib import admin

# Register your models here.
from .models import Recipe, RecipeIngredient, Step, Comment, Ingredient

admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(Step)
admin.site.register(Comment)
admin.site.register(Ingredient)

