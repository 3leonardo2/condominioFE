import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiereAdmin = false }) => {
    const token = localStorage.getItem('auth_token');
    const usuario = JSON.parse(localStorage.getItem('user_data') || 'null');

    // Sin sesión → redirigir al login
    if (!token || !usuario) {
        return <Navigate to="/login" replace />;
    }

    // Ruta de admin pero el usuario no es admin → redirigir al inicio
    if (requiereAdmin && !usuario.admin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;