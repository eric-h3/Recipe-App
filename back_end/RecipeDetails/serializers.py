from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import Recipe, RecipeIngredient, Step, Comment, Ingredient
from social.serializers import UserSerializer


class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = [
            'name'
        ]


class RecipeIngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeIngredient
        fields = [
            'id', 'recipe', 'ingredient',
            'base_amount', 'serving_amount', 'measuring_unit'
        ]


class StepSerializer(serializers.ModelSerializer):

    class Meta:
        model = Step
        fields = [
            'id', 'recipe', 'vid', 'img', 'number', 'title', 'description',
            'time_taken'
        ]


class CommentSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = [
            'id', 'recipe', 'commenter',
            'content'
        ]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(read_only=True, many=True)
    steps = StepSerializer(read_only=True, many=True)
    recipe_comments = CommentSerializer(read_only=True, many=True)
    author = UserSerializer(read_only=True)

    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'av_rating', 'num_rated', 'total_rating', 'likes',
            'main_vid', 'main_img', 'prep_time', 'cook_time', 'total_time',
            'diets', 'cuisine', 'servings', 'base_recipe', 'ingredients',
            'steps', 'recipe_comments', 'author'
        ]


class RecipeSerializerPrefill(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(read_only=True, many=True)
    steps = StepSerializer(read_only=True, many=True)
    # base_recipe = RecipeSerializer() doesn't work!

    class Meta:
        model = Recipe
        fields = [
            'name', 'prep_time', 'cook_time', 'total_time',
            'diets', 'cuisine', 'base_recipe', 'ingredients', 'steps',
        ]

