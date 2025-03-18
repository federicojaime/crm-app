// src/pages/SalesPage.jsx
import { useState } from 'react';
import {
    Grid,
    Paper,
    Button,
    Select,
    TextInput,
    NumberInput,
} from '@mantine/core';
import {
    IconPlus,
    IconChartBar,
    IconCurrencyDollar,
    IconUsers,
} from '@tabler/icons-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function SalesPage() {
    const [isAddingSale, setIsAddingSale] = useState(false);

    const salesData = [
        { month: 'Ene', Monto: 4000 },
        { month: 'Feb', Monto: 3000 },
        { month: 'Mar', Monto: 5000 },
        { month: 'Abr', Monto: 4500 },
        { month: 'May', Monto: 6000 },
        { month: 'Jun', Monto: 5500 },
        { month: 'Jul', Monto: 7000 },
        { month: 'Ago', Monto: 6500 },
        { month: 'Sep', Monto: 8000 },
        { month: 'Oct', Monto: 7500 },
        { month: 'Nov', Monto: 8500 },
        { month: 'Dic', Monto: 9000 },
    ];

    const stats = [
        {
            title: 'Ventas Totales',
            value: '$65,000',
            change: '+15.0%',
            icon: IconCurrencyDollar,
            color: 'green',
        },
        {
            title: 'Venta Promedio',
            value: '$5,416',
            change: '+4.5%',
            icon: IconChartBar,
            color: 'blue',
        },
        {
            title: 'Ventas Activas',
            value: '48',
            change: '+10.2%',
            icon: IconUsers,
            color: 'purple',
        },
        {
            title: 'Nuevos Clientes',
            value: '22',
            change: '+7.0%',
            icon: IconUsers,
            color: 'orange',
        },
        {
            title: 'Clientes Recurrentes',
            value: '26',
            change: '+5.5%',
            icon: IconUsers,
            color: 'teal',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Resumen de Ventas</h2>
                <Button
                    leftIcon={<IconPlus size={20} />}
                    onClick={() => setIsAddingSale(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Registrar Venta
                </Button>
            </div>

            <Grid>
                {stats.map((stat) => (
                    <Grid.Col key={stat.title} span={4}>
                        <Paper shadow="sm" p="md" radius="md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                    <span className={`text-${stat.color}-500 text-sm`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                                    <stat.icon
                                        size={24}
                                        className={`text-${stat.color}-500`}
                                    />
                                </div>
                            </div>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>

            <Grid>
                <Grid.Col span={8}>
                    <Paper shadow="sm" p="md" radius="md">
                        <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="Monto"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Paper shadow="sm" p="md" radius="md">
                        <h3 className="text-lg font-semibold mb-4">Venta Rápida</h3>
                        <form className="space-y-4">
                            <Select
                                label="Cliente"
                                placeholder="Seleccionar cliente"
                                data={[
                                    { value: '1', label: 'Juan Pérez' },
                                    { value: '2', label: 'María López' },
                                    { value: '3', label: 'Carlos García' },
                                    { value: '4', label: 'Ana Fernández' },
                                    { value: '5', label: 'Luis Martínez' },
                                ]}
                            />
                            <TextInput
                                label="Producto"
                                placeholder="Ingresar nombre del producto"
                            />
                            <NumberInput
                                label="Monto"
                                placeholder="Ingresar monto"
                                icon={<IconCurrencyDollar size={16} />}
                                precision={2}
                            />
                            <Button fullWidth>Registrar Venta</Button>
                        </form>
                    </Paper>
                </Grid.Col>
            </Grid>
        </div>
    );
}
