from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    UpdateAPIView, DestroyAPIView
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .forms import *
from .models import *
from social.models import *
from django.core.paginator import Paginator
from .serializers import RecipeSerializer, CommentSerializer, \
    RecipeSerializerPrefill, StepSerializer, IngredientSerializer



def get_recipe_info(rid):
    if not (rec := Recipe.objects.get(id=rid)):
        return None
    return {'title': rec.title, 'recipe_media': RecipeMedia.objects.all().filter(recipe=rec), 'prep_time': rec.prep_time, 'cook_time':rec.cook_time, 'serve': rec.serve, 'diets': rec.diets.all(), 'cuisine': rec.cuisine.all(), 'ingredient_name': RecipeIngredient.objects.all().filter(recipe=rec), 'steps':rec.steps}


def create_ingredient(request, pk):
    if request.method=='GET':
        form=IngredientForm()
        return render(request, 'form.html', {'form': form, 'url': reverse('create_ingredient', kwargs={'pk':pk})}, status=200)
    if request.method=='POST':
        recipe=Recipe.objects.get(id=pk)
        _create_recipe_ingredients(request.POST.dict(), recipe)
        return reverse('recipe_details', kwargs={'pk':pk})
    return HTTP404()
        
    


def _create_recipe_ingredients(data, recipe):
    ingredient_count = 1
    for i in range(ingredient_count):
        ingredient_data = {}
        num = str(i + 1)
        ingredient_data['recipe'] = recipe
        ing = data['name']

        if (Ingredient.objects.filter(name=ing)).exists():
            pass
        else:
            ing_data = {'name': ing}
            ing_serializer = IngredientSerializer(data=ing_data)
            ing_serializer.is_valid(raise_exception=True)
            ing_serializer.save()

        ingredient_data['ingredient'] = ing
        ingredient_data['amount'] = data['amount']
        ingredient_data['measuring_unit'] = data['measuring_unit']
        ingredient_serializer = IngredientSerializer(data=ingredient_data)
        ingredient_serializer.is_valid(raise_exception=True)
        ingredient_serializer.save()


def _delete_recipe_ingredients(instance):
    for ingredient in instance.ingredients.all():
        ingredient.delete()


def add_recipe(request):
    if request.method == 'GET':
        form = NewRecipeForm()
        return render(request, 'form.html', {'form': form, 'url': reverse('add_recipe')}, status=200)
    if request.method == 'POST':
        creator = User.objects.get(pk=request.user.id)
        title = request.POST.get('title')
        diets = request.POST.getlist('diets') #list of strings
        cuisine = request.POST.getlist('cuisine') #list of strings
        ingredients = request.POST.getlist('ingredients') #list of ingredient objects
        serve = request.POST.get('serve')
        media = request.POST.getlist('media') #list of media links
        steps = request.POST.getlist('steps') #list of step objects
        comments = [] #this is null on creation

        if creator and title and diets and cuisine and ingredients and serve:
            recipe = Recipe(creator=creator, title=title, serve=serve,
                            media=media)
            recipe.save()
            recipe.diets.set(Diet.objects.all().filter(name=diets[0]))
            recipe.cuisine.set(Diet.objects.all().filter(name=cuisine[0]))
            _create_recipe_ingredients(request.POST, recipe)
            rating = Rating(value=0, recipe=recipe)
            rating.save()

            return HttpResponseRedirect('/recipe/{}/details'.format(recipe.id))
    return JsonResponse({'error': 'Unable to add recipe', "user": request.POST})

#recipe_id id the pk of the recipe; need to know the recipe we are modifying
def edit_recipe(request, pk):
    try:
        if request.method == 'GET':
            form=NewRecipeForm(initial=get_recipe_info(pk))
            return render(request, 'form.html', {'form': form, 'url': reverse('edit_recipe', kwargs={'pk':pk})}, status=200)
        if request.method == 'POST':
            recipe = Recipe.objects.get(id=pk)

            creator = User.objects.get(pk=request.user.id)
            title = request.POST.get('title')
            diets = request.POST.getlist('diets')
            cuisine = request.POST.getlist('cuisine')
            ingredients = request.POST.getlist('ingredients')
            serve = request.POST.get('serve')
            media = request.POST.getlist('media')

            #steps = Step.object.all().filter(recipe=recipe).order_by('order')
            # ^^^ only for recall
            steps = request.POST.getlist('steps') #gets a list of step objects
            rating = get_rating(recipe)
            comments = get_comments(recipe)

            #update
            recipe.creator = creator
            recipe.title = title
            recipe.diets.set(diets, clear=True)
            recipe.cuisine.set(cuisine, clear=True)
            recipe.ingredients = {x.name: ingredients[x] for x in ingredients}
            recipe.serve = serve



            recipe.save()

            return HttpResponseRedirect('/recipe/{}/details'.format(recipe.id))

    except Recipe.DoesNotExist:
        return JsonResponse({'error': 'Recipe DNE'})


class DeleteRecipe(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(Recipe, id=self.kwargs['pk'])
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        step_data['txt'] = data[f'{step}_description']
        step_data['time_taken'] = data[f'{step}_time_taken']
        step_serializer = StepSerializer(data=step_data)
        step_serializer.is_valid(raise_exception=True)
        step_serializer.save()


def _delete_recipe_steps(instance):
    for step in instance.steps.all():
        step.delete()





def get_steps(rid):
    if (not (recipe := Recipe.objects.get(pk=rid))):
        return JsonResponse({'error': 'Recipe DNE'})
    json_steps = {}
    steps = Step.objects.all().filter(recipe=recipe).order_by('order')
    if not(steps):
        return JsonResponse({'error': 'Recipe does not have any steps'})
    for step in steps:
        json_steps[step.order] = (step.text, step.media)

    return JsonResponse(json_steps)

# helper function to get average rating of recipe
def get_rating(recipe):
    ratings = Rating.objects.all().filter(recipe=recipe)
    total = 0
    if len(ratings) == 0:
        return 0
    for entry in ratings:
        total += entry.value
    return total / len(ratings)

def get_comments(recipe):
    comments = Comment.objects.all().filter(recipe=recipe)
    json_comments = {}
    for comment in comments:
        json_comments[comment.creator] = (comment.content, comment.media)
    return JsonResponse(json_comments)


class UpdateRecipeRating(UpdateAPIView):

    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=self.kwargs['pk'])
        data = request.data
        rating = int(data['rating'])

        total_rating = int(recipe.total_rating) + rating
        num_rated = int(recipe.num_rated) + 1
        av_rating = total_rating / num_rated
        recipe.total_rating = total_rating
        recipe.num_rated = num_rated
        recipe.av_rating = av_rating
        recipe.save()
        recipe = get_object_or_404(Recipe, id=self.kwargs['pk'])
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)


class UpdateRecipeLike(UpdateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=self.kwargs['pk'])
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
        recipe = get_object_or_404(Recipe, id=self.kwargs['pk'])
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)


#Requires recipe id
class DisplayRecipe(RetrieveAPIView):
    serializer_class = RecipeSerializer

    def get_object(self):
        instance = get_object_or_404(Recipe, id=self.kwargs['pk'])
        return instance


class CreateComment(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(commenter=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        data._mutable = True
        data['recipe'] = self.kwargs['pk']
        data['creator'] = request.user
        data._mutable = False
        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        recipe = get_object_or_404(Recipe, pk=self.kwargs['pk'])
        s = RecipeSerializer(recipe)
        return Response(s.data)


def search_recipe(request, query, page_num):
    if request.method == 'POST':
        # get all recipes with suffix of "query"
        expr = "^"+query+".*$"
        by_title = Recipe.objects.filter(title__iregex=expr)
        by_creator = Recipe.objects.filter(creator__username__contains=expr)
        #by_ingredients = Recipe.objects.filter(ingredients=)

        # combine the querysets
        ret = by_title | by_creator# | by_ingredients
        #sort by rating
        sorted(ret, key=get_rating)
        # paginate, 25 elems per page
        paginator = Paginator(ret, 25)
        page = paginator.get_page(page_num)

        return JsonResponse({'recipes': [{x.title: x.id} for x in page.object_list]})


