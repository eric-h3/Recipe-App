from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator
from django.contrib.auth.models import User
from social.models import Profile

UPLOAD_DIR='uploads/'
ACCEPTED_TYPES = ['png', 'jpg']

class ValidatedForm(forms.Form):
    def validate_field_exists(value):
        if not value:
            raise ValidationError(
                _('This field is required'),
                    code='missing_field'
            )


    def validate_password_length(value):
        if (len(value) < 8):
            raise ValidationError(
                _('This password is too short. It must contain at least 8 characters'),
                    code='bad_length'
            )


    def validate_equal_passwords(self, data):
        pw1 = data.get("password1")
        pw2 = data.get("password2")
        if (pw1 != pw2):
            self.add_error('password1', ValidationError(
                _("The two password fields didn't match"),
                 code='pass_mismatch'
            ))


class NewProfileForm(ValidatedForm):
    def validate_name(value):
        if (User.objects.filter(username=value).exists()):
            raise ValidationError(
                _('A user with that username already exists'),
                code='name_taken'
            )

    first_name = forms.CharField(label='firstname', max_length=100, validators=[ValidatedForm.validate_field_exists])
    last_name = forms.CharField(label='lastname', max_length=100, validators=[ValidatedForm.validate_field_exists])
    username = forms.CharField(label='username', max_length=100, validators=[ValidatedForm.validate_field_exists, validate_name])
    bio = forms.CharField(label='bio', max_length=100, required=False)
    email = forms.EmailField(label='email', max_length=100, validators=[EmailValidator])
    password1 = forms.CharField(label='password1', max_length=100, widget=forms.PasswordInput(), validators=[ValidatedForm.validate_field_exists, ValidatedForm.validate_password_length])
    password2 = forms.CharField(label='password2', max_length=100, widget=forms.PasswordInput(), validators=[ValidatedForm.validate_field_exists])
    avi = forms.FileField(label='avi', required=False)
    phone_num = forms.CharField(label='phone_number', max_length=15,required=False)

    def clean(self):
        data = super().clean()
        self.validate_equal_passwords(data)
        
        return data

class EditProfileForm(NewProfileForm):
    password1 = forms.CharField(label='password1', max_length=100, widget=forms.PasswordInput(), required=False)
    password2 = forms.CharField(label='password2', max_length=100, widget=forms.PasswordInput(), required=False)
    username = forms.CharField(label='username', max_length=100, required=False)
    
class LoginForm(ValidatedForm):
    username = forms.CharField(label="username", max_length=100)
    password = forms.CharField(label='password', max_length=100, widget=forms.PasswordInput())

    def clean(self):
        return super().clean()

