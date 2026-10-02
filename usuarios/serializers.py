from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError
from .models import Perfil


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        dados = super().validate(attrs)

        dados["usuario"] = {
            "id": self.user.id,
            "username": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "email": self.user.email,
        }

        return dados

class PerfilSerializer(serializers.ModelSerializer):

    class Meta:
        model = Perfil
        fields = [
            "telefone",
            "ativo",
        ]


class UsuarioSerializer(serializers.ModelSerializer):

    perfil = PerfilSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "perfil",
        ]


"""class UsuarioCriarSerializer(serializers.Serializer):

    username = serializers.CharField(
        max_length=150,
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    email = serializers.EmailField(
        required=False,
        allow_blank=True,
    )

    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    telefone = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    def validate_username(self, value):
        if User.objects.filter(
            username__iexact=value.strip()
        ).exists():
            raise serializers.ValidationError(
                "Este usuário já está cadastrado."
            )

        return value.strip()
"""

class LogoutSerializer(serializers.Serializer):

    refresh = serializers.CharField()

    def save(self, **kwargs):
        refresh_token = self.validated_data["refresh"]

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except TokenError:
            raise serializers.ValidationError(
                {
                    "refresh": "Token inválido ou já utilizado."
                }
            )


class CadastroSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        required=True,
    )

    first_name = serializers.CharField(
        max_length=150,
        required=True,
    )

    last_name = serializers.CharField(
        max_length=150,
        required=True,
    )

    email = serializers.EmailField(
        required=True,
    )

    telefone = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )

    password = serializers.CharField(
        write_only=True,
        min_length=6,
    )

    password_confirmacao = serializers.CharField(
        write_only=True,
        min_length=6,
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Este usuário já está cadastrado."
            )

        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Este e-mail já está cadastrado."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirmacao"]:
            raise serializers.ValidationError({
                "password_confirmacao": "As senhas não coincidem."
            })

        return attrs