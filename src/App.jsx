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
import ProtectedRoute from './components/ProtectedRoute'; // Ajusta si usas otro auth
import Login from './pages/Login';                       // Ajusta rutas
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ClientsPage from './pages/ClientsPage';
import SalesPage from './pages/SalesPage';
import PipelinePage from './pages/PipelinePage';
import UsersPage from './pages/UsersPage';

// Tareas
import TaskManagement from './components/tasks/TaskManagement';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <BrowserRouter basename="/crm">
          <Routes>
            {/* Página de Login */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas (ajusta según tu auth) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientsPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/tasks" element={<TaskManagement />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}
