// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ requiredRoles = [] }) {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Obtener el usuario actual y su rol
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.rol || '';
    const userSubRole = user.subRol || '';

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si hay roles requeridos, verificar que el usuario tenga el rol apropiado
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => {
            // Verificar rol principal
            if (role === userRole) return true;
            
            // Caso especial: Asistente de RRHH - puede acceder a rutas que requieren RRHH
            if (userRole === 'ASISTENTE' && userSubRole === 'RRHH' && role === 'RRHH') {
                return true;
            }
            
            // Para compatibilidad con el sidebar que usa ASISTENTE_RRHH
            if (userRole === 'ASISTENTE' && userSubRole === 'RRHH' && role === 'ASISTENTE_RRHH') {
                return true;
            }
            
            return false;
        });

        // Si no tiene ninguno de los roles requeridos, mostrar página no autorizada
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Si todo está bien, mostrar el contenido de la ruta
    return <Outlet />;
}