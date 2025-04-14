// src/components/dashboard/StatisticsPanel.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Tabs, Select, Group, Text, Badge } from '@mantine/core';
import {
  IconChartBar,
  IconUser,
  IconUsers,
  IconFilter,
  IconTrendingUp,
  IconCoin,
  IconPercentage,
  IconFileInvoice,
  IconCalendar
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
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const StatisticsPanel = ({ datos = [] }) => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [agentFilter, setAgentFilter] = useState('all');
  const [comparacionFilter, setComparacionFilter] = useState('ingresoTotal');
  const [tablaOrden, setTablaOrden] = useState('ventas');
  const [tablaDesc, setTablaDesc] = useState(true);

  // Preparar datos para las gráficas según los datos recibidos
  const [datosProcesados, setDatosProcesados] = useState({
    performance: [],
    comparacion: [],
    tendencia: [],
    agentes: []
  });

  // Función para formatear montos a moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar datos cuando cambian
  useEffect(() => {
    if (!datos || datos.length === 0) return;

    // Datos de rendimiento (Ingresos vs Comisiones)
    const performanceData = [...datos].sort((a, b) => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months.indexOf(a.name) - months.indexOf(b.name);
    }).map(item => ({
      name: item.name,
      ingresoTotal: item.ingresoTotal,
      comisionesPagadas: item.comisionesPagadas,
      ingresoNeto: item.ingresoNeto,
      reserva: item.reserva,
      eficiencia: Math.round((item.ingresoNeto / item.ingresoTotal) * 100)
    }));

    // Datos de comparación entre métricas
    const comparacionData = [
      { name: 'Ingresos Totales', valor: datos.reduce((sum, item) => sum + item.ingresoTotal, 0) },
      { name: 'Comisiones Pagadas', valor: datos.reduce((sum, item) => sum + item.comisionesPagadas, 0) },
      { name: 'Ingreso Neto', valor: datos.reduce((sum, item) => sum + item.ingresoNeto, 0) },
      { name: 'Reserva', valor: datos.reduce((sum, item) => sum + item.reserva, 0) }
    ];

    // Datos de tendencia (evolución a lo largo del tiempo)
    const tendenciaData = datos.map(item => ({
      name: item.name,
      ordenesCargadas: item.ordenesCargadas,
      ingresoPromedio: Math.round(item.ingresoTotal / (item.ordenesCargadas || 1))
    }));

    // Datos simulados de agentes (generados a partir de los datos disponibles)
    const totalVentas = datos.reduce((sum, item) => sum + item.ordenesCargadas, 0);
    const totalIngresos = datos.reduce((sum, item) => sum + item.ingresoTotal, 0);
    
    const agentesData = [
      { 
        name: 'Ana Rodríguez', 
        ventas: Math.round(totalVentas * 0.28), 
        monto: Math.round(totalIngresos * 0.32),
        ingresoPromedio: Math.round((totalIngresos * 0.32) / (totalVentas * 0.28)),
        conversion: 8.7, 
        eficiencia: 82
      },
      { 
        name: 'Juan Pérez', 
        ventas: Math.round(totalVentas * 0.22), 
        monto: Math.round(totalIngresos * 0.25),
        ingresoPromedio: Math.round((totalIngresos * 0.25) / (totalVentas * 0.22)),
        conversion: 7.9, 
        eficiencia: 78
      },
      { 
        name: 'María López', 
        ventas: Math.round(totalVentas * 0.18), 
        monto: Math.round(totalIngresos * 0.16),
        ingresoPromedio: Math.round((totalIngresos * 0.16) / (totalVentas * 0.18)),
        conversion: 6.4, 
        eficiencia: 75
      },
      { 
        name: 'Carlos García', 
        ventas: Math.round(totalVentas * 0.17), 
        monto: Math.round(totalIngresos * 0.15),
        ingresoPromedio: Math.round((totalIngresos * 0.15) / (totalVentas * 0.17)),
        conversion: 6.2, 
        eficiencia: 73
      },
      { 
        name: 'Laura Martínez', 
        ventas: Math.round(totalVentas * 0.15), 
        monto: Math.round(totalIngresos * 0.12),
        ingresoPromedio: Math.round((totalIngresos * 0.12) / (totalVentas * 0.15)),
        conversion: 5.8, 
        eficiencia: 70
      }
    ];
    
    // Ordenar agentes según el criterio seleccionado
    const agentesOrdenados = [...agentesData].sort((a, b) => {
      const valorA = a[tablaOrden];
      const valorB = b[tablaOrden];
      return tablaDesc ? valorB - valorA : valorA - valorB;
    });

    setDatosProcesados({
      performance: performanceData,
      comparacion: comparacionData,
      tendencia: tendenciaData,
      agentes: agentesOrdenados
    });
  }, [datos, tablaOrden, tablaDesc]);

  // Colores para gráficos
  const COLORS = ['#2563EB', '#DC2626', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

  // Tooltip personalizado para PieChart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
          {payload[0].payload.ratio && (
            <p className="text-sm text-gray-600">{`Tasa de conversión: ${payload[0].payload.ratio}%`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Función para cambiar ordenamiento de la tabla
  const handleOrdenTabla = (campo) => {
    if (tablaOrden === campo) {
      setTablaDesc(!tablaDesc);
    } else {
      setTablaOrden(campo);
      setTablaDesc(true);
    }
  };

  // Renderizar un mensaje si no hay datos
  if (!datos || datos.length === 0) {
    return (
      <Paper shadow="sm" p="md" radius="md" className="mb-6">
        <div className="text-center py-10">
          <IconFilter size={48} className="mx-auto text-gray-400 mb-4" />
          <Text size="lg" color="dimmed">No hay datos disponibles para el período seleccionado</Text>
          <Text size="sm" color="dimmed" mt={2}>Ajusta los filtros para ver estadísticas</Text>
        </div>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="md" radius="md" className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Group>
          <h2 className="text-xl font-bold">Estadísticas de Rendimiento</h2>
          <Badge color={periodFilter === 'yearly' ? 'blue' : 'green'} size="lg">
            {periodFilter === 'weekly' ? 'Semanal' : 
             periodFilter === 'monthly' ? 'Mensual' : 
             periodFilter === 'quarterly' ? 'Trimestral' : 'Anual'}
          </Badge>
        </Group>
        
        <div className="flex gap-3">
          <Select
            placeholder="Período"
            value={periodFilter}
            onChange={setPeriodFilter}
            data={[
              { value: 'weekly', label: 'Semanal' },
              { value: 'monthly', label: 'Mensual' },
              { value: 'quarterly', label: 'Trimestral' },
              { value: 'yearly', label: 'Anual' },
            ]}
            size="xs"
            icon={<IconCalendar size={14} />}
          />
          <Select
            placeholder="Métrica para comparar"
            value={comparacionFilter}
            onChange={setComparacionFilter}
            data={[
              { value: 'ingresoTotal', label: 'Ingreso Total' },
              { value: 'ingresoNeto', label: 'Ingreso Neto' },
              { value: 'comisionesPagadas', label: 'Comisiones' },
              { value: 'eficiencia', label: 'Eficiencia' },
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
              ...datosProcesados.agentes.map(agent => ({ value: agent.name, label: agent.name }))
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
          <Tabs.Tab value="distribucion" leftSection={<IconPercentage size={14} />}>
            Distribución
          </Tabs.Tab>
          <Tabs.Tab value="tendencias" leftSection={<IconChartBar size={14} />}>
            Tendencias
          </Tabs.Tab>
          <Tabs.Tab value="agents" leftSection={<IconUsers size={14} />}>
            Agentes
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="performance" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Desempeño Financiero</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosProcesados.performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ingresoTotal" 
                  name="Ingresos Totales" 
                  stroke="#2563EB" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="comisionesPagadas" 
                  name="Comisiones" 
                  stroke="#DC2626" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="ingresoNeto" 
                  name="Ingreso Neto" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="reserva" 
                  name="Reserva" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Eficiencia Mensual</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={datosProcesados.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Area 
                    type="monotone" 
                    dataKey="eficiencia" 
                    name="Eficiencia (Ingreso Neto/Total)" 
                    stroke="#F59E0B" 
                    fill="#FEF3C7" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="distribucion" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Distribución de Ingresos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosProcesados.comparacion}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="valor"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {datosProcesados.comparacion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={datosProcesados.comparacion}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="valor" fill="#3B82F6" name="Monto">
                      {datosProcesados.comparacion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Análisis por Mes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosProcesados.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value, name) => {
                    return name === "eficiencia" ? `${value}%` : formatCurrency(value);
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey={comparacionFilter} stackId="a" name={
                    comparacionFilter === 'ingresoTotal' ? 'Ingreso Total' :
                    comparacionFilter === 'ingresoNeto' ? 'Ingreso Neto' :
                    comparacionFilter === 'comisionesPagadas' ? 'Comisiones' : 'Eficiencia'
                  } fill="#2563EB" />
                  <Bar yAxisId="right" dataKey="eficiencia" name="Eficiencia (%)" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="tendencias" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Análisis de Tendencias</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-medium mb-2 text-center">Evolución de Órdenes</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={datosProcesados.tendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="ordenesCargadas"
                      name="Órdenes" 
                      stroke="#8B5CF6" 
                      fill="#EDE9FE" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-md font-medium mb-2 text-center">Ingreso Promedio por Orden</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={datosProcesados.tendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="ingresoPromedio" name="Ingreso Promedio" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Métricas Principales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={datosProcesados.performance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar name="Ingresos Totales" dataKey="ingresoTotal" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.6} />
                  <Radar name="Ingreso Neto" dataKey="ingresoNeto" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="agents" pt="xs">
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Desempeño de Agentes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleOrdenTabla('name')}
                    >
                      Agente {tablaOrden === 'name' && (tablaDesc ? '▼' : '▲')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleOrdenTabla('ventas')}
                    >
                      Órdenes {tablaOrden === 'ventas' && (tablaDesc ? '▼' : '▲')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleOrdenTabla('monto')}
                    >
                      Monto Total {tablaOrden === 'monto' && (tablaDesc ? '▼' : '▲')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleOrdenTabla('ingresoPromedio')}
                    >
                      Prom. por Orden {tablaOrden === 'ingresoPromedio' && (tablaDesc ? '▼' : '▲')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleOrdenTabla('eficiencia')}
                    >
                      Eficiencia (%) {tablaOrden === 'eficiencia' && (tablaDesc ? '▼' : '▲')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datosProcesados.agentes.map((agent, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.ventas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(agent.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(agent.ingresoPromedio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${agent.eficiencia >= 80 ? 'bg-green-100 text-green-800' : 
                            agent.eficiencia >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {agent.eficiencia}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                agent.eficiencia >= 80 ? 'bg-green-500' : 
                                agent.eficiencia >= 70 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${agent.eficiencia}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Comparativa de Agentes</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosProcesados.agentes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip formatter={(value, name) => {
                    if (name === "eficiencia") return `${value}%`;
                    if (name === "ventas") return value;
                    return formatCurrency(value);
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="monto" name="Monto Total" fill="#2563EB" />
                  <Bar yAxisId="left" dataKey="ingresoPromedio" name="Ingreso Promedio" fill="#10B981" />
                  <Bar yAxisId="right" dataKey="eficiencia" name="Eficiencia (%)" fill="#F59E0B" />
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