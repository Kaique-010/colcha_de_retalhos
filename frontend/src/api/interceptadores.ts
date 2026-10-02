import axios from "axios";

import { clienteApi } from "./cliente";
import {
    limparTokens,
    obterAccessToken,
} from "../armazenamento/autenticacao";
import { renovarToken } from "../servicos/autenticacao";


let atualizandoToken = false;

let filaRequisicoes: Array<{
    resolver: (token: string) => void;
    rejeitar: (erro: unknown) => void;
}> = [];


function processarFila(
    erro: unknown,
    token: string | null = null,
) {

    filaRequisicoes.forEach(
        ({ resolver, rejeitar }) => {

            if (erro) {
                rejeitar(erro);
            } else if (token) {
                resolver(token);
            }
        },
    );

    filaRequisicoes = [];
}


clienteApi.interceptors.request.use(
    async config => {

        const token = await obterAccessToken();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
);


clienteApi.interceptors.response.use(
    response => response,

    async erro => {

        const requisicaoOriginal = erro.config;

        if (
            erro.response?.status !== 401 ||
            requisicaoOriginal._retry
        ) {
            return Promise.reject(erro);
        }

        requisicaoOriginal._retry = true;


        if (atualizandoToken) {

            return new Promise(
                (resolver, rejeitar) => {

                    filaRequisicoes.push({
                        resolver,
                        rejeitar,
                    });

                },
            ).then(token => {

                requisicaoOriginal.headers.Authorization =
                    `Bearer ${token}`;

                return clienteApi(
                    requisicaoOriginal,
                );

            });
        }


        atualizandoToken = true;


        try {

            const novoToken = await renovarToken();

            processarFila(
                null,
                novoToken,
            );

            requisicaoOriginal.headers.Authorization =
                `Bearer ${novoToken}`;

            return clienteApi(
                requisicaoOriginal,
            );

        } catch (erroRefresh) {

            processarFila(
                erroRefresh,
                null,
            );

            await limparTokens();

            return Promise.reject(
                erroRefresh,
            );

        } finally {

            atualizandoToken = false;
        }
    },
);