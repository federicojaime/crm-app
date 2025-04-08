// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// IMPORTA ESTILOS MANTINE (para DatePicker/TimeInput)
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

// Tailwind
import 'tailwindcss/tailwind.css';

// Importa tus páginas y componentes
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ClientsPage from './pages/ClientsPage';
import SalesPage from './pages/SalesPage';
import PipelinePage from './pages/PipelinePage';
import UsersPage from './pages/UsersPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RRHHPage from './pages/RRHHPage';

// Tareas
import TaskManagement from './components/tasks/TaskManagement';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <BrowserRouter basename="/crm">
          <Routes>
            {/* Página de Login (pública) */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Rutas protegidas (requieren autenticación) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientsPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/tasks" element={<TaskManagement />} />
              </Route>
            </Route>
            
            {/* Rutas que requieren roles específicos */}
            {/* RRHH - Acceso para Super Admin, Distribuidor y Asistente */}
            <Route element={<ProtectedRoute requiredRoles={['SUPER ADMINISTRADOR', 'DISTRIBUIDOR', 'ASISTENTE COMERCIAL']} />}>
              <Route element={<Layout />}>
                <Route path="/rrhh" element={<RRHHPage />} />
              </Route>
            </Route>

            {/* Gestión de Usuarios - Solo Super Admin y Distribuidor */}
            <Route element={<ProtectedRoute requiredRoles={['SUPER ADMINISTRADOR', 'DISTRIBUIDOR']} />}>
              <Route element={<Layout />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}