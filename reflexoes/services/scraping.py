import re
from datetime import date

import requests
from bs4 import BeautifulSoup
from django.utils import timezone

from ..models import ReflexaoDiaria


class ScrapingReflexaoService:

    URL = "https://www.aarj.org.br/reflexao-diaria"

    @classmethod
    def executar(cls):
        response = requests.get(
            cls.URL,
            timeout=30,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(compatible; ColchaDeRetalhos/1.0)"
                )
            },
        )

        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser",
        )

        titulo = cls._extrair_titulo(soup)
        data = cls._extrair_data(soup)
        conteudo = cls._extrair_conteudo(soup)

        if not titulo:
            raise ValueError(
                "Não foi possível encontrar o título da reflexão."
            )

        if not data:
            raise ValueError(
                "Não foi possível encontrar a data da reflexão."
            )

        if not conteudo:
            raise ValueError(
                "Não foi possível encontrar o conteúdo da reflexão."
            )

        reflexao, criada = (
            ReflexaoDiaria.objects.update_or_create(
                data=data,
                defaults={
                    "titulo": titulo,
                    "conteudo": conteudo,
                    "fonte": cls.URL,
                },
            )
        )

        return reflexao, criada

    @staticmethod
    def _extrair_titulo(soup):
        titulo = soup.find(
            "h3",
            string=lambda texto: (
                texto and texto.strip()
            ),
        )

        if not titulo:
            return None

        return titulo.get_text(
            strip=True
        )

    @staticmethod
    def _extrair_data(soup):
        texto_pagina = soup.get_text(
            " ",
            strip=True,
        )

        # Procura pelo formato apresentado
        # na reflexão: 02/10
        match = re.search(
            r"\b(\d{2})/(\d{2})\b",
            texto_pagina,
        )

        if not match:
            return None

        dia = int(match.group(1))
        mes = int(match.group(2))

        ano = timezone.localdate().year

        try:
            return date(
                ano,
                mes,
                dia,
            )
        except ValueError:
            return None

    @staticmethod
    def _extrair_conteudo(soup):
        titulo = soup.find(
            "h3",
            string=lambda texto: (
                texto and texto.strip()
            ),
        )

        if not titulo:
            return None

        # O primeiro h3 é o título da reflexão.
        # O próximo h3 é a data.
        data_elemento = titulo.find_next("h3")

        if not data_elemento:
            return None

        paragrafos = []

        elemento = data_elemento.find_next()

        while elemento:

            if elemento.name == "h3":
                texto = elemento.get_text(
                    strip=True
                )

                if texto == "Navegação Rápida":
                    break

            if elemento.name == "p":
                texto = elemento.get_text(
                    " ",
                    strip=True,
                )

                if texto:
                    paragrafos.append(texto)

            elemento = elemento.find_next()

        return "\n\n".join(paragrafos)