from django.urls import path

from social.views import *


urlpatterns = [
    path('profile/register/', new_user, name='new_user'),
    path('profile/login/', login_user, name='login_user'),
    path('profile/own/', view_own_profile, name='view_own_profile'),
    path('profile/view/<int:uid>', view_profile, name='view_profile'),
    path('profile/display/<int:uid>', view_profile_helper, name='view_profile'),
    path('profile/edit/', edit_profile, name='edit_profile'),
    path('profile/logout/', logout_user, name='logout_user'),
    path('cart/<int:uid>/<int:rid>', shopping_cart, name='shopping_cart'),
    path('favrecipe/<int:uid>/<int:rid>', favourite_recipe),
    ]
