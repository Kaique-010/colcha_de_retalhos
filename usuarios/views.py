from django.contrib.auth.models import User

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    UsuarioSerializer,
)
from usuarios.services.services import UsuarioService


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]


class UsuarioViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "list":
            return [IsAuthenticated(), IsAdminUser()]

        return [IsAuthenticated()]

    def list(self, request):
        usuarios = self.get_queryset()
        serializer = self.get_serializer(usuarios, many=True)

        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = UsuarioService.criar_usuario(
            **serializer.validated_data,
        )

        return Response(
            UsuarioSerializer(usuario).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="me",
    )
    def me(self, request):
        serializer = UsuarioSerializer(request.user)

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        url_path="logout",
    )
    def logout(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "detail": "Logout realizado com sucesso."
            },
            status=status.HTTP_200_OK,
        )