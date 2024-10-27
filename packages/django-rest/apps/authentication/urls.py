from django.urls import path
from .views import UserSignupView, UserLoginView, UserAuthView

urlpatterns = [
    path('register/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('connect/', UserAuthView.as_view(), name='')
]
