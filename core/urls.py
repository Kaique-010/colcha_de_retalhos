from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),

    path(
        "api/",
        include("usuarios.urls"),
    ),
    path(
        "api/reunioes/",
        include("reunioes.urls"),
    ),
    path(
    "api/reflexoes/",
    include("reflexoes.urls"),
    ),
    path(
        "api/autenticacao/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path(
    "api/",
    include("metricas.urls"),
    ),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema",
        ),
        name="swagger-ui",
    ),
]