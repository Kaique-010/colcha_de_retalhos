from rest_framework.routers import DefaultRouter

from .views import ReflexaoDiariaViewSet


router = DefaultRouter()

router.register(
    "reflexoes",
    ReflexaoDiariaViewSet,
    basename="reflexao-diaria",
)

urlpatterns = router.urls