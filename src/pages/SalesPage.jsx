// src/pages/SalesPage.jsx
import { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Button,
    Select,
    TextInput,
    NumberInput,
    Modal,
    Tabs,
    Table,
    Group,
    Text,
    Badge,
    MultiSelect
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
    IconPlus,
    IconChartBar,
    IconCurrencyDollar,
    IconUsers,
    IconUserPlus,
    IconSearch,
    IconFilter,
    IconSortAscending,
    IconSortDescending,
    IconChecks
} from '@tabler/icons-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

// Componente de formulario para registrar ventas
const SaleForm = ({ isOpen, onClose, onSave, sellers, initialData = null }) => {
    const defaultFormData = {
        id: null,
        clientName: '',
        sellerId: '',
        productName: '',
        amount: 0,
        date: new Date(),
        paymentMethod: 'efectivo',
        status: 'completada',
        notes: ''
    };

    const [formData, setFormData] = useState(initialData || defaultFormData);

    useEffect(() => {
        setFormData(initialData || defaultFormData);
    }, [initialData, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Generate ID if new sale
        const saleData = {
            ...formData,
            id: formData.id || Date.now(),
            date: formData.date || new Date()
        };
        onSave(saleData);
        onClose();
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={initialData ? 'Editar Venta' : 'Registrar Nueva Venta'}
            size="lg"
        >
            <div className="space-y-4 p-2">
                <TextInput
                    label="Cliente"
                    placeholder="Nombre del cliente"
                    required
                    value={formData.clientName}
                    onChange={(e) => handleChange('clientName', e.currentTarget.value)}
                />

                <Select
                    label="Vendedor"
                    placeholder="Seleccionar vendedor"
                    required
                    data={sellers}
                    value={formData.sellerId}
                    onChange={(value) => handleChange('sellerId', value)}
                />

                <TextInput
                    label="Producto"
                    placeholder="Nombre del producto"
                    required
                    value={formData.productName}
                    onChange={(e) => handleChange('productName', e.currentTarget.value)}
                />

                <NumberInput
                    label="Monto"
                    placeholder="Monto de la venta"
                    required
                    min={0}
                    icon={<IconCurrencyDollar size={16} />}
                    precision={2}
                    value={formData.amount}
                    onChange={(value) => handleChange('amount', value)}
                />

                <DatePicker
                    label="Fecha"
                    placeholder="Fecha de la venta"
                    value={formData.date instanceof Date ? formData.date : new Date(formData.date)}
                    onChange={(value) => handleChange('date', value)}
                />

                <Select
                    label="Método de Pago"
                    placeholder="Seleccionar método"
                    data={[
                        { value: 'efectivo', label: 'Efectivo' },
                        { value: 'tarjeta', label: 'Tarjeta de Crédito' },
                        { value: 'transferencia', label: 'Transferencia Bancaria' },
                        { value: 'financiado', label: 'Financiado' },
                    ]}
                    value={formData.paymentMethod}
                    onChange={(value) => handleChange('paymentMethod', value)}
                />

                <Select
                    label="Estado"
                    placeholder="Estado de la venta"
                    data={[
                        { value: 'completada', label: 'Completada' },
                        { value: 'pendiente', label: 'Pendiente' },
                        { value: 'cancelada', label: 'Cancelada' },
                    ]}
                    value={formData.status}
                    onChange={(value) => handleChange('status', value)}
                />

                <TextInput
                    label="Notas"
                    placeholder="Notas adicionales"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.currentTarget.value)}
                />

                <Group position="right" mt="md">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </Group>
            </div>
        </Modal>
    );
};

