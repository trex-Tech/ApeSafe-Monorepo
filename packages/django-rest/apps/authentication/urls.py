from django.urls import path
from .views import UserSignupView, UserLoginView

urlpatterns = [
    path('register/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login')
]
