from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import F, Subquery, OuterRef
from django.http import JsonResponse
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    UpdateAPIView, DestroyAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status

from .models import *
from .serializers import RecipeSerializer, CommentSerializer, \
    RecipeSerializerPrefill, StepSerializer, \
    RecipeIngredientSerializer, IngredientSerializer
# Create your views here.


def _create_recipe_ingredients(data, recipe):
    ingredient_count = int(data['ingredient_count'])
    for i in range(ingredient_count):
        ingredient_data = {}
        num = str(i + 1)
        ingredient_data['recipe'] = recipe
        ing = data[f'{num}_ingredient']

        if (Ingredient.objects.filter(name=ing)).exists():
            pass
        else:
            ing_data = {'name': ing}
            ing_serializer = IngredientSerializer(data=ing_data)
            ing_serializer.is_valid(raise_exception=True)
            ing_serializer.save()

        ingredient_data['ingredient'] = ing
        ingredient_data['base_amount'] = data[f'{num}_base_amount']
        ingredient_data['measuring_unit'] = data[f'{num}_measuring_unit']
        ingredient_serializer = RecipeIngredientSerializer(data=ingredient_data)
        ingredient_serializer.is_valid(raise_exception=True)
        ingredient_serializer.save()


def _delete_recipe_ingredients(instance):
    for ingredient in instance.ingredients.all():
        ingredient.delete()


def _create_recipe_steps(data, recipe):
    # making steps
    step_count = int(data['step_count'])
    for i in range(step_count):
        step_data = {}
        step = str(i + 1)
        step_data['recipe'] = recipe
        if f'{step}_vid' in data:
            step_data['vid'] = data[f'{step}_vid']
        if f'{step}_img' in data:
            step_data['img'] = data[f'{step}_img']
        step_data['number'] = data[f'{step}_number']
        step_data['title'] = data[f'{step}_title']
        step_data['description'] = data[f'{step}_description']
        step_data['time_taken'] = data[f'{step}_time_taken']
        step_serializer = StepSerializer(data=step_data)
        step_serializer.is_valid(raise_exception=True)
        step_serializer.save()


def _delete_recipe_steps(instance):
    for step in instance.steps.all():
        step.delete()


class DisplayRecipe(RetrieveAPIView):
    serializer_class = RecipeSerializer

    def get_object(self):
        instance = get_object_or_404(Recipe, id=self.kwargs['id'])
        return instance


class UpdateRecipeServing(UpdateAPIView):
    serializer_class = RecipeSerializer

    def update(self, request, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        data = request.data
        servings = data['servings']

        recipe.servings = servings
        recipe.save()
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)


class UpdateRecipeRating(UpdateAPIView):

    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        data = request.data
        rating = int(data['rating'])
        total_rating = int(recipe.total_rating) + rating
        num_rated = int(recipe.num_rated) + 1
        av_rating = total_rating / num_rated
        recipe.total_rating = total_rating
        recipe.num_rated = num_rated
        recipe.av_rating = av_rating
        recipe.save()
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)


class UpdateRecipeLike(UpdateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        data = request.data
        like = data['like']
        if like:
            recipe.likes = F('likes') + 1
        else:
            if recipe.likes == 0:
                pass
            else:
                recipe.likes = F('likes') - 1
        recipe.save()
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)


class CreateComment(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(commenter=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        data._mutable = True
        data['recipe'] = self.kwargs['id']
        data._mutable = False
        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        s = RecipeSerializer(recipe)
        return Response(s.data)


class PreFillRecipe(RetrieveAPIView):
    serializer_class = RecipeSerializerPrefill

    def retrieve(self, request, *args, **kwargs):
        br = int(kwargs['base_recipe'])  # Retrieve the 'base_recipe' parameter from the URL
        instance = get_object_or_404(Recipe, id=br)
        a = RecipeSerializer(instance)
        data = a.data
        data['base_recipe'] = br
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class CreateRecipe(CreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = RecipeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        _create_recipe_ingredients(data, serializer.data['id'])
        _create_recipe_steps(data, serializer.data['id'])

        s = RecipeSerializer(get_object_or_404(Recipe, id=serializer.data['id']))
        return Response(s.data)


class DeleteRecipe(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    # TODO: check if the person owns the recipe

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(Recipe, id=self.kwargs['id'])
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class EditRecipe(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    # TODO: check if the person owns the recipe
    serializer_class = RecipeSerializer

    def update(self, request, *args, **kwargs):

        instance = get_object_or_404(Recipe, id=self.kwargs['id'])
        _delete_recipe_ingredients(instance)
        _create_recipe_ingredients(request.data, self.kwargs['id'])
        _delete_recipe_steps(instance)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class RecipeComments(ListAPIView):
    serializer_class = CommentSerializer
    model = Comment
    def get(self, request, **kwargs):
        queryset=Comment.objects.all().filter(recipe=Recipe.objects.get(id=self.kwargs['id']))
        serializer= CommentSerializer(queryset, many=True)
        return Response(serializer.data)


def user_recipes(request, uid, lim):
    rec_list = Recipe.objects.all().filter(author=User.objects.get(id=uid))
    if lim > 0:
        rec_list= rec_list[:lim]
    return JsonResponse([x for x in rec_list.values()], safe=False)


def list_recipes(request, sort, lim):
    rec_list = Recipe.objects.all().order_by(sort)
    if lim > 0:
        rec_list= rec_list[:lim]
    return JsonResponse([x for x in rec_list.values()], safe=False)


def search_recipe(request, query, page_num):
    # get all recipes with suffix of "query"
    page_len=24
    expr = query+".*$"
    by_title = Recipe.objects.filter(name__iregex=expr)
    by_creator = Recipe.objects.filter(author__username__iregex=expr)
    ing = Ingredient.objects.filter(name__iregex=expr)
    recing = RecipeIngredient.objects.filter(ingredient__name__in=Subquery(ing.values('name')))
    by_ingredients = Recipe.objects.filter(id__in=Subquery(recing.values('recipe')))

    # combine the querysets
    ret = by_title | by_creator | by_ingredients
    serializer=RecipeSerializer(ret.order_by("-av_rating"), many=True)
    return JsonResponse(serializer.data[(page_len*(page_num-1)):(page_len*page_num)],safe=False)