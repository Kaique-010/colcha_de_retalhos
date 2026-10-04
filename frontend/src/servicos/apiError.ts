import axios from "axios";

export interface ApiError {
  success: false;
  code: string;
  message: string;
  errors: Record<string, string[]>;
}

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.code && data?.message) {
      return {
        success: false,
        code: data.code,
        message: data.message,
        errors: data.errors ?? {},
      };
    }
  }

  return {
    success: false,
    code: "NETWORK_ERROR",
    message: "Não foi possível conectar ao servidor.",
    errors: {},
  };
}