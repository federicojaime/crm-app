import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ClientsPage from './pages/ClientsPage';
import SalesPage from './pages/SalesPage';
import PipelinePage from './pages/PipelinePage';
import UsersPage from './pages/UsersPage';
import 'tailwindcss/tailwind.css';
import TaskManagement from './components/tasks/TaskManagement';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <BrowserRouter basename="/crm">
          <Routes>
            <Route path="/login" element={<Login />} />
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