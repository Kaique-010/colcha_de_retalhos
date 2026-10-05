from django.urls import include, path
from rest_framework.routers import DefaultRouter

from estudos import views

router = DefaultRouter()
router.register(r"estudos", views.EstudosViewSet)

urlpatterns = [
    path("", include(router.urls)),
]