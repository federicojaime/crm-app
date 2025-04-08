// src/pages/statistics/AgentsPage.jsx
import React, { useState } from 'react';
import { Paper, Title, Select, Text, Group, Button, TextInput } from '@mantine/core';
import { IconFilter, IconChevronDown, IconCalendar, IconDownload, IconRefresh, IconSearch } from '@tabler/icons-react';
import {
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

const AgentsPage = () => {
  const [yearFilter, setYearFilter] = useState('2025');
  const [monthFilter, setMonthFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceView, setPerformanceView] = useState('volume'); // 'volume' o 'conversion'

  // Lista de agentes/vendedores para las estadísticas
  const agentsData = [
    { 
      id: 1, 
      name: 'Isabel Jauregui', 
      leads: 156, 
      appointments: 27, 
      demos: 23, 
      sales: 10, 
      salesVolume: 4035000, 
      conversionRate: 43.5,
      postSaleAppointments: 21,
      postSaleDemos: 16,
      postSaleSales: 8
    },
    { 
      id: 2, 
      name: 'Rodrigo González', 
      leads: 220, 
      appointments: 55, 
      demos: 18, 
      sales: 9, 
      salesVolume: 3629700, 
      conversionRate: 50.0,
      postSaleAppointments: 20,
      postSaleDemos: 14,
      postSaleSales: 7
    },
    { 
      id: 3, 
      name: 'Vanesa Álvarez', 
      leads: 119, 
      appointments: 29, 
      demos: 15, 
      sales: 9, 
      salesVolume: 3269730, 
      conversionRate: 60.0,
      postSaleAppointments: 31,
      postSaleDemos: 20,
      postSaleSales: 6
    },
    { 
      id: 4, 
      name: 'Melisa Arias', 
      leads: 168, 
      appointments: 42, 
      demos: 30, 
      sales: 11, 
      salesVolume: 4434980, 
      conversionRate: 36.7,
      postSaleAppointments: 4,
      postSaleDemos: 2,
      postSaleSales: 3
    }
  ];

  // Filtrar agentes por término de búsqueda
  const filteredAgents = agentsData.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preparar datos para gráficos
  const salesVolumeChartData = filteredAgents.map(agent => ({
    name: agent.name,
    total: agent.salesVolume
  }));

  const conversionRateChartData = filteredAgents.map(agent => ({
    name: agent.name,
    rate: agent.conversionRate
  }));

  const funnelComparisonData = filteredAgents.map(agent => ({
    name: agent.name,
    leads: agent.leads,
    appointments: agent.appointments,
    demos: agent.demos,
    sales: agent.sales
  }));

  // Datos para gráfico de pastel de distribución de ventas
  const salesDistributionData = filteredAgents.map(agent => ({
    name: agent.name,
    value: agent.salesVolume
  }));

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83a6ed'];

  // Formateo de montos
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Cálculos de totales
  const totalSalesVolume = filteredAgents.reduce((sum, agent) => sum + agent.salesVolume, 0);
  const totalSalesCount = filteredAgents.reduce((sum, agent) => sum + agent.sales, 0);
  const averageConversionRate = totalSalesCount > 0 
    ? filteredAgents.reduce((sum, agent) => sum + agent.conversionRate, 0) / filteredAgents.length
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title order={2}>Desempeño de Agentes</Title>
        <Group>
          <Button leftIcon={<IconDownload size={16} />} variant="outline">
            Exportar Datos
          </Button>
          <Button leftIcon={<IconRefresh size={16} />} variant="filled">
            Actualizar
          </Button>
        </Group>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Select
          label="AÑO"
          placeholder="Seleccionar año"
          value={yearFilter}
          onChange={setYearFilter}
          data={[
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
            { value: '2026', label: '2026' },
          ]}
          className="w-40"
          rightSection={<IconChevronDown size={14} />}
          icon={<IconCalendar size={14} />}
        />
        
        <Select
          label="Mes"
          placeholder="Seleccionar mes"
          value={monthFilter}
          onChange={setMonthFilter}
          data={[
            { value: 'all', label: 'Todos' },
            { value: '01', label: 'Enero' },
            { value: '02', label: 'Febrero' },
            { value: '03', label: 'Marzo' },
            { value: '04', label: 'Abril' },
            { value: '05', label: 'Mayo' },
            { value: '06', label: 'Junio' },
            { value: '07', label: 'Julio' },
            { value: '08', label: 'Agosto' },
            { value: '09', label: 'Septiembre' },
            { value: '10', label: 'Octubre' },
            { value: '11', label: 'Noviembre' },
            { value: '12', label: 'Diciembre' },
          ]}
          className="w-48"
          rightSection={<IconChevronDown size={14} />}
        />
        
        <TextInput
          label="Buscar agente"
          placeholder="Nombre del agente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          className="w-56"
          icon={<IconSearch size={14} />}
        />
      </div>

      {/* Resumen KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Paper p="md" radius="md" shadow="sm" className="bg-gray-50">
          <Text color="dimmed" size="sm">Total Ventas (Monto)</Text>
          <Title order={2} className="my-1">{formatCurrency(totalSalesVolume)}</Title>
          <Text color="dimmed" size="xs">Periodo seleccionado</Text>
        </Paper>
        
        <Paper p="md" radius="md" shadow="sm" className="bg-gray-50">
          <Text color="dimmed" size="sm">Total Ventas (Cantidad)</Text>
          <Title order={2} className="my-1">{totalSalesCount}</Title>
          <Text color="dimmed" size="xs">Periodo seleccionado</Text>
        </Paper>
        
        <Paper p="md" radius="md" shadow="sm" className="bg-gray-50">
          <Text color="dimmed" size="sm">Tasa de Conversión Promedio</Text>
          <Title order={2} className="my-1">{averageConversionRate.toFixed(1)}%</Title>
          <Text color="dimmed" size="xs">Demos a Ventas</Text>
        </Paper>
      </div>

      {/* Selector de vista de desempeño */}
      <div className="mb-8">
        <Title order={4} mb="sm">Vista de Desempeño</Title>
        <div className="flex gap-4">
          <Button 
            variant={performanceView === 'volume' ? "filled" : "outline"}
            onClick={() => setPerformanceView('volume')}
            className="flex-1"
          >
            Volumen de Ventas
          </Button>
          <Button 
            variant={performanceView === 'conversion' ? "filled" : "outline"}
            onClick={() => setPerformanceView('conversion')}
            className="flex-1"
          >
            Tasa de Conversión
          </Button>
        </div>
      </div>

      {/* Gráfico de desempeño */}
      <Paper p="xl" radius="md" shadow="sm" className="mb-8">
        <Title order={3} className="mb-4">
          {performanceView === 'volume' 
            ? 'Volumen de Ventas por Agente' 
            : 'Tasa de Conversión por Agente'}
        </Title>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {performanceView === 'volume' ? (
              <BarChart
                data={salesVolumeChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => value >= 1000000 
                    ? `${(value / 1000000).toFixed(1)}M` 
                    : `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="total" fill="#3b82f6" name="Volumen de Ventas" />
              </BarChart>
            ) : (
              <BarChart
                data={conversionRateChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill="#10b981" name="Tasa de Conversión" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Paper>

      {/* Tabla de Desempeño Detallado */}
      <Paper p="xl" radius="md" shadow="sm" className="mb-8 overflow-hidden">
        <Title order={3} className="mb-4">Desempeño Detallado</Title>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Conversión</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{agent.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{agent.leads}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{agent.appointments}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{agent.demos}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{agent.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(agent.salesVolume)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{agent.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
            {/* Totales al final */}
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium">TOTAL</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{filteredAgents.reduce((sum, agent) => sum + agent.leads, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{filteredAgents.reduce((sum, agent) => sum + agent.appointments, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{filteredAgents.reduce((sum, agent) => sum + agent.demos, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{totalSalesCount}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(totalSalesVolume)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{averageConversionRate.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Paper>

      {/* Gráficos Adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comparación de embudo */}
        <Paper p="xl" radius="md" shadow="sm">
          <Title order={3} className="mb-4">Comparativa de Funnel</Title>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" name="Datos" fill="#93c5fd" />
                <Bar dataKey="appointments" name="Citas" fill="#60a5fa" />
                <Bar dataKey="demos" name="Demos" fill="#3b82f6" />
                <Bar dataKey="sales" name="Ventas" fill="#1d4ed8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Paper>

        {/* Distribución de ventas */}
        <Paper p="xl" radius="md" shadow="sm">
          <Title order={3} className="mb-4">Distribución de Ventas</Title>
          
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </div>

      {/* Sección de Ventas PostVenta */}
      <Paper p="xl" radius="md" shadow="sm" className="mt-8">
        <Title order={3} className="mb-4">Desempeño en PostVenta</Title>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citas PV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demos PV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas PV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Conv. Citas→Demos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Conv. Demos→Ventas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => {
                const citaToDemoRate = agent.postSaleAppointments > 0 
                  ? (agent.postSaleDemos / agent.postSaleAppointments * 100).toFixed(1) 
                  : '0.0';
                const demoToVentaRate = agent.postSaleDemos > 0 
                  ? (agent.postSaleSales / agent.postSaleDemos * 100).toFixed(1) 
                  : '0.0';
                
                return (
                  <tr key={`pv-${agent.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.postSaleAppointments}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.postSaleDemos}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.postSaleSales}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{citaToDemoRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{demoToVentaRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
};

export default AgentsPage;