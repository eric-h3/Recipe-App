from django.urls import path

from .views import *

urlpatterns = [
    path('Recipe/<int:id>/', DisplayRecipe.as_view()),
    path('Recipe/<int:id>/update/servings/', UpdateRecipeServing.as_view()),
    path('Recipe/<int:id>/update/rating/', UpdateRecipeRating.as_view()),
    path('Recipe/<int:id>/update/like/', UpdateRecipeLike.as_view()),
    path('Recipe/<int:id>/createcomment/', CreateComment.as_view()),
    path('Recipe/<int:id>/comments/', RecipeComments.as_view()),
    path('list/<str:sort>/<int:lim>', list_recipes, name="list_recipes"),
    path('userrecipes/<int:uid>/<int:lim>', user_recipes),
    path('createrecipe/', CreateRecipe.as_view()),
    path('createrecipe/prefill/<int:base_recipe>', PreFillRecipe.as_view()),
    path('Recipe/<int:id>/delete/', DeleteRecipe.as_view()),
    path('Recipe/<int:id>/edit/', EditRecipe.as_view()),
    path('search/<str:query>/<int:page_num>/', search_recipe)
]
