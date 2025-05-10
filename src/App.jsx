// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
//import HRPipelinePage from './pages/HRPipelinePage';

// Páginas de estadísticas
import PerformancePage from './pages/statistics/PerformancePage';
import FunnelPage from './pages/statistics/FunnelPage';
import AgentsPage from './pages/statistics/AgentsPage';

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

            {/* Estadísticas - Acceso para Super Admin y Distribuidor */}
            <Route element={<ProtectedRoute requiredRoles={['SUPER_ADMIN', 'DISTRIBUIDOR']} />}>
              <Route element={<Layout />}>
                <Route path="/statistics/performance" element={<PerformancePage />} />
                <Route path="/statistics/funnel" element={<FunnelPage />} />
                <Route path="/statistics/agents" element={<AgentsPage />} />
              </Route>
            </Route>

            {/* RRHH - Acceso para Super Admin, Distribuidor y Asistente  <Route path="/rrhh/pipeline" element={<HRPipelinePage />} />*/}
            <Route element={<ProtectedRoute requiredRoles={['SUPER_ADMIN', 'DISTRIBUIDOR', 'ASISTENTE_RRHH']} />}>
              <Route element={<Layout />}>
                <Route path="/rrhh" element={<RRHHPage />} />
               
              </Route>
            </Route>

            {/* Gestión de Usuarios - Solo Super Admin y Distribuidor */}
            <Route element={<ProtectedRoute requiredRoles={['SUPER_ADMIN', 'DISTRIBUIDOR']} />}>
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