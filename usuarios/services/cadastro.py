from django.contrib.auth.models import User
from django.db import transaction
from core.exceptions.exceptions import DuplicateResourceException



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
        if usuario.username in Perfil.objects.values_list("username", flat=True):
            raise DuplicateResourceException()

        Perfil.objects.create(
            usuario=usuario,
            telefone=telefone,
            ativo=True,
        )
        return usuario