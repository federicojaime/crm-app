// src/pages/SalesPage.jsx
import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  TextInput,
  MultiSelect,
  Table,
  Group,
  Text,
  Badge,
  Tabs,
} from "@mantine/core";
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
  IconChecks,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Importamos nuestro nuevo componente del formulario
import SaleFormModal from "../components/modals/SaleFormModal";

export default function SalesPage() {
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [sortField, setSortField] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [sellerFilter, setSellerFilter] = useState([]);

  // Obtener información del usuario actual
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.rol || "EMPRENDEDOR");
    setCurrentUserId(user.id || "1"); // Default para pruebas
  }, []);

  // Datos de vendedores para pruebas
  const sellers = [
    { value: "1", label: "Gimena González" },
    { value: "2", label: "Juan Pérez" },
    { value: "3", label: "María López" },
    { value: "4", label: "Carlos Rodríguez" },
    { value: "5", label: "Ana Fernández" },
  ];

  // Datos de venta de ejemplo actualizados con nuestro nuevo formato
  const [sales, setSales] = useState([
    {
      id: 1,
      fecha: new Date("2024-04-01"),
      vendedor: "1",
      origen: "base",
      esAgregado: false,
      clienteNombre: "ROBERTO SÁNCHEZ",
      productos: {
        juegos: ["15pcs"],
        ollasIndividuales: [],
        ollaPresion: [],
        sartenes: [],
        coladores: [],
        planchas: [],
        extractores: [],
        cuchillos: [],
      },
      precioLista: 5500,
      modalidadPago: "tarjeta",
      anticipoAcordado: 5500,
      deudaAnticipo: 0,
      fechaCobroTotal: new Date("2024-04-01"),
      regaloVenta: false,
      observaciones: "Cliente recurrente",
    },
    {
      id: 2,
      fecha: new Date("2024-04-03"),
      vendedor: "2",
      origen: "exhibicion",
      esAgregado: false,
      clienteNombre: "LAURA GÓMEZ",
      productos: {
        juegos: [],
        ollasIndividuales: ["olla_6l", "olla_3l"],
        ollaPresion: [],
        sartenes: [],
        coladores: [],
        planchas: [],
        extractores: [],
        cuchillos: [],
      },
      precioLista: 3200,
      modalidadPago: "efectivo",
      anticipoAcordado: 3200,
      deudaAnticipo: 0,
      fechaCobroTotal: new Date("2024-04-03"),
      regaloVenta: false,
      observaciones: "",
    },
    {
      id: 3,
      fecha: new Date("2024-04-05"),
      vendedor: "3",
      origen: "referido",
      referido: "JUAN MARTINEZ",
      esAgregado: false,
      clienteNombre: "CARLOS TORRES",
      productos: {
        juegos: ["10pcs"],
        ollasIndividuales: [],
        ollaPresion: [],
        sartenes: ["sarten_26"],
        coladores: [],
        planchas: [],
        extractores: [],
        cuchillos: [],
      },
      precioLista: 8900,
      modalidadPago: "financiado",
      cuotas: "12",
      valorCuota: 850,
      anticipoAcordado: 1000,
      deudaAnticipo: 0,
      fechaCobroTotal: new Date("2024-04-05"),
      regaloVenta: true,
      detalleRegalo: "Colador pequeño",
      observaciones: "Entrega programada para el 15/04",
    },
    {
      id: 4,
      fecha: new Date("2024-04-07"),
      vendedor: "1",
      origen: "digital",
      esAgregado: true,
      clienteNombre: "MARTÍN GUTIÉRREZ",
      productos: {
        juegos: [],
        ollasIndividuales: [],
        ollaPresion: [],
        sartenes: ["sarten_gourmet_24"],
        coladores: [],
        planchas: [],
        extractores: [],
        cuchillos: [],
      },
      precioLista: 1200,
      modalidadPago: "transferencia",
      anticipoAcordado: 1200,
      deudaAnticipo: 0,
      fechaCobroTotal: new Date("2024-04-07"),
      regaloVenta: false,
      observaciones: "",
    },
    {
      id: 5,
      fecha: new Date("2024-04-08"),
      vendedor: "4",
      origen: "exhibicion",
      esAgregado: false,
      clienteNombre: "LUCÍA FERNÁNDEZ",
      productos: {
        juegos: [],
        ollasIndividuales: [],
        ollaPresion: [],
        sartenes: [],
        coladores: [],
        planchas: [],
        extractores: [],
        cuchillos: ["juego_5"],
      },
      precioLista: 1800,
      modalidadPago: "tarjeta",
      anticipoAcordado: 1800,
      deudaAnticipo: 0,
      fechaCobroTotal: new Date("2024-04-08"),
      regaloVenta: false,
      observaciones: "",
    },
    {
      id: 6,
      fecha: new Date("2024-04-10"),
      vendedor: "2",
      origen: "base",
      esAgregado: false,
      clienteNombre: "DIEGO LÓPEZ",
      productos: {
        juegos: [],
        ollasIndividuales: [],
        ollaPresion: ["presion_6l"],
        sartenes: [],
        coladores: [],
        planchas: [],
        extractores: [],
        cuchillos: [],
      },
      precioLista: 4500,
      modalidadPago: "financiado",
      cuotas: "6",
      valorCuota: 800,
      anticipoAcordado: 800,
      deudaAnticipo: 0,
      fechaCobroTotal: new Date("2024-04-10"),
      regaloVenta: false,
      observaciones: "Primera cuota pagada",
    },
  ]);

  // Función auxiliar para obtener los productos como texto
  const getProductsText = (productObj) => {
    // Mapas para mostrar nombres amigables
    const productMaps = {
      juegos: {
        "15pcs": "Juego 15 piezas",
        "10pcs": "Juego 10 piezas",
        "8pcs": "Juego 8 piezas",
        "7pcs": "Juego 7 piezas",
        "5pcs_complementario": "Juego 5 pcs complementario",
        "5pcs_esencial": "Juego 5 pcs esencial",
      },
      ollasIndividuales: {
        olla_30l: "Olla 30L",
        olla_20l: "Olla 20L",
        olla_12l: "Olla 12L",
        olla_8l: "Olla 8L",
        olla_6l: "Olla 6L",
        olla_4l: "Olla 4L",
        olla_3l: "Olla 3L",
        olla_2l: "Olla 2L",
        "olla_1.5l": "Olla 1.5L",
        pavera: "Pavera ovalada",
      },
      ollaPresion: {
        presion_6l: "Olla a presión 6L",
        presion_10l: "Olla a presión 10L",
      },
      sartenes: {
        sarten_26: "Sartén 26cm",
        sarten_20: "Sartén 20cm",
        paellera_14: 'Paellera 14"',
        paellera_10: 'Paellera 10"',
        juego_gourmet: "Juego Sartenes Gourmet",
        sarten_gourmet_24: "Sartén gourmet 24cm",
        sarten_gourmet_20: "Sartén gourmet 20cm",
        easy_8: 'Sartén Easy 8"',
        easy_10: 'Sartén Easy 10"',
        easy_12: 'Sartén Easy 12"',
        juego_easy: "Juego Sartenes Easy",
      },
      coladores: {
        colador_grande: "Colador Grande",
        colador_pequeño: "Colador Pequeño",
      },
      planchas: {
        plancha_doble: "Plancha Doble RP",
        plancha_redonda: "Plancha redonda",
        plancha_sencilla: "Plancha sencilla",
      },
      extractores: {
        maxtractor: "Maxtractor",
        hervidor: "Hervidor 900ml",
        tazones_4: "Tazones 4",
        tazones_2: "Tazones 2",
        cafetera_10: "Cafetera 10 tazas",
        cafetera_4: "Cafetera 4 tazas",
        expertea: "Expertea",
        combo_pequeño: "Combo Pequeño",
        combo_mediano: "Combo Mediano",
        combo_grande: "Combo Grande",
      },
      cuchillos: {
        bloque_completo: "Bloque completo",
        bloque_acacia: "Bloque de acacia",
        juego_5: "Juego 5 piezas",
        juego_asador: "Juego del asador",
        serruchos_4: "Cuchillos serruchos 4pz",
        hacha: "Hacha de cocina",
        santoku: 'Santoku 5"',
        cuchillo_asador: 'Cuchillo asador 8"',
        tenedor_asador: "Tenedor asador",
        tijeras: "Tijeras",
        tabla_grande: "Tabla Bambu Grande",
        tabla_chica: "Tabla Bambu Chica",
      },
    };

    // Recopilar todos los productos seleccionados
    const allProducts = [];
    Object.keys(productObj).forEach((category) => {
      if (productObj[category] && productObj[category].length > 0) {
        productObj[category].forEach((prod) => {
          if (productMaps[category] && productMaps[category][prod]) {
            allProducts.push(productMaps[category][prod]);
          } else {
            allProducts.push(prod); // Fallback al código si no hay mapeo
          }
        });
      }
    });

    return allProducts.join(", ");
  };

  // Filtrar ventas según el rol del usuario
  const filteredSalesByRole = () => {
    if (userRole === "EMPRENDEDOR") {
      // Emprendedores solo ven sus propias ventas
      return sales.filter((sale) => sale.vendedor === currentUserId);
    } else {
      // Distribuidores y administradores ven todas las ventas
      return sales;
    }
  };

  // Aplicar filtros adicionales (búsqueda, estado, vendedor)
  const filteredSales = filteredSalesByRole().filter((sale) => {
    // Filtro de búsqueda
    const productText = getProductsText(sale.productos);
    const searchMatch =
      searchTerm === "" ||
      sale.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productText.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de estado - adaptado para nuestro modelo
    const statusMatch =
      statusFilter.length === 0 ||
      (sale.deudaAnticipo === 0 && statusFilter.includes("completada")) ||
      (sale.deudaAnticipo > 0 && statusFilter.includes("pendiente"));

    // Filtro de vendedor
    const sellerMatch =
      sellerFilter.length === 0 || sellerFilter.includes(sale.vendedor);

    return searchMatch && statusMatch && sellerMatch;
  });

  // Ordenar ventas
  const sortedSales = [...filteredSales].sort((a, b) => {
    if (sortField === "fecha") {
      return sortDirection === "asc"
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha);
    } else if (sortField === "precioLista") {
      return sortDirection === "asc"
        ? a.precioLista - b.precioLista
        : b.precioLista - a.precioLista;
    }
    return 0;
  });

  // Gestionar guardado de ventas (nuevas o editadas)
  const handleSaveSale = (saleData) => {
    if (selectedSale) {
      // Actualizar venta existente
      setSales((prev) =>
        prev.map((s) => (s.id === saleData.id ? saleData : s))
      );
    } else {
      // Agregar nueva venta
      setSales((prev) => [...prev, saleData]);
    }
  };

  // Stats para el panel superior
  const calculateStats = () => {
    const relevantSales = filteredSalesByRole();

    // Total ventas
    const totalSales = relevantSales.reduce(
      (sum, sale) => sum + sale.precioLista,
      0
    );

    // Ventas por vendedor
    const salesBySeller = {};
    relevantSales.forEach((sale) => {
      if (!salesBySeller[sale.vendedor]) {
        salesBySeller[sale.vendedor] = 0;
      }
      salesBySeller[sale.vendedor] += sale.precioLista;
    });

    // Vendedor con más ventas
    let topSellerId = "";
    let topSellerAmount = 0;
    Object.entries(salesBySeller).forEach(([sellerId, amount]) => {
      if (amount > topSellerAmount) {
        topSellerId = sellerId;
        topSellerAmount = amount;
      }
    });

    const topSellerName =
      sellers.find((s) => s.value === topSellerId)?.label || "Desconocido";

    // Promedio de ventas
    const avgSale =
      relevantSales.length > 0 ? totalSales / relevantSales.length : 0;

    return {
      totalAmount: totalSales,
      totalCount: relevantSales.length,
      avgSale,
      topSeller: {
        name: topSellerName,
        amount: topSellerAmount,
      },
    };
  };

  const stats = calculateStats();

  // Datos para gráficos
  const prepareSellerChartData = () => {
    const relevantSales = filteredSalesByRole();
    const salesBySeller = {};

    // Agrupar ventas por vendedor
    relevantSales.forEach((sale) => {
      if (!salesBySeller[sale.vendedor]) {
        salesBySeller[sale.vendedor] = {
          value: 0,
          count: 0,
        };
      }
      salesBySeller[sale.vendedor].value += sale.precioLista;
      salesBySeller[sale.vendedor].count += 1;
    });

    // Convertir a formato para gráfico
    return Object.entries(salesBySeller)
      .map(([sellerId, data]) => {
        const sellerName =
          sellers.find((s) => s.value === sellerId)?.label ||
          `Vendedor ${sellerId}`;
        return {
          name: sellerName,
          value: data.value,
          count: data.count,
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Preparar datos de gráfico de métodos de pago
  const preparePaymentMethodsData = () => {
    const relevantSales = filteredSalesByRole();
    const paymentMethodData = {
      efectivo: { name: "Efectivo", value: 0 },
      tarjeta: { name: "Tarjeta", value: 0 },
      transferencia: { name: "Transferencia", value: 0 },
      financiado: { name: "Financiado", value: 0 },
      contado: { name: "Contado", value: 0 },
    };

    relevantSales.forEach((sale) => {
      if (paymentMethodData[sale.modalidadPago]) {
        paymentMethodData[sale.modalidadPago].value += sale.precioLista;
      }
    });

    return Object.values(paymentMethodData).filter((item) => item.value > 0);
  };

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-AR");
  };

  // Formatear monto para mostrar
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Obtener nombre de vendedor
  const getSellerName = (sellerId) => {
    return (
      sellers.find((seller) => seller.value === sellerId)?.label ||
      "Desconocido"
    );
  };

  // Obtener color según estado
  const getStatusColor = (deudaAnticipo) => {
    return deudaAnticipo === 0 ? "green" : "yellow";
  };

  // Traducir método de pago
  const getPaymentMethodName = (method) => {
    const methods = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta de Crédito",
      transferencia: "Transferencia",
      financiado: "Financiado",
      contado: "Contado",
    };
    return methods[method] || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Órdenes de Compra</h2>
        <Button
          leftIcon={<IconPlus size={20} />}
          onClick={() => {
            setSelectedSale(null);
            setIsAddingSale(true);
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Registrar Orden
        </Button>
      </div>

      {/* Stats Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Paper shadow="sm" p="md" radius="md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Ventas Totales</p>
                <h3 className="text-2xl font-bold mt-1">
                  {formatAmount(stats.totalAmount)}
                </h3>
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
                <h3 className="text-2xl font-bold mt-1">
                  {formatAmount(stats.avgSale)}
                </h3>
                <span className="text-blue-500 text-sm">Por transacción</span>
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
                <h3 className="text-lg font-bold mt-1">
                  {stats.topSeller.name}
                </h3>
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
                  {userRole === "EMPRENDEDOR"
                    ? "Ventas Personales"
                    : "Todas las ventas"}
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
            Listado de Órdenes
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
              style={{ minWidth: "250px" }}
            />

            <MultiSelect
              data={[
                { value: "completada", label: "Completada" },
                { value: "pendiente", label: "Pendiente" },
              ]}
              placeholder="Filtrar por estado"
              icon={<IconFilter size={16} />}
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ minWidth: "180px" }}
            />

            {(userRole === "SUPER ADMINISTRADOR" ||
              userRole === "DISTRIBUIDOR") && (
              <MultiSelect
                data={sellers}
                placeholder="Filtrar por vendedor"
                icon={<IconUsers size={16} />}
                value={sellerFilter}
                onChange={setSellerFilter}
                style={{ minWidth: "220px" }}
              />
            )}

            <Group ml="auto">
              <Button
                variant="subtle"
                onClick={() => {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                leftIcon={
                  sortDirection === "asc" ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )
                }
              >
                {sortField === "fecha" ? "Fecha" : "Monto"}
              </Button>
              <Button
                variant="subtle"
                onClick={() => {
                  setSortField(sortField === "fecha" ? "precioLista" : "fecha");
                }}
              >
                Ordenar por: {sortField === "fecha" ? "Fecha" : "Monto"}
              </Button>
            </Group>
          </div>

          <Paper shadow="sm" p="xs" radius="md">
            {sortedSales.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    {(userRole === "SUPER ADMINISTRADOR" ||
                      userRole === "DISTRIBUIDOR") && <th>Vendedor</th>}
                    <th>Método de Pago</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.clienteNombre}</td>
                      <td>{getProductsText(sale.productos)}</td>
                      <td>
                        <strong>{formatAmount(sale.precioLista)}</strong>
                      </td>
                      <td>{formatDate(sale.fecha)}</td>
                      {(userRole === "SUPER ADMINISTRADOR" ||
                        userRole === "DISTRIBUIDOR") && (
                        <td>{getSellerName(sale.vendedor)}</td>
                      )}
                      <td>{getPaymentMethodName(sale.modalidadPago)}</td>
                      <td>
                        <Badge color={getStatusColor(sale.deudaAnticipo)}>
                          {sale.deudaAnticipo === 0
                            ? "Completada"
                            : "Pendiente"}
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
                <Text color="dimmed">No se encontraron órdenes de compra</Text>
              </div>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="charts" pt="md">
          <Grid>
            <Grid.Col span={7}>
              <Paper shadow="sm" p="md" radius="md">
                <h3 className="text-lg font-semibold mb-4">
                  Ventas por Vendedor
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareSellerChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value) => formatAmount(value)}
                    />
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
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {preparePaymentMethodsData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => formatAmount(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Modal para registrar/editar órdenes de compra */}
      <SaleFormModal
        isOpen={isAddingSale}
        onClose={() => {
          setIsAddingSale(false);
          setSelectedSale(null);
        }}
        onSave={handleSaveSale}
        sellers={
          userRole === "EMPRENDEDOR"
            ? sellers.filter((s) => s.value === currentUserId)
            : sellers
        }
        initialData={selectedSale}
      />
    </div>
  );
}
