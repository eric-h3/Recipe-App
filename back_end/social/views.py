import time
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .forms import *
from .models import *
from django.contrib.auth.models import User
from django.db.models import F
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from social.serializers import *
from rest_framework.response import Response


from RecipeDetails.models import Recipe


# TODO: NO TEMPLATE OR HTML RESPONSE

def get_user(request):
    if not request.user.is_authenticated:
        return None
    return User.objects.get(pk=request.user.id)


def get_user_info(uid):
    if not (user := User.objects.get(pk=uid)):
        return None
    if not (prof := Profile.objects.get(user=user)):
        return None
    return {"id": uid, "username": user.username, "email": user.email, "first_name": user.first_name,
            "last_name": user.last_name, "avi": prof.avi, "bio": prof.bio, "phone_num": prof.phone_num, "fav": prof.fav}


def get_user_info_auth(request):
    if not (user := get_user(request)):
        return None
    if not (prof := Profile.objects.get(user=user)):
        return None
    return {"id": request.user.id, "username": user.username, "email": user.email, "first_name": user.first_name,
            "last_name": user.last_name, "avi": prof.avi, "bio": prof.bio, "phone_num": prof.phone_num, "fav": prof.fav}


def new_user(request):
    if (request.method == 'GET'):
        form = NewProfileForm()
        return render(request, 'form.html', {'form': form, 'url': reverse('new_user')}, status=200)

    elif (request.method == 'POST'):
        form = NewProfileForm(request.POST, request.FILES)

        if (not form.is_valid()):
            errors = dict(form.errors.items())
            return JsonResponse({"success": False, "message": "Registration unsuccessful", "errors": errors}, status=400)

        data = form.cleaned_data
        user = User.objects.create_user(username=data['username'], email=data['email'], password=data['password1'], first_name=data['first_name'], last_name=data['last_name'])
        user.save()
        
        if data['avi'] is None:
            data['avi'] = 'avatars/default.png'
        prof = Profile(user=user, bio=data['bio'], phone_num=data['phone_num'], avi=data['avi'])
        prof.save()
        return JsonResponse({'success': True}, status=200)
    
    


def login_user(request):
    if (request.method == 'GET'):
        form = LoginForm()
        return render(request, 'form.html', {'form': form, 'url': reverse('login_user')}, status=200)

    elif (request.method == 'POST'):
        form = LoginForm(request.POST)
        if (not form.is_valid()):
            return render(request, 'form.html', {'form': form, 'url': reverse('login_user')}, status=200)

        data = form.cleaned_data
        user = authenticate(request, username=data['username'], password=data['password'])
        
        if user is None:
            return JsonResponse({'error': 'Username or password is invalid'}, status=400)

        login(request, user)
        access_token = AccessToken.for_user(user)
        return JsonResponse({'access_token': str(access_token),'uid': str(user.id)})


def logout_user(request):
    if request.method == 'GET':
        logout(request)
        return JsonResponse({'success', True})

    return JsonResponse({'success', False})

@api_view(['GET'])
def view_profile_helper(request, uid):
    if request.method == 'GET':
        if not (user := User.objects.get(pk=uid)):
            return JsonResponse({'success': False})
        if not (prof := Profile.objects.get(user=user)):
            return JsonResponse({'success': False})
        
        profile_serializer = ProfileSerializer(prof)
        user_serializer = UserSerializer(prof.user)

        return Response({
            'profile': profile_serializer.data,
            'user': user_serializer.data,
        })
    return JsonResponse({'success': False})

def view_profile(request, uid):
    if request.method == 'GET':
        if not (user := User.objects.get(pk=uid)):
            return JsonResponse({'success': False})
        if not (prof := Profile.objects.get(user=user)):
            return JsonResponse({'success': False})
        
        profile_serializer = ProfileSerializer(prof)
        user_serializer = UserSerializer(prof.user)

        return Response({
            'profile': profile_serializer.data,
            'user': user_serializer.data,
        })
    return JsonResponse({'success': False})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_own_profile(request):
    if request.method == 'GET':
        if not (user := get_user_info_auth(request)):
            return HttpResponse(status=401)
        return view_profile(request, user['id'])
    return HttpResponse(status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    if not (user_info := get_user_info_auth(request)):
        return HttpResponse(status=401)
    if request.method == 'GET':
        user_info.pop('fav')
        return render(request, 'form.html',
                      {'form': EditProfileForm(initial=user_info), 'url': reverse('edit_profile')}, status=200)

    if request.method == 'POST':
        form = EditProfileForm(request.POST, request.FILES)
        if not form.is_valid():
            errors = dict(form.errors.items())
            return JsonResponse({"success": False, "message": "Registration unsuccessful", "errors": errors}, status=400)

        data = form.cleaned_data
        print(data)
        user = get_user(request)
        if data['password1'] != '' and data['password2'] != '':
            user.set_password(data['password1'])
        user.save()
        user.email = data['email']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.save()

        prof = Profile.objects.get(user_id=user.pk)
        prof.bio = data['bio']
        if data.get('avi'):
            prof.avi = data['avi']
        prof.phone_num = data['phone_num']
        prof.save()
        return HttpResponseRedirect(reverse('view_own_profile'))

    return HttpResponse(status=400)


def update_last(user, rid):
    p = Profile.objects.get(user=user)
    j=0
    latest = time.perf_counter()
    for i in range(len(p.last_touched)):
        # If rid matches, update time, else drop latest and add recipe matching rid.
        if p.last_touched[i][0] == rid:
            p.last_touched[i][1] = time.perf_counter()
            return True
        else:
            if latest := min(latest, p.last_touched[i][1]) == p.last_touched[i][1]:
                j=i
    if len(p.last_touched) > 10:
        p.last_touched.pop(j)
    p.last_touched.append(([rid, time.perf_counter()]))
    p.save()


def favourite_recipe(request, uid, rid):
    if not (user:= User.objects.get(id=uid)):
        return JsonResponse({'success': False})
    profile = Profile.objects.get(user=user)
    recipe = Recipe.objects.get(id=rid)
    if profile.fav.filter(id=rid).exists():
        recipe.likes = F("likes") - 1
        recipe.save(update_fields=["likes"])
        profile.fav.remove(recipe)
    else:
        recipe.likes = F("likes") + 1
        recipe.save(update_fields=["likes"])
        profile.fav.add(recipe)
    update_last(user, rid)
    return JsonResponse({'success': True})


# Requires user id
def shopping_cart(request, uid, rid):
    if not (user:= User.objects.get(id=uid)):
        return JsonResponse({'success': False})
    profile = Profile.objects.get(user=user)
    recipe = Recipe.objects.get(id=rid)
    if profile.shopping_list.filter(id=rid).exists():
        profile.shopping_list.remove(recipe)
    else:
        profile.shopping_list.add(recipe)
    update_last(user, rid)
    return JsonResponse({'success': True})
