import { Grid, Paper } from '@mantine/core';
import {
  IconCurrencyDollar,
  IconArrowUpRight,
  IconArrowDownRight,
  IconChartLine,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: 'Ene', ingreso: 4000 },
  { name: 'Feb', ingreso: 3000 },
  { name: 'Mar', ingreso: 5000 },
  { name: 'Abr', ingreso: 4500 },
  { name: 'May', ingreso: 6000 },
  { name: 'Jun', ingreso: 5500 },
  { name: 'Jul', ingreso: 7000 },
  { name: 'Ago', ingreso: 6500 },
  { name: 'Sep', ingreso: 8000 },
  { name: 'Oct', ingreso: 7500 },
  { name: 'Nov', ingreso: 8500 },
  { name: 'Dic', ingreso: 9000 },
];

export default function Dashboard() {
  const stats = [
    {
      title: 'Ingresos Totales',
      ingreso: '$75,432',
      increase: '+20.1%',
      icon: IconCurrencyDollar,
      color: 'blue',
    },
    {
      title: 'Ventas Mensuales',
      ingreso: '$12,345',
      increase: '+5.7%',
      icon: IconChartLine,
      color: 'blue',
    },
    {
      title: 'Ventas Anuales',
      ingreso: '$150,780',
      increase: '+10.2%',
      icon: IconCurrencyDollar,
      color: 'blue',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700">{`${label}: $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 bg-white p-6">
      <Grid>
        {stats.map((stat) => (
          <Grid.Col key={stat.title} span={4}>
            <Paper className="bg-white border border-gray-200" shadow="sm" p="md" radius="md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.ingreso}</h3>
                  <div className="flex items-center mt-2">
                    {parseFloat(stat.increase) > 0 ? (
                      <IconArrowUpRight size={20} className="text-blue-600" />
                    ) : (
                      <IconArrowDownRight size={20} className="text-blue-600" />
                    )}
                    <span className="text-blue-600 text-sm ml-1">
                      {stat.increase}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <stat.icon size={24} className="text-blue-600" />
                </div>
              </div>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Paper className="bg-white border border-gray-200" shadow="sm" p="md" radius="md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumen de Ventas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
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
            <Line
              type="monotone"
              dataKey="ingreso"
              stroke="#2563EB"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
}