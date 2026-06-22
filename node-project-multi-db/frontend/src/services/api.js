import axios from 'axios';

// Base URL definida por variável de ambiente. Em produção (Docker) o nginx
// faz o proxy de /api -> backend, evitando problemas de CORS.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Request: anexa o JWT do localStorage em todas as requisições.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: em 401, limpa a sessão e redireciona para o login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Evita loops quando já estamos na página de login.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Normaliza o array de erros vindos do backend em uma mensagem legível.
export function extractErrorMessage(error, fallback = 'Ocorreu um erro inesperado.') {
  if (error.response) {
    const { data, status } = error.response;
    if (data && data.message) return data.message;
    if (status === 401) return 'Credenciais inválidas ou sessão expirada.';
    if (status === 403) return 'Você não tem permissão para esta ação.';
    if (status === 404) return 'Recurso não encontrado.';
    return `Erro ${status}.`;
  }
  if (error.request) return 'Sem resposta do servidor. Verifique sua conexão.';
  return fallback;
}

export default api;
