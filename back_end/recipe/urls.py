from django.urls import path

from recipe.views import *


urlpatterns = [
    path('<int:pk>/details/', DisplayRecipe.as_view(), name='recipe_details'),
    path('<int:pk>/edit/', edit_recipe, name='edit_recipe'),
    path('new/', add_recipe, name='add_recipe'),
    path('<int:pk>/ingredient/', create_ingredient, name='create_ingredient'),
    path('<int:pk>/step/', create_ingredient, name='create_step'),
    path('search/<query>/<page_num>', search_recipe, name='search_recipe'),
    path('<int:pk>/createcomment/', CreateComment.as_view()),
    path('<int:pk>/delete/', DeleteRecipe.as_view()),
    ]
