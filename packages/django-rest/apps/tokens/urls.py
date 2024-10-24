from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TokenViewSet

router = DefaultRouter()
router.register(r'create-token', TokenViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
