from django.contrib.auth.models import User
from django.db import transaction

from usuarios.models import Perfil


class CadastroService:

    @staticmethod
    @transaction.atomic
    def criar_usuario(
        *,
        username,
        first_name,
        last_name,
        email,
        password,
        telefone="",
    ):
        usuario = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )

        Perfil.objects.create(
            usuario=usuario,
            telefone=telefone,
            ativo=True,
        )

        return usuario