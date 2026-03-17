import axios from 'axios';

// Interceptor de respuestas — detecta 401 en cualquier petición
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token inválido o expirado — limpiar sesión y redirigir
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;