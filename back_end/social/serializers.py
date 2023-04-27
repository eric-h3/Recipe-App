from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ('id', 'bio', 'phone_num', 'fav', 'last_touched', 'avi', 'user', 'shopping_list')

class ProfileWithUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ('id', 'bio', 'phone_num', 'fav', 'last_touched', 'avi', 'user', 'shopping_list')