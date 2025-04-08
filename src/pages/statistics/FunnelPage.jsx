import React, { useState } from 'react';
import { Paper, Title, Select, Text, Group, Button } from '@mantine/core';
import {
    IconChevronDown,
    IconCalendar,
    IconDownload,
    IconRefresh,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Importamos los componentes personalizados
import SalesFunnel from '../../components/statistics/SalesFunnel';
import KpiCard from '../../components/statistics/KpiCard';

const FunnelPage = () => {
    // Estados para filtros y tipo de embudo
    const [yearFilter, setYearFilter] = useState('2025');
    const [monthFilter, setMonthFilter] = useState('');
    const [weekFilter, setWeekFilter] = useState('');
    const [vendorFilter, setVendorFilter] = useState('');
    const [funnelType, setFunnelType] = useState('nuevos');

    // Datos KPIs para Nuevos Clientes
    const newClientsKpis = [
        {
            title: 'Citas vs Demos',
            value: '1,6',
            description: '¿Cuántas citas para 1 demo?',
            target: 'VR: menor a 2',
            color: 'bg-green-400',
        },
        {
            title: 'Datos vs Citas',
            value: '4,5',
            description: '¿Cuántos datos para 1 cita?',
            target: 'VR: menor a 4',
            color: 'bg-yellow-400',
        },
        {
            title: 'Datos vs Ventas',
            value: '13,9',
            description: '¿Cuántos datos para 1 Venta?',
            target: 'VR: menor a 14',
            color: 'bg-green-400',
        },
        {
            title: 'Demo vs Venta',
            value: '1,9',
            description: '¿Cuántas demos para 1 Venta?',
            target: 'VR: menor a 2',
            color: 'bg-green-400',
        },
    ];

    // Datos KPIs para Postventa
    const postSaleKpis = [
        {
            title: 'Cita vs Demo PV',
            value: '1,3',
            description: 'Citas a demos postventa',
            target: 'VR: menor a 1.5',
            color: 'bg-green-400',
        },
        {
            title: 'Demo vs Venta PV',
            value: '2,1',
            description: 'Demos a ventas postventa',
            target: 'VR: menor a 2',
            color: 'bg-yellow-400',
        },
    ];

    // Datos del embudo para Nuevos Clientes
    const newClientsFunnelData = {
        totalLeads: 530,
        leads_label: 'Datos',
        meetings: 117,
        meetings_label: 'Citas',
        demos: 74,
        demos_label: 'Demos',
        sales: 38,
        sales_label: 'Ventas',
        closeRate: 51,
        avgTicket: 518.46,
    };

    // Datos del embudo para Postventa
    const postSaleFunnelData = {
        totalLeads: 75,
        leads_label: 'Citas Postventa',
        meetings: 58,
        meetings_label: 'Demos Postventa',
        sales: 28,
        sales_label: 'Venta postventa',
        closeRate: 48,
    };

    // Lista de vendedores para el filtro
    const vendorsData = [
        { value: 'all', label: 'Todos los vendedores' },
        { value: '1', label: 'Isabel Jauregui' },
        { value: '2', label: 'Eloy Giordano' },
        { value: '3', label: 'Melisa Arias' },
        { value: '4', label: 'Emilie Delgado' },
        { value: '5', label: 'Juan Benzi' },
        { value: '6', label: 'Juan Cruz' },
    ];

    return (
        <div className="p-6">
            {/* Cabecera de la página */}
            <div className="flex justify-between items-center mb-6">
                <Title order={2}>Embudo de Ventas</Title>
                <Group>
                    <Button leftSection={<IconDownload size={16} />} variant="outline">
                        Exportar Datos
                    </Button>
                    <Button leftSection={<IconRefresh size={16} />} variant="filled">
                        Actualizar
                    </Button>
                </Group>
            </div>

            {/* Filtros superiores */}
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
                    ]}
                    className="w-48"
                    rightSection={<IconChevronDown size={14} />}
                />
                <Select
                    label="Vendedor"
                    placeholder="Seleccionar vendedor"
                    value={vendorFilter}
                    onChange={setVendorFilter}
                    data={vendorsData}
                    className="w-56"
                    rightSection={<IconChevronDown size={14} />}
                />
            </div>

            {/* Sección de KPIs */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Title order={3} className="mb-4 uppercase">
                        {funnelType === 'nuevos' ? 'NUEVOS CLIENTES' : 'POSTVENTA'}
                    </Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {(funnelType === 'nuevos' ? newClientsKpis : postSaleKpis).map((kpi, index) => (
                            <KpiCard
                                key={index}
                                title={kpi.title}
                                value={kpi.value}
                                target={kpi.target}
                                description={kpi.description}
                                color={kpi.color}
                                animate={true}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Botones para cambiar el tipo de embudo */}
            <div className="mb-8">
                <div className="flex gap-4">
                    <Button
                        variant={funnelType === 'nuevos' ? 'filled' : 'outline'}
                        onClick={() => setFunnelType('nuevos')}
                        className="flex-1"
                    >
                        Nuevos Clientes
                    </Button>
                    <Button
                        variant={funnelType === 'postventa' ? 'filled' : 'outline'}
                        onClick={() => setFunnelType('postventa')}
                        className="flex-1"
                    >
                        Postventa
                    </Button>
                </div>
            </div>

            {/* Sección del embudo (gráfico + tabla) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Componente del embudo */}
                <SalesFunnel
                    type={funnelType}
                    data={funnelType === 'nuevos' ? newClientsFunnelData : postSaleFunnelData}
                />

                {/* Tabla de detalle del embudo */}
                <Paper p="xl" radius="md" shadow="sm">
                    <Title order={3} className="mb-4">
                        Detalle del Embudo de {funnelType === 'nuevos' ? 'Nuevos Clientes' : 'Postventa'}
                    </Title>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vendedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {funnelType === 'nuevos' ? 'Datos' : 'Citas PV'}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {funnelType === 'nuevos' ? 'Citas' : 'Demos PV'}
                                    </th>
                                    {funnelType === 'nuevos' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Demos
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ventas
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Filas de ejemplo, repite según necesites */}
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">Isabel Jauregui</td>
                                    <td className="px-6 py-4 whitespace-nowrap bg-green-100">
                                        {funnelType === 'nuevos' ? '530' : '75'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">117</td>
                                    {funnelType === 'nuevos' && (
                                        <td className="px-6 py-4 whitespace-nowrap">74</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">38</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">Eloy Giordano</td>
                                    <td className="px-6 py-4 whitespace-nowrap">456</td>
                                    <td className="px-6 py-4 whitespace-nowrap">143</td>
                                    {funnelType === 'nuevos' && (
                                        <td className="px-6 py-4 whitespace-nowrap">103</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">83</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">Melisa Arias</td>
                                    <td className="px-6 py-4 whitespace-nowrap">339</td>
                                    <td className="px-6 py-4 whitespace-nowrap">90</td>
                                    {funnelType === 'nuevos' && (
                                        <td className="px-6 py-4 whitespace-nowrap">63</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">24</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Paper>
            </div>

            {/* Paneles adicionales (Gráficos y métricas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Paper p="xl" radius="md" shadow="sm">
                    <Title order={3} className="mb-4">Distribución de Demos</Title>
                    <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <div className="text-center">
                                <div className="text-4xl font-bold">
                                    {funnelType === 'nuevos' ? '74' : '58'}
                                </div>
                                <div>
                                    Demos {funnelType === 'postventa' ? 'Postventa' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>

                <Paper p="xl" radius="md" shadow="sm">
                    <Title order={3} className="mb-4">Métricas Clave</Title>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <Text size="sm" color="dimmed">
                                    % de cierre
                                </Text>
                                <Title order={3}>
                                    {funnelType === 'nuevos' ? '51%' : '48%'}
                                </Title>
                            </div>
                            <div>
                                <Text size="sm" color="dimmed">
                                    Total Demos
                                </Text>
                                <Title order={3}>
                                    {funnelType === 'nuevos' ? '74' : '58'}
                                </Title>
                            </div>
                        </div>
                        {funnelType === 'nuevos' && (
                            <div>
                                <Text size="sm" color="dimmed">Ticket de venta</Text>
                                <Title order={3}>$518.46</Title>
                            </div>
                        )}
                    </div>
                </Paper>
            </div>
        </div>
    );
};

export default FunnelPage;
