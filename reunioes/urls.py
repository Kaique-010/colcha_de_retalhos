from rest_framework.routers import DefaultRouter

from .views import ReuniaoCalendarioViewSet


router = DefaultRouter()

router.register(
    "calendario",
    ReuniaoCalendarioViewSet,
    basename="reuniao-calendario",
)

urlpatterns = router.urls