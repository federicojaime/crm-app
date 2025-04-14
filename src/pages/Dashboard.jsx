import { Grid, Paper, Select, Group } from '@mantine/core';
import {
  IconCurrencyDollar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChartLine,
  IconUserCheck,
  IconPercentage,
  IconPigMoney,
  IconReceiptTax
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useState, useEffect } from 'react';

// Importamos el componente de estadísticas
import StatisticsPanel from '../components/dashboard/StatisticsPanel';

// Datos de ejemplo para todos los meses
const allSalesData = {
  2023: [
    { name: 'Ene', ingresoTotal: 4000, comisionesPagadas: 800, ingresoNeto: 3200, reserva: 500, ordenesCargadas: 42 },
    { name: 'Feb', ingresoTotal: 3000, comisionesPagadas: 600, ingresoNeto: 2400, reserva: 400, ordenesCargadas: 36 },
    { name: 'Mar', ingresoTotal: 5000, comisionesPagadas: 1000, ingresoNeto: 4000, reserva: 600, ordenesCargadas: 58 },
    { name: 'Abr', ingresoTotal: 4500, comisionesPagadas: 900, ingresoNeto: 3600, reserva: 550, ordenesCargadas: 50 },
    { name: 'May', ingresoTotal: 6000, comisionesPagadas: 1200, ingresoNeto: 4800, reserva: 700, ordenesCargadas: 65 },
    { name: 'Jun', ingresoTotal: 5500, comisionesPagadas: 1100, ingresoNeto: 4400, reserva: 650, ordenesCargadas: 62 },
    { name: 'Jul', ingresoTotal: 7000, comisionesPagadas: 1400, ingresoNeto: 5600, reserva: 800, ordenesCargadas: 78 },
    { name: 'Ago', ingresoTotal: 6500, comisionesPagadas: 1300, ingresoNeto: 5200, reserva: 750, ordenesCargadas: 70 },
    { name: 'Sep', ingresoTotal: 8000, comisionesPagadas: 1600, ingresoNeto: 6400, reserva: 900, ordenesCargadas: 88 },
    { name: 'Oct', ingresoTotal: 7500, comisionesPagadas: 1500, ingresoNeto: 6000, reserva: 850, ordenesCargadas: 82 },
    { name: 'Nov', ingresoTotal: 8500, comisionesPagadas: 1700, ingresoNeto: 6800, reserva: 950, ordenesCargadas: 95 },
    { name: 'Dic', ingresoTotal: 9000, comisionesPagadas: 1800, ingresoNeto: 7200, reserva: 1000, ordenesCargadas: 100 },
  ],
  2024: [
    { name: 'Ene', ingresoTotal: 4200, comisionesPagadas: 840, ingresoNeto: 3360, reserva: 520, ordenesCargadas: 45 },
    { name: 'Feb', ingresoTotal: 3200, comisionesPagadas: 640, ingresoNeto: 2560, reserva: 420, ordenesCargadas: 38 },
    { name: 'Mar', ingresoTotal: 5300, comisionesPagadas: 1060, ingresoNeto: 4240, reserva: 630, ordenesCargadas: 60 },
    { name: 'Abr', ingresoTotal: 4800, comisionesPagadas: 960, ingresoNeto: 3840, reserva: 580, ordenesCargadas: 53 },
    { name: 'May', ingresoTotal: 6300, comisionesPagadas: 1260, ingresoNeto: 5040, reserva: 730, ordenesCargadas: 68 },
    { name: 'Jun', ingresoTotal: 5800, comisionesPagadas: 1160, ingresoNeto: 4640, reserva: 680, ordenesCargadas: 65 },
    { name: 'Jul', ingresoTotal: 7400, comisionesPagadas: 1480, ingresoNeto: 5920, reserva: 840, ordenesCargadas: 82 },
    { name: 'Ago', ingresoTotal: 6800, comisionesPagadas: 1360, ingresoNeto: 5440, reserva: 790, ordenesCargadas: 74 },
    { name: 'Sep', ingresoTotal: 8400, comisionesPagadas: 1680, ingresoNeto: 6720, reserva: 940, ordenesCargadas: 92 },
    { name: 'Oct', ingresoTotal: 7900, comisionesPagadas: 1580, ingresoNeto: 6320, reserva: 890, ordenesCargadas: 86 },
    { name: 'Nov', ingresoTotal: 8900, comisionesPagadas: 1780, ingresoNeto: 7120, reserva: 990, ordenesCargadas: 99 },
    { name: 'Dic', ingresoTotal: 9500, comisionesPagadas: 1900, ingresoNeto: 7600, reserva: 1050, ordenesCargadas: 105 },
  ],
  2025: [
    { name: 'Ene', ingresoTotal: 4400, comisionesPagadas: 880, ingresoNeto: 3520, reserva: 540, ordenesCargadas: 48 },
    { name: 'Feb', ingresoTotal: 3400, comisionesPagadas: 680, ingresoNeto: 2720, reserva: 440, ordenesCargadas: 40 },
    { name: 'Mar', ingresoTotal: 5600, comisionesPagadas: 1120, ingresoNeto: 4480, reserva: 660, ordenesCargadas: 62 },
    { name: 'Abr', ingresoTotal: 5100, comisionesPagadas: 1020, ingresoNeto: 4080, reserva: 610, ordenesCargadas: 56 },
  ],
};