export default function SalesPage() {
    const [isAddingSale, setIsAddingSale] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState([]);
    const [sellerFilter, setSellerFilter] = useState([]);

    // Obtener información del usuario actual
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.rol || 'EMPRENDEDOR');
        setCurrentUserId(user.id || '1'); // Default para pruebas
    }, []);

    // Datos de vendedores para pruebas
    const sellers = [
        { value: '1', label: 'Gimena González' },
        { value: '2', label: 'Juan Pérez' },
        { value: '3', label: 'María López' },
        { value: '4', label: 'Carlos Rodríguez' },
        { value: '5', label: 'Ana Fernández' },
    ];

    // Datos de venta de ejemplo
    const [sales, setSales] = useState([
        {
            id: 1,
            clientName: 'Roberto Sánchez',
            sellerId: '1',
            productName: 'Set de Cocina Premium',
            amount: 5500,
            date: new Date('2024-04-01'),
            paymentMethod: 'tarjeta',
            status: 'completada',
            notes: 'Cliente recurrente'
        },
        {
            id: 2,
            clientName: 'Laura Gómez',
            sellerId: '2',
            productName: 'Juego de Ollas Antiadherentes',
            amount: 3200,
            date: new Date('2024-04-03'),
            paymentMethod: 'efectivo',
            status: 'completada',
            notes: ''
        },
        {
            id: 3,
            clientName: 'Carlos Torres',
            sellerId: '3',
            productName: 'Sistema de Cocina Completo',
            amount: 8900,
            date: new Date('2024-04-05'),
            paymentMethod: 'financiado',
            status: 'pendiente',
            notes: 'Entrega programada para el 15/04'
        },
        {
            id: 4,
            clientName: 'Martín Gutiérrez',
            sellerId: '1',
            productName: 'Sartén Wok 32cm',
            amount: 1200,
            date: new Date('2024-04-07'),
            paymentMethod: 'transferencia',
            status: 'completada',
            notes: ''
        },
        {
            id: 5,
            clientName: 'Lucía Fernández',
            sellerId: '4',
            productName: 'Set de Utensilios de Cocina',
            amount: 1800,
            date: new Date('2024-04-08'),
            paymentMethod: 'tarjeta',
            status: 'completada',
            notes: ''
        },
        {
            id: 6,
            clientName: 'Diego López',
            sellerId: '2',
            productName: 'Ollas a Presión Deluxe',
            amount: 4500,
            date: new Date('2024-04-10'),
            paymentMethod: 'financiado',
            status: 'pendiente',
            notes: 'Primera cuota pagada'
        }
    ]);

    // Filtrar ventas según el rol del usuario
    const filteredSalesByRole = () => {
        if (userRole === 'EMPRENDEDOR') {
            // Emprendedores solo ven sus propias ventas
            return sales.filter(sale => sale.sellerId === currentUserId);
        } else {
            // Distribuidores y administradores ven todas las ventas
            return sales;
        }
    };

    // Aplicar filtros adicionales (búsqueda, estado, vendedor)
    const filteredSales = filteredSalesByRole().filter(sale => {
        // Filtro de búsqueda
        const searchMatch = 
            searchTerm === '' || 
            sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.productName.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro de estado
        const statusMatch = 
            statusFilter.length === 0 || 
            statusFilter.includes(sale.status);

        // Filtro de vendedor
        const sellerMatch = 
            sellerFilter.length === 0 || 
            sellerFilter.includes(sale.sellerId);

        return searchMatch && statusMatch && sellerMatch;
    });

    // Ordenar ventas
    const sortedSales = [...filteredSales].sort((a, b) => {
        if (sortField === 'date') {
            return sortDirection === 'asc' 
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortField === 'amount') {
            return sortDirection === 'asc'
                ? a.amount - b.amount
                : b.amount - a.amount;
        }
        return 0;
    });

    // Gestionar guardado de ventas (nuevas o editadas)
    const handleSaveSale = (saleData) => {
        if (selectedSale) {
            // Actualizar venta existente
            setSales(prev => prev.map(s => s.id === saleData.id ? saleData : s));
        } else {
            // Agregar nueva venta
            setSales(prev => [...prev, saleData]);
        }
    };

    // Stats para el panel superior
    const calculateStats = () => {
        const relevantSales = filteredSalesByRole().filter(s => s.status === 'completada');
        
        // Total ventas
        const totalSales = relevantSales.reduce((sum, sale) => sum + sale.amount, 0);
        
        // Ventas por vendedor
        const salesBySeller = {};
        relevantSales.forEach(sale => {
            if (!salesBySeller[sale.sellerId]) {
                salesBySeller[sale.sellerId] = 0;
            }
            salesBySeller[sale.sellerId] += sale.amount;
        });
        
        // Vendedor con más ventas
        let topSellerId = '';
        let topSellerAmount = 0;
        Object.entries(salesBySeller).forEach(([sellerId, amount]) => {
            if (amount > topSellerAmount) {
                topSellerId = sellerId;
                topSellerAmount = amount;
            }
        });
        
        const topSellerName = sellers.find(s => s.value === topSellerId)?.label || 'Desconocido';
        
        // Promedio de ventas
        const avgSale = relevantSales.length > 0 
            ? totalSales / relevantSales.length
            : 0;

        return {
            totalAmount: totalSales,
            totalCount: relevantSales.length,
            avgSale,
            topSeller: {
                name: topSellerName,
                amount: topSellerAmount
            }
        };
    };

    const stats = calculateStats();

    // Datos para gráficos
    const prepareSellerChartData = () => {
        const relevantSales = filteredSalesByRole();
        const salesBySeller = {};
        
        // Agrupar ventas por vendedor
        relevantSales.forEach(sale => {
            if (!salesBySeller[sale.sellerId]) {
                salesBySeller[sale.sellerId] = {
                    value: 0,
                    count: 0
                };
            }
            if (sale.status === 'completada') {
                salesBySeller[sale.sellerId].value += sale.amount;
                salesBySeller[sale.sellerId].count += 1;
            }
        });
        
        // Convertir a formato para gráfico
        return Object.entries(salesBySeller).map(([sellerId, data]) => {
            const sellerName = sellers.find(s => s.value === sellerId)?.label || `Vendedor ${sellerId}`;
            return {
                name: sellerName,
                value: data.value,
                count: data.count
            };
        }).sort((a, b) => b.value - a.value);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // Preparar datos de gráfico de métodos de pago
    const preparePaymentMethodsData = () => {
        const relevantSales = filteredSalesByRole().filter(s => s.status === 'completada');
        const paymentMethodData = {
            'efectivo': { name: 'Efectivo', value: 0 },
            'tarjeta': { name: 'Tarjeta', value: 0 },
            'transferencia': { name: 'Transferencia', value: 0 },
            'financiado': { name: 'Financiado', value: 0 }
        };
        
        relevantSales.forEach(sale => {
            if (paymentMethodData[sale.paymentMethod]) {
                paymentMethodData[sale.paymentMethod].value += sale.amount;
            }
        });
        
        return Object.values(paymentMethodData).filter(item => item.value > 0);
    };

    // Formatear fecha para mostrar
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-AR');
    };

    // Formatear monto para mostrar
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('es-AR', { 
            style: 'currency', 
            currency: 'ARS' 
        }).format(amount);
    };

    // Obtener nombre de vendedor
    const getSellerName = (sellerId) => {
        return sellers.find(seller => seller.value === sellerId)?.label || 'Desconocido';
    };

    // Obtener color según estado
    const getStatusColor = (status) => {
        const colors = {
            'completada': 'green',
            'pendiente': 'yellow',
            'cancelada': 'red'
        };
        return colors[status] || 'gray';
    };

    // Traducir método de pago
    const getPaymentMethodName = (method) => {
        const methods = {
            'efectivo': 'Efectivo',
            'tarjeta': 'Tarjeta de Crédito',
            'transferencia': 'Transferencia',
            'financiado': 'Financiado'
        };
        return methods[method] || method;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestión de Ventas</h2>
                <Button
                    leftIcon={<IconPlus size={20} />}
                    onClick={() => {
                        setSelectedSale(null);
                        setIsAddingSale(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Registrar Venta
                </Button>
            </div>

            {/* Stats Cards */}
            <Grid>
                <Grid.Col span={3}>
                    <Paper shadow="sm" p="md" radius="md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Ventas Totales</p>
                                <h3 className="text-2xl font-bold mt-1">{formatAmount(stats.totalAmount)}</h3>
                                <span className="text-green-500 text-sm">
                                    {stats.totalCount} ventas
                                </span>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100">
                                <IconCurrencyDollar size={24} className="text-blue-500" />
                            </div>
                        </div>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={3}>
                    <Paper shadow="sm" p="md" radius="md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Venta Promedio</p>
                                <h3 className="text-2xl font-bold mt-1">{formatAmount(stats.avgSale)}</h3>
                                <span className="text-blue-500 text-sm">
                                    Por transacción
                                </span>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                                <IconChartBar size={24} className="text-green-500" />
                            </div>
                        </div>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={3}>
                    <Paper shadow="sm" p="md" radius="md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Mejor Vendedor</p>
                                <h3 className="text-lg font-bold mt-1">{stats.topSeller.name}</h3>
                                <span className="text-purple-500 text-sm">
                                    {formatAmount(stats.topSeller.amount)}
                                </span>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100">
                                <IconUsers size={24} className="text-purple-500" />
                            </div>
                        </div>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={3}>
                    <Paper shadow="sm" p="md" radius="md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Tu Rol</p>
                                <h3 className="text-lg font-bold mt-1">{userRole}</h3>
                                <span className="text-orange-500 text-sm">
                                    {userRole === 'EMPRENDEDOR' ? 'Ventas Personales' : 'Todas las ventas'}
                                </span>
                            </div>
                            <div className="p-3 rounded-full bg-orange-100">
                                <IconUserPlus size={24} className="text-orange-500" />
                            </div>
                        </div>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Tabs, Filtros y Tabla */}
            <Tabs defaultValue="list">
                <Tabs.List>
                    <Tabs.Tab value="list" icon={<IconChecks size={14} />}>
                        Listado de Ventas
                    </Tabs.Tab>
                    <Tabs.Tab value="charts" icon={<IconChartBar size={14} />}>
                        Gráficos y Estadísticas
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="list" pt="md">
                    <div className="mb-4 flex flex-wrap gap-3">
                        <TextInput
                            placeholder="Buscar por cliente o producto"
                            icon={<IconSearch size={16} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.currentTarget.value)}
                            style={{ minWidth: '250px' }}
                        />

                        <MultiSelect
                            data={[
                                { value: 'completada', label: 'Completada' },
                                { value: 'pendiente', label: 'Pendiente' },
                                { value: 'cancelada', label: 'Cancelada' }
                            ]}
                            placeholder="Filtrar por estado"
                            icon={<IconFilter size={16} />}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ minWidth: '180px' }}
                        />

                        {(userRole === 'SUPER ADMINISTRADOR' || userRole === 'DISTRIBUIDOR') && (
                            <MultiSelect
                                data={sellers}
                                placeholder="Filtrar por vendedor"
                                icon={<IconUsers size={16} />}
                                value={sellerFilter}
                                onChange={setSellerFilter}
                                style={{ minWidth: '220px' }}
                            />
                        )}

                        <Group ml="auto">
                            <Button
                                variant="subtle"
                                onClick={() => {
                                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                }}
                                leftIcon={sortDirection === 'asc' ? 
                                    <IconSortAscending size={16} /> : 
                                    <IconSortDescending size={16} />
                                }
                            >
                                {sortField === 'date' ? 'Fecha' : 'Monto'}
                            </Button>
                            <Button
                                variant="subtle"
                                onClick={() => {
                                    setSortField(sortField === 'date' ? 'amount' : 'date');
                                }}
                            >
                                Ordenar por: {sortField === 'date' ? 'Fecha' : 'Monto'}
                            </Button>
                        </Group>
                    </div>

                    <Paper shadow="sm" p="xs" radius="md">
                        {sortedSales.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Producto</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                        {(userRole === 'SUPER ADMINISTRADOR' || userRole === 'DISTRIBUIDOR') && (
                                            <th>Vendedor</th>
                                        )}
                                        <th>Método de Pago</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td>{sale.clientName}</td>
                                            <td>{sale.productName}</td>
                                            <td><strong>{formatAmount(sale.amount)}</strong></td>
                                            <td>{formatDate(sale.date)}</td>
                                            {(userRole === 'SUPER ADMINISTRADOR' || userRole === 'DISTRIBUIDOR') && (
                                                <td>{getSellerName(sale.sellerId)}</td>
                                            )}
                                            <td>{getPaymentMethodName(sale.paymentMethod)}</td>
                                            <td>
                                                <Badge color={getStatusColor(sale.status)}>
                                                    {sale.status === 'completada' ? 'Completada' : 
                                                     sale.status === 'pendiente' ? 'Pendiente' : 
                                                     'Cancelada'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Group spacing={8}>
                                                    <Button 
                                                        compact 
                                                        variant="subtle" 
                                                        onClick={() => {
                                                            setSelectedSale(sale);
                                                            setIsAddingSale(true);
                                                        }}
                                                    >
                                                        Editar
                                                    </Button>
                                                </Group>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="py-10 text-center">
                                <Text color="dimmed">No se encontraron ventas</Text>
                            </div>
                        )}
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="charts" pt="md">
                    <Grid>
                        <Grid.Col span={7}>
                            <Paper shadow="sm" p="md" radius="md">
                                <h3 className="text-lg font-semibold mb-4">Ventas por Vendedor</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={prepareSellerChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatAmount(value)} />
                                        <Bar
                                            dataKey="value"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            name="Ventas Totales"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={5}>
                            <Paper shadow="sm" p="md" radius="md">
                                <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={preparePaymentMethodsData()}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {preparePaymentMethodsData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatAmount(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>
            </Tabs>

            {/* Modal para registrar/editar ventas */}
            <SaleForm
                isOpen={isAddingSale}
                onClose={() => {
                    setIsAddingSale(false);
                    setSelectedSale(null);
                }}
                onSave={handleSaveSale}
                sellers={userRole === 'EMPRENDEDOR' ? 
                    sellers.filter(s => s.value === currentUserId) : 
                    sellers}
                initialData={selectedSale}
            />
        </div>
    );
}