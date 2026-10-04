from django.contrib.auth.models import User
from django.db import transaction
from core.exceptions.exceptions import DuplicateResourceException
from ..models import Perfil


class UsuarioService:

    @staticmethod
    def _formatar_nome(nome):
        if not nome:
            return ""

        return nome.strip().title()

    @staticmethod
    @transaction.atomic
    def criar_usuario(
        *,
        username,
        password,
        email="",
        first_name="",
        last_name="",
        telefone="",
    ):
        username = username.strip()

        if not first_name:
            partes_nome = (
                username
                .replace(".", " ")
                .replace("_", " ")
                .split()
            )

            first_name = partes_nome[0] if partes_nome else username

            if len(partes_nome) > 1 and not last_name:
                last_name = " ".join(partes_nome[1:])

        usuario = User.objects.create_user(
            username=username,
            password=password,
            email=email.strip().lower(),
            first_name=UsuarioService._formatar_nome(first_name),
            last_name=UsuarioService._formatar_nome(last_name),
        )

        if usuario.username in Perfil.objects.values_list("username", flat=True):
            raise DuplicateResourceException()

        Perfil.objects.create(
            usuario=usuario,
            telefone=telefone.strip(),
        )
        

        return usuario