// Obtener los años disponibles
const años = Object.keys(allSalesData);

export default function Dashboard() {
  // Estado para el filtro de año y mes
  const [añoSeleccionado, setAñoSeleccionado] = useState('2025');
  const [mesSeleccionado, setMesSeleccionado] = useState('Todo');
  const [datosAMostrar, setDatosAMostrar] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);

  // Lista de meses para el filtro
  const meses = [
    { value: 'Todo', label: 'Todo el año' },
    { value: 'Ene', label: 'Enero' },
    { value: 'Feb', label: 'Febrero' },
    { value: 'Mar', label: 'Marzo' },
    { value: 'Abr', label: 'Abril' },
    { value: 'May', label: 'Mayo' },
    { value: 'Jun', label: 'Junio' },
    { value: 'Jul', label: 'Julio' },
    { value: 'Ago', label: 'Agosto' },
    { value: 'Sep', label: 'Septiembre' },
    { value: 'Oct', label: 'Octubre' },
    { value: 'Nov', label: 'Noviembre' },
    { value: 'Dic', label: 'Diciembre' },
  ];

  // Actualizar los datos cuando cambia el filtro
  useEffect(() => {
    // Si se selecciona "Todo", mostrar todos los meses del año
    if (mesSeleccionado === 'Todo') {
      setDatosAMostrar(allSalesData[añoSeleccionado] || []);
      
      // Calcular totales para las estadísticas
      const datos = allSalesData[añoSeleccionado] || [];
      const totalIngresos = datos.reduce((sum, item) => sum + item.ingresoTotal, 0);
      const totalComisiones = datos.reduce((sum, item) => sum + item.comisionesPagadas, 0);
      const totalNeto = datos.reduce((sum, item) => sum + item.ingresoNeto, 0);
      const totalReserva = datos.reduce((sum, item) => sum + item.reserva, 0);
      const totalOrdenes = datos.reduce((sum, item) => sum + item.ordenesCargadas, 0);
      
      setEstadisticas([
        {
          title: 'Ingresos Totales',
          valor: `$${totalIngresos.toLocaleString()}`,
          increase: '+12.1%',
          icon: IconCurrencyDollar,
          color: 'blue',
        },
        {
          title: 'Comisiones Pagadas',
          valor: `$${totalComisiones.toLocaleString()}`,
          increase: '+10.5%',
          icon: IconReceiptTax,
          color: 'red',
        },
        {
          title: 'Ingreso Neto',
          valor: `$${totalNeto.toLocaleString()}`,
          increase: '+11.8%',
          icon: IconPigMoney,
          color: 'green',
        },
        {
          title: 'Reserva',
          valor: `$${totalReserva.toLocaleString()}`,
          increase: '+9.3%',
          icon: IconPercentage,
          color: 'purple',
        },
        {
          title: 'N° Órdenes Cargadas',
          valor: totalOrdenes.toString(),
          increase: '+15.2%',
          icon: IconUserCheck,
          color: 'orange',
        },
      ]);
    } else {
      // Filtrar solo el mes seleccionado
      const datosFiltrados = (allSalesData[añoSeleccionado] || []).filter(item => item.name === mesSeleccionado);
      setDatosAMostrar(datosFiltrados);
      
      // Actualizar estadísticas con los datos del mes
      if (datosFiltrados.length > 0) {
        const datoMes = datosFiltrados[0];
        
        setEstadisticas([
          {
            title: 'Ingresos Totales',
            valor: `$${datoMes.ingresoTotal.toLocaleString()}`,
            increase: '+12.1%',
            icon: IconCurrencyDollar,
            color: 'blue',
          },
          {
            title: 'Comisiones Pagadas',
            valor: `$${datoMes.comisionesPagadas.toLocaleString()}`,
            increase: '+10.5%',
            icon: IconReceiptTax,
            color: 'red',
          },
          {
            title: 'Ingreso Neto',
            valor: `$${datoMes.ingresoNeto.toLocaleString()}`,
            increase: '+11.8%',
            icon: IconPigMoney,
            color: 'green',
          },
          {
            title: 'Reserva',
            valor: `$${datoMes.reserva.toLocaleString()}`,
            increase: '+9.3%',
            icon: IconPercentage,
            color: 'purple',
          },
          {
            title: 'N° Órdenes Cargadas',
            valor: datoMes.ordenesCargadas.toString(),
            increase: '+15.2%',
            icon: IconUserCheck,
            color: 'orange',
          },
        ]);
      }
    }
  }, [añoSeleccionado, mesSeleccionado]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Group position="right" spacing="md">
        <Select
          label="Año"
          value={añoSeleccionado}
          onChange={setAñoSeleccionado}
          data={años}
          className="w-24"
        />
        <Select
          label="Mes"
          value={mesSeleccionado}
          onChange={setMesSeleccionado}
          data={meses}
          className="w-36"
        />
      </Group>

      {/* Tarjetas de estadísticas */}
      <Grid>
        {estadisticas.map((stat) => (
          <Grid.Col key={stat.title} span={12 / estadisticas.length}>
            <Paper className="bg-white border border-gray-200" shadow="sm" p="md" radius="md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.valor}</h3>
                  <div className="flex items-center mt-2">
                    {stat.decreasing ? (
                      <IconArrowDownRight size={20} className="text-red-600" />
                    ) : (
                      <IconArrowUpRight size={20} className={`text-${stat.color}-600`} />
                    )}
                    <span className={`text-${stat.decreasing ? 'red' : stat.color}-600 text-sm ml-1`}>
                      {stat.increase}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      {/* Panel de estadísticas */}
      <StatisticsPanel datos={datosAMostrar} />

      {/* Gráfico principal */}
      <Paper className="bg-white border border-gray-200" shadow="sm" p="md" radius="md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumen Financiero</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={datosAMostrar}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="ingresoTotal"
              name="Ingreso Total"
              stroke="#2563EB"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="comisionesPagadas"
              name="Comisiones Pagadas"
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
      </Paper>

      {/* Gráfico de órdenes cargadas */}
      <Paper className="bg-white border border-gray-200" shadow="sm" p="md" radius="md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Órdenes Cargadas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosAMostrar}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ordenesCargadas"
              name="N° Órdenes Cargadas"
              stroke="#F59E0B"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
}