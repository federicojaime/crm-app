// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * Componente para proteger rutas que requieren autenticación.
 * Opcionalmente, puede requerir roles específicos.
 */
export default function ProtectedRoute({ requiredRoles = [] }) {
    const location = useLocation();
    const isAuthenticated = AuthService.isAuthenticated();
    const currentUser = AuthService.getCurrentUser();

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si hay roles requeridos, verificar que el usuario tenga al menos uno de ellos
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => 
            AuthService.hasRole(role)
        );

        // Si no tiene ninguno de los roles requeridos, mostrar página no autorizada
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Si todo está bien, mostrar el contenido de la ruta
    return <Outlet />;
}