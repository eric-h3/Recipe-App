from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator
from django.contrib.auth.models import User
from .models import Diet

class ValidatedForm(forms.Form):
    def validate_field_exists(value):
        if not value:
            raise ValidationError(
                _('This field is required'),
                    code='missing_field'
            )
    def validate_file_extension(value):
        if not value.split('.')[1].lower() in ACCEPTED_TYPES:
            raise ValidationError(
                _('Invalid file extension. Only jpg and png are accepted.'),
                    code='bad_extension'
            )


class IngredientForm(ValidatedForm):
    name=forms.CharField()
    amount=forms.FloatField()
    measuring_unit=forms.CharField()


class NewRecipeForm(ValidatedForm):
    title = forms.CharField()
    prep_time = forms.IntegerField()
    cook_time = forms.IntegerField()
    diets = forms.ModelMultipleChoiceField(queryset = Diet.objects.all().filter(cuisine=0))
    cuisine = forms.ModelMultipleChoiceField(queryset = Diet.objects.all().filter(cuisine=1))
    serve = forms.FloatField()
    ingredient_name = forms.CharField()
    steps = forms.CharField()
    recipe_media = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))


