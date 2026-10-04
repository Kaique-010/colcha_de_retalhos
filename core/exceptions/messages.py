from .codes import ErrorCode


ERROR_MESSAGES = {
    ErrorCode.VALIDATION_ERROR: "Verifique os dados informados.",
    ErrorCode.NOT_FOUND: "O registro solicitado não foi encontrado.",
    ErrorCode.PERMISSION_DENIED: "Você não tem permissão para realizar esta ação.",
    ErrorCode.NOT_AUTHENTICATED: "Sua sessão expirou. Faça login novamente.",
    ErrorCode.AUTHENTICATION_FAILED: "Usuário ou senha inválidos.",
    ErrorCode.DUPLICATE_RESOURCE: "Este registro já existe.",
    ErrorCode.INTERNAL_ERROR: "Ocorreu um erro inesperado. Tente novamente.",
}