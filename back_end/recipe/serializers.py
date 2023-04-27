from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import Recipe, Step, Comment, Ingredient
from social.serializers import ProfileSerializer


class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = [
            'name'
        ]


class StepSerializer(serializers.ModelSerializer):

    class Meta:
        model = Step
        fields = [
            'pk', 'recipe', 'vid', 'img', 'txt', 'time_taken'
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'pk', 'recipe', 'creator', 'content', 'media'
        ]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(read_only=True, many=True)
    steps = StepSerializer(read_only=True, many=True)
    recipe_comments = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Recipe
        fields = '__all__'


class RecipeSerializerPrefill(serializers.ModelSerializer):
    ingredients = IngredientSerializer(read_only=True, many=True)
    steps = StepSerializer(read_only=True, many=True)
    # base_recipe = RecipeSerializer() doesn't work!

    class Meta:
        model = Recipe
        fields = [
            'name', 'main_vid', 'main_img', 'prep_time', 'cook_time', 'total_time',
            'diets', 'cuisine', 'base_recipe', 'ingredients', 'steps',
        ]

