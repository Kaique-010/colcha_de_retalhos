from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CadastroSerializer
from .services.cadastro import CadastroService


class CadastroView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CadastroSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        usuario = CadastroService.criar_usuario(
            **serializer.validated_data
        )

        return Response(
            {
                "detail": "Cadastro realizado com sucesso.",
                "usuario": {
                    "id": usuario.id,
                    "username": usuario.username,
                    "first_name": usuario.first_name,
                    "last_name": usuario.last_name,
                    "email": usuario.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )