// src/components/dashboard/StatisticsPanel.jsx
import React, { useState } from 'react';
import { Paper, Tabs, Select } from '@mantine/core';
import {
  IconChartBar,
  IconUser,
  IconUsers,
  IconFilter,
  IconTrendingUp
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const StatisticsPanel = () => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [agentFilter, setAgentFilter] = useState('all');

  // Datos de ejemplo para las gráficas
  const performanceData = [
    { name: 'Ene', ventas: 4000, meta: 5000 },
    { name: 'Feb', ventas: 3000, meta: 5000 },
    { name: 'Mar', ventas: 5000, meta: 5000 },
    { name: 'Abr', ventas: 5500, meta: 5000 },
    { name: 'May', ventas: 6000, meta: 6000 },
    { name: 'Jun', ventas: 7000, meta: 6000 },
    { name: 'Jul', ventas: 7500, meta: 6000 },
    { name: 'Ago', ventas: 8000, meta: 7000 },
    { name: 'Sep', ventas: 9000, meta: 7000 },
    { name: 'Oct', ventas: 8500, meta: 7000 },
    { name: 'Nov', ventas: 10000, meta: 8000 },
    { name: 'Dic', ventas: 12000, meta: 8000 },
  ];

  const funnelData = [
    { name: 'Nuevos Contactos', value: 1200 },
    { name: 'Contactados', value: 850 },
    { name: 'Interesados', value: 590 },
    { name: 'Demostración', value: 320 },
    { name: 'Negociación', value: 180 },
    { name: 'Ventas Cerradas', value: 105 },
  ];

  const conversionData = [
    { name: 'Contactados → Interesados', ratio: 69, count: 590 },
    { name: 'Interesados → Demostración', ratio: 54, count: 320 },
    { name: 'Demostración → Negociación', ratio: 56, count: 180 },
    { name: 'Negociación → Venta', ratio: 58, count: 105 },
  ];

  const agentsData = [
    { name: 'Juan Pérez', ventas: 32, monto: 4800000, conversion: 8.5 },
    { name: 'María López', ventas: 28, monto: 4200000, conversion: 7.2 },
    { name: 'Carlos García', ventas: 26, monto: 3900000, conversion: 6.4 },
    { name: 'Laura Sánchez', ventas: 21, monto: 3150000, conversion: 6.9 },
    { name: 'Pedro Martínez', ventas: 18, monto: 2700000, conversion: 5.8 },
  ];

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83a6ed'];

  // Formatear montos para mostrar
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Tooltip personalizado para PieChart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
          {payload[0].payload.ratio && (
            <p className="text-sm text-gray-600">{`Tasa de conversión: ${payload[0].payload.ratio}%`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Paper shadow="sm" p="md" radius="md" className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Estadísticas</h2>
        <div className="flex gap-3">
          <Select
            placeholder="Periodo"
            value={periodFilter}
            onChange={setPeriodFilter}
            data={[
              { value: 'weekly', label: 'Semanal' },
              { value: 'monthly', label: 'Mensual' },
              { value: 'quarterly', label: 'Trimestral' },
              { value: 'yearly', label: 'Anual' },
            ]}
            size="xs"
            icon={<IconFilter size={14} />}
          />
          <Select
            placeholder="Agente"
            value={agentFilter}
            onChange={setAgentFilter}
            data={[
              { value: 'all', label: 'Todos los agentes' },
              ...agentsData.map(agent => ({ value: agent.name, label: agent.name }))
            ]}
            size="xs"
            icon={<IconUser size={14} />}
          />
        </div>
      </div>

      <Tabs defaultValue="performance">
        <Tabs.List>
          <Tabs.Tab value="performance" leftSection={<IconTrendingUp size={14} />}>
            Desempeño
          </Tabs.Tab>
          <Tabs.Tab value="funnel" leftSection={<IconChartBar size={14} />}>
            Embudo de Ventas
          </Tabs.Tab>
          <Tabs.Tab value="conversion" leftSection={<IconChartBar size={14} />}>
            Preconversión
          </Tabs.Tab>
          <Tabs.Tab value="agents" leftSection={<IconUsers size={14} />}>
            Agentes
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="performance" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Desempeño de Ventas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  name="Ventas Reales" 
                  stroke="#2563EB" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  name="Meta de Ventas" 
                  stroke="#DC2626" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="funnel" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Embudo de Ventas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" name="Contactos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={funnelData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="conversion" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Tasas de Preconversión</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ratio" name="Tasa de Conversión %" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="agents" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Desempeño de Agentes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ventas Totales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasa de Conversión (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agentsData.map((agent, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {agent.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.ventas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(agent.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.conversion}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#0284c7" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="ventas" name="Ventas Totales" fill="#0284c7" />
                  <Bar yAxisId="right" dataKey="conversion" name="Tasa de Conversión (%)" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default StatisticsPanel;