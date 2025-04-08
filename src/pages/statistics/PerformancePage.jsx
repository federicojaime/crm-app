// src/pages/statistics/PerformancePage.jsx
import React, { useState } from 'react';
import { Paper, Title, Select, Grid, Text } from '@mantine/core';
import { IconFilter, IconChevronDown, IconCalendar } from '@tabler/icons-react';
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
  ResponsiveContainer
} from 'recharts';

const PerformancePage = () => {
  const [yearFilter, setYearFilter] = useState('2025');
  const [monthFilter, setMonthFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [distributionFilter, setDistributionFilter] = useState('');

  // Datos de ejemplo
  const performanceData = [
    { name: 'Ene', ventas: 9, meta: 12 },
    { name: 'Feb', ventas: 11, meta: 12 },
    { name: 'Mar', ventas: 13, meta: 12 },
    { name: 'Abr', ventas: 10, meta: 12 },
    { name: 'May', ventas: 14, meta: 15 },
    { name: 'Jun', ventas: 16, meta: 15 },
    { name: 'Jul', ventas: 15, meta: 15 },
    { name: 'Ago', ventas: 17, meta: 18 },
    { name: 'Sep', ventas: 19, meta: 18 },
    { name: 'Oct', ventas: 16, meta: 18 },
    { name: 'Nov', ventas: 20, meta: 20 },
    { name: 'Dic', ventas: 22, meta: 20 },
  ];

  // Datos de ejemplo para KPIs
  const kpiData = [
    { 
      title: "Citas vs Demos", 
      value: "3,1", 
      description: "¿Cuántas citas para 1 demo?",
      target: "VR: menor a 2"
    },
    { 
      title: "Datos vs Citas", 
      value: "4,0", 
      description: "¿Cuántos datos para 1 cita?",
      target: "VR: menor a 4"
    },
    { 
      title: "Datos vs Ventas", 
      value: "24,4", 
      description: "¿Cuántos datos para 1 Venta?",
      target: "VR: menor a 14"
    },
    { 
      title: "Demo vs Venta", 
      value: "2,0", 
      description: "¿Cuántas demos para 1 Venta?",
      target: "VR: menor a 2"
    }
  ];

  // Datos de postventa
  const postSaleKpiData = [
    { 
      title: "Cita vs Demo PV", 
      value: "1,4", 
      description: "Citas a demos postventa",
      target: "VR: menor a 1.5"
    },
    { 
      title: "Demo vs Venta PV", 
      value: "2,0", 
      description: "Demos a ventas postventa",
      target: "VR: menor a 2"
    }
  ];

  // Datos de cierre
  const closeRateData = {
    percentage: "50%",
    ticketValue: "403,18"
  };

  // Datos de cierre postventa
  const postSaleCloseRateData = {
    percentage: "50%"
  };

  // Formato para valores monetarios
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  const KPICard = ({ data, bgColor = "bg-yellow-400" }) => (
    <div className={`${bgColor} rounded-lg shadow p-6 text-center`}>
      <div className="text-4xl font-bold mb-2">{data.value}</div>
      <div className="text-sm mb-3">{data.title}</div>
      <div className="text-xs mb-1">{data.target}</div>
      <div className="text-xs">{data.description}</div>
    </div>
  );

  return (
    <div className="p-6">
      <Title order={2} className="mb-6">DESEMPEÑO VENTAS</Title>
      
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
        
        <Select
          label="Semana"
          placeholder="Seleccionar semana"
          value={weekFilter}
          onChange={setWeekFilter}
          data={[
            { value: 'all', label: 'Todas' },
            { value: '1', label: 'Semana 1' },
            { value: '2', label: 'Semana 2' },
            { value: '3', label: 'Semana 3' },
            { value: '4', label: 'Semana 4' },
            { value: '5', label: 'Semana 5' },
          ]}
          className="w-48"
          rightSection={<IconChevronDown size={14} />}
        />
        
        <Select
          label="Distribución"
          placeholder="Seleccionar distribución"
          value={distributionFilter}
          onChange={setDistributionFilter}
          data={[
            { value: 'all', label: 'Todos' },
            { value: 'dist1', label: 'Distribución 1' },
            { value: 'dist2', label: 'Distribución 2' },
            { value: 'dist3', label: 'Distribución 3' },
          ]}
          className="w-48"
          rightSection={<IconChevronDown size={14} />}
        />
      </div>

      {/* KPIs de Nuevos Clientes */}
      <Title order={3} className="mb-4">NUEVOS CLIENTES</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KPICard 
            key={index} 
            data={kpi} 
            bgColor={index % 2 === 0 ? "bg-yellow-400" : "bg-green-400"} 
          />
        ))}
      </div>

      {/* KPIs de Postventa */}
      <Title order={3} className="mb-4">POSTVENTA</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {postSaleKpiData.map((kpi, index) => (
          <KPICard 
            key={index} 
            data={kpi} 
            bgColor={index % 2 === 0 ? "bg-green-400" : "bg-green-400"} 
          />
        ))}
      </div>

      {/* Gráficos de Embudo y KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Paper p="lg" radius="md" shadow="sm">
          <div className="flex justify-between items-center mb-4">
            <Title order={3}>Funnel Nuevos Clientes</Title>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-700">% de cierre</div>
              <div className="text-3xl font-bold">{closeRateData.percentage}</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-gray-700 text-sm">Ticket de venta</div>
            <div className="text-3xl font-bold">{closeRateData.ticketValue}</div>
          </div>

          {/* Aquí iría el gráfico de embudo - Es una visualización específica que simularemos */}
          <div className="relative h-80 bg-blue-100 rounded-lg overflow-hidden">
            <div className="absolute top-0 w-full h-24 bg-blue-400 rounded-t-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">100% (220)</div>
                <div>Datos</div>
              </div>
            </div>
            <div className="absolute top-24 left-[10%] w-[80%] h-20 bg-blue-300 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">25% (55)</div>
                <div>Citas</div>
              </div>
            </div>
            <div className="absolute top-44 left-[20%] w-[60%] h-16 bg-pink-400 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">8% (18)</div>
                <div>Demos</div>
              </div>
            </div>
            <div className="absolute top-60 left-[30%] w-[40%] h-12 bg-yellow-400 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">4% (9)</div>
                <div>Ventas</div>
              </div>
            </div>
          </div>
        </Paper>

        <Paper p="lg" radius="md" shadow="sm">
          <div className="flex justify-between items-center mb-4">
            <Title order={3}>Funnel Postventa</Title>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-700">% cierre pv</div>
              <div className="text-3xl font-bold">{postSaleCloseRateData.percentage}</div>
            </div>
          </div>

          {/* Aquí iría el gráfico de embudo para postventa */}
          <div className="relative h-80 bg-blue-100 rounded-lg overflow-hidden">
            <div className="absolute top-0 w-full h-24 bg-blue-400 rounded-t-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">100% (20)</div>
                <div>Citas Postventa</div>
              </div>
            </div>
            <div className="absolute top-24 left-[15%] w-[70%] h-24 bg-blue-300 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">70% (14)</div>
                <div>Demos Postventa</div>
              </div>
            </div>
            <div className="absolute top-48 left-[30%] w-[40%] h-20 bg-pink-400 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold">35% (7)</div>
                <div>Venta postventa</div>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      {/* Tabla de rendimiento */}
      <Paper p="lg" radius="md" shadow="sm" className="mb-8">
        <Title order={3} className="mb-4">Rendimiento por Vendedor</Title>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre del vendedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citas Postv</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demos Postv</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venta postv</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Regalos 4</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">Isabel Jaur...</td>
                <td className="px-6 py-4 whitespace-nowrap bg-green-100">156</td>
                <td className="px-6 py-4 whitespace-nowrap">27</td>
                <td className="px-6 py-4 whitespace-nowrap">23</td>
                <td className="px-6 py-4 whitespace-nowrap">10</td>
                <td className="px-6 py-4 whitespace-nowrap">21</td>
                <td className="px-6 py-4 whitespace-nowrap">16</td>
                <td className="px-6 py-4 whitespace-nowrap">8</td>
                <td className="px-6 py-4 whitespace-nowrap">9</td>
              </tr>
              <tr className="bg-gray-50 hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">Rodrigo G...</td>
                <td className="px-6 py-4 whitespace-nowrap bg-green-100">220</td>
                <td className="px-6 py-4 whitespace-nowrap">55</td>
                <td className="px-6 py-4 whitespace-nowrap">18</td>
                <td className="px-6 py-4 whitespace-nowrap">9</td>
                <td className="px-6 py-4 whitespace-nowrap">20</td>
                <td className="px-6 py-4 whitespace-nowrap">14</td>
                <td className="px-6 py-4 whitespace-nowrap">7</td>
                <td className="px-6 py-4 whitespace-nowrap bg-red-100">0</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">Vanesa A...</td>
                <td className="px-6 py-4 whitespace-nowrap">119</td>
                <td className="px-6 py-4 whitespace-nowrap">29</td>
                <td className="px-6 py-4 whitespace-nowrap">15</td>
                <td className="px-6 py-4 whitespace-nowrap">9</td>
                <td className="px-6 py-4 whitespace-nowrap">31</td>
                <td className="px-6 py-4 whitespace-nowrap">20</td>
                <td className="px-6 py-4 whitespace-nowrap">6</td>
                <td className="px-6 py-4 whitespace-nowrap bg-red-100">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Paper>

      {/* Gráficos circulares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Paper p="lg" radius="md" shadow="sm">
          <Title order={3} className="mb-4">Distribución de Demos</Title>
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl font-bold">18</div>
                <div>Demos</div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default PerformancePage;