from django.urls import path
from rest_framework.routers import DefaultRouter

from usuarios.views import UsuarioViewSet, LoginView
from usuarios.cadastro_views import CadastroView
from rest_framework_simplejwt.views import TokenRefreshView


router = DefaultRouter()

router.register(
    r"usuarios",
    UsuarioViewSet,
    basename="usuarios",
)


urlpatterns = router.urls + [
    path(
        "autenticacao/login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
        "autenticacao/refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),
    path(
        "autenticacao/cadastro/",
        CadastroView.as_view(),
        name="cadastro",
    ),
]