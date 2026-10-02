from rest_framework.routers import DefaultRouter

from .views import MetricasViewSet


router = DefaultRouter()

router.register(
    "metricas",
    MetricasViewSet,
    basename="metricas",
)

urlpatterns = router.urls