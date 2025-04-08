// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ requiredRoles = [] }) {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Obtener el usuario actual y su rol
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.rol || '';

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si hay roles requeridos, verificar que el usuario tenga el rol apropiado
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(userRole);

        // Si no tiene ninguno de los roles requeridos, mostrar página no autorizada
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Si todo está bien, mostrar el contenido de la ruta
    return <Outlet />;
}