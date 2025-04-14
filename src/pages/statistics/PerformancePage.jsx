// src/pages/statistics/PerformancePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Paper, Title, Select, Grid, Text, Badge } from "@mantine/core";
import {
  IconFilter,
  IconChevronDown,
  IconCalendar,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
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
  Area,
  AreaChart,
} from "recharts";

const PerformancePage = () => {
  const [yearFilter, setYearFilter] = useState("2024");
  const [monthFilter, setMonthFilter] = useState("all");
  const [weekFilter, setWeekFilter] = useState("all");
  const [distributionFilter, setDistributionFilter] = useState("dist2");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Referencias a los contenedores de los embudos
  const funnelChartRef = useRef(null);
  const postSaleFunnelChartRef = useRef(null);

  // Datos originales completos
  const allPerformanceData = {
    2024: [
      {
        name: "Ene",
        ventas: 24,
        meta: 20,
        datos: 336,
        citas: 84,
        demos: 34,
        citasPV: 25,
        demosPV: 19,
        ventasPV: 10,
      },
      {
        name: "Feb",
        ventas: 26,
        meta: 22,
        datos: 350,
        citas: 88,
        demos: 35,
        citasPV: 27,
        demosPV: 20,
        ventasPV: 11,
      },
      {
        name: "Mar",
        ventas: 28,
        meta: 25,
        datos: 364,
        citas: 91,
        demos: 36,
        citasPV: 29,
        demosPV: 22,
        ventasPV: 12,
      },
      {
        name: "Abr",
        ventas: 22,
        meta: 24,
        datos: 378,
        citas: 95,
        demos: 38,
        citasPV: 31,
        demosPV: 24,
        ventasPV: 13,
      },
      {
        name: "May",
        ventas: 30,
        meta: 28,
        datos: 392,
        citas: 98,
        demos: 39,
        citasPV: 33,
        demosPV: 25,
        ventasPV: 14,
      },
      {
        name: "Jun",
        ventas: 32,
        meta: 30,
        datos: 406,
        citas: 102,
        demos: 41,
        citasPV: 35,
        demosPV: 27,
        ventasPV: 15,
      },
      {
        name: "Jul",
        ventas: 29,
        meta: 29,
        datos: 420,
        citas: 105,
        demos: 42,
        citasPV: 37,
        demosPV: 28,
        ventasPV: 16,
      },
      {
        name: "Ago",
        ventas: 34,
        meta: 32,
        datos: 434,
        citas: 109,
        demos: 44,
        citasPV: 39,
        demosPV: 30,
        ventasPV: 16,
      },
      {
        name: "Sep",
        ventas: 36,
        meta: 34,
        datos: 448,
        citas: 112,
        demos: 45,
        citasPV: 41,
        demosPV: 31,
        ventasPV: 17,
      },
      {
        name: "Oct",
        ventas: 31,
        meta: 33,
        datos: 462,
        citas: 116,
        demos: 46,
        citasPV: 43,
        demosPV: 33,
        ventasPV: 18,
      },
      {
        name: "Nov",
        ventas: 38,
        meta: 36,
        datos: 476,
        citas: 119,
        demos: 48,
        citasPV: 45,
        demosPV: 34,
        ventasPV: 19,
      },
      {
        name: "Dic",
        ventas: 40,
        meta: 38,
        datos: 490,
        citas: 123,
        demos: 49,
        citasPV: 47,
        demosPV: 36,
        ventasPV: 20,
      },
    ],
    2025: [
      {
        name: "Ene",
        ventas: 27,
        meta: 25,
        datos: 370,
        citas: 93,
        demos: 37,
        citasPV: 28,
        demosPV: 21,
        ventasPV: 12,
      },
      {
        name: "Feb",
        ventas: 29,
        meta: 27,
        datos: 384,
        citas: 96,
        demos: 38,
        citasPV: 30,
        demosPV: 23,
        ventasPV: 13,
      },
      {
        name: "Mar",
        ventas: 31,
        meta: 30,
        datos: 398,
        citas: 100,
        demos: 40,
        citasPV: 32,
        demosPV: 24,
        ventasPV: 14,
      },
      {
        name: "Abr",
        ventas: 25,
        meta: 28,
        datos: 412,
        citas: 103,
        demos: 41,
        citasPV: 34,
        demosPV: 26,
        ventasPV: 14,
      },
      {
        name: "May",
        ventas: 33,
        meta: 32,
        datos: 426,
        citas: 107,
        demos: 43,
        citasPV: 36,
        demosPV: 27,
        ventasPV: 15,
      },
      {
        name: "Jun",
        ventas: 35,
        meta: 34,
        datos: 440,
        citas: 110,
        demos: 44,
        citasPV: 38,
        demosPV: 29,
        ventasPV: 16,
      },
      {
        name: "Jul",
        ventas: 32,
        meta: 33,
        datos: 454,
        citas: 114,
        demos: 45,
        citasPV: 40,
        demosPV: 31,
        ventasPV: 17,
      },
      {
        name: "Ago",
        ventas: 37,
        meta: 36,
        datos: 468,
        citas: 117,
        demos: 47,
        citasPV: 42,
        demosPV: 32,
        ventasPV: 18,
      },
      {
        name: "Sep",
        ventas: 39,
        meta: 38,
        datos: 482,
        citas: 121,
        demos: 48,
        citasPV: 44,
        demosPV: 34,
        ventasPV: 19,
      },
      {
        name: "Oct",
        ventas: 34,
        meta: 37,
        datos: 496,
        citas: 124,
        demos: 50,
        citasPV: 46,
        demosPV: 35,
        ventasPV: 19,
      },
      {
        name: "Nov",
        ventas: 41,
        meta: 40,
        datos: 510,
        citas: 128,
        demos: 51,
        citasPV: 48,
        demosPV: 37,
        ventasPV: 20,
      },
      {
        name: "Dic",
        ventas: 43,
        meta: 42,
        datos: 524,
        citas: 131,
        demos: 52,
        citasPV: 50,
        demosPV: 38,
        ventasPV: 21,
      },
    ],
    2026: [
      {
        name: "Ene",
        ventas: 30,
        meta: 28,
        datos: 400,
        citas: 100,
        demos: 40,
        citasPV: 30,
        demosPV: 23,
        ventasPV: 13,
      },
      {
        name: "Feb",
        ventas: 32,
        meta: 30,
        datos: 414,
        citas: 104,
        demos: 41,
        citasPV: 32,
        demosPV: 25,
        ventasPV: 14,
      },
      {
        name: "Mar",
        ventas: 34,
        meta: 33,
        datos: 428,
        citas: 107,
        demos: 43,
        citasPV: 34,
        demosPV: 26,
        ventasPV: 15,
      },
      {
        name: "Abr",
        ventas: 28,
        meta: 31,
        datos: 442,
        citas: 111,
        demos: 44,
        citasPV: 36,
        demosPV: 28,
        ventasPV: 15,
      },
      {
        name: "May",
        ventas: 36,
        meta: 35,
        datos: 456,
        citas: 114,
        demos: 46,
        citasPV: 38,
        demosPV: 29,
        ventasPV: 16,
      },
      {
        name: "Jun",
        ventas: 38,
        meta: 37,
        datos: 470,
        citas: 118,
        demos: 47,
        citasPV: 40,
        demosPV: 31,
        ventasPV: 17,
      },
      {
        name: "Jul",
        ventas: 35,
        meta: 36,
        datos: 484,
        citas: 121,
        demos: 48,
        citasPV: 42,
        demosPV: 32,
        ventasPV: 18,
      },
      {
        name: "Ago",
        ventas: 40,
        meta: 39,
        datos: 498,
        citas: 125,
        demos: 50,
        citasPV: 44,
        demosPV: 34,
        ventasPV: 19,
      },
      {
        name: "Sep",
        ventas: 42,
        meta: 41,
        datos: 512,
        citas: 128,
        demos: 51,
        citasPV: 46,
        demosPV: 35,
        ventasPV: 20,
      },
      {
        name: "Oct",
        ventas: 37,
        meta: 40,
        datos: 526,
        citas: 132,
        demos: 53,
        citasPV: 48,
        demosPV: 37,
        ventasPV: 20,
      },
      {
        name: "Nov",
        ventas: 44,
        meta: 43,
        datos: 540,
        citas: 135,
        demos: 54,
        citasPV: 50,
        demosPV: 38,
        ventasPV: 21,
      },
      {
        name: "Dic",
        ventas: 46,
        meta: 45,
        datos: 554,
        citas: 139,
        demos: 55,
        citasPV: 52,
        demosPV: 40,
        ventasPV: 22,
      },
    ],
  };

  // Distribuciones
  const distributions = {
    all: { factor: 1 },
    dist1: { factor: 0.4 },
    dist2: { factor: 0.3 },
    dist3: { factor: 0.3 },
  };

  // Datos por vendedor mejorados con más información
  const vendedoresData = [
    {
      nombre: "Isabel Jauregui",
      datos: 156,
      citas: 27,
      demos: 23,
      ventas: 10,
      citasPostv: 21,
      demosPostv: 16,
      ventaPostv: 8,
      regalos: 9,
      performance: 95,
      status: "star",
    },
    {
      nombre: "Rodrigo Gutiérrez",
      datos: 220,
      citas: 55,
      demos: 18,
      ventas: 9,
      citasPostv: 20,
      demosPostv: 14,
      ventaPostv: 7,
      regalos: 0,
      performance: 78,
      status: "active",
    },
    {
      nombre: "Vanesa Alcaraz",
      datos: 119,
      citas: 29,
      demos: 15,
      ventas: 9,
      citasPostv: 31,
      demosPostv: 20,
      ventaPostv: 6,
      regalos: 0,
      performance: 82,
      status: "active",
    },
    {
      nombre: "Carlos Medina",
      datos: 175,
      citas: 43,
      demos: 21,
      ventas: 11,
      citasPostv: 25,
      demosPostv: 18,
      ventaPostv: 9,
      regalos: 7,
      performance: 88,
      status: "star",
    },
    {
      nombre: "Laura Vázquez",
      datos: 98,
      citas: 22,
      demos: 12,
      ventas: 5,
      citasPostv: 15,
      demosPostv: 10,
      ventaPostv: 3,
      regalos: 2,
      performance: 65,
      status: "warning",
    },
  ];

  // Estado para datos filtrados
  const [performanceData, setPerformanceData] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState(vendedoresData);
  const [filteredData, setFilteredData] = useState({
    datos: 336,
    citas: 84,
    demos: 34,
    ventas: 24,
    citasPV: 25,
    demosPV: 19,
    ventasPV: 10,
  });

  // Calcular KPIs basados en datos filtrados
  const [kpiData, setKpiData] = useState([
    {
      title: "Citas vs Demos",
      value: "2.5",
      description: "¿Cuántas citas para 1 demo?",
      target: "VR: menor a 2",
      icon: "📋",
      color: "bg-yellow-400",
    },
    {
      title: "Datos vs Citas",
      value: "4.0",
      description: "¿Cuántos datos para 1 cita?",
      target: "VR: menor a 4",
      icon: "📊",
      color: "bg-green-400",
    },
    {
      title: "Datos vs Ventas",
      value: "14.0",
      description: "¿Cuántos datos para 1 Venta?",
      target: "VR: menor a 14",
      icon: "💰",
      color: "bg-yellow-400",
    },
    {
      title: "Demo vs Venta",
      value: "1.4",
      description: "¿Cuántas demos para 1 Venta?",
      target: "VR: menor a 2",
      icon: "🎯",
      color: "bg-green-400",
    },
  ]);

  const [postSaleKpiData, setPostSaleKpiData] = useState([
    {
      title: "Cita vs Demo PV",
      value: "1.3",
      description: "Citas a demos postventa",
      target: "VR: menor a 1.5",
      icon: "🔄",
      color: "bg-blue-400",
    },
    {
      title: "Demo vs Venta PV",
      value: "1.8",
      description: "Demos a ventas postventa",
      target: "VR: menor a 2",
      icon: "🔄",
      color: "bg-purple-400",
    },
  ]);

  const [closeRateData, setCloseRateData] = useState({
    percentage: "40%",
    ticketValue: "362.86",
  });

  const [postSaleCloseRateData, setPostSaleCloseRateData] = useState({
    percentage: "50%",
  });

  // Función para buscar vendedores
  useEffect(() => {
    const filtered = vendedoresData.filter((vendedor) =>
      vendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendedores(filtered);
  }, [searchTerm]);

  // Función para manejar el clic en un empleado
  const handleEmployeeClick = (employee) => {
    // Si ya está seleccionado, deseleccionarlo
    if (selectedEmployee && selectedEmployee.nombre === employee.nombre) {
      setSelectedEmployee(null);

      // Restablecer los datos filtrados a los originales basados en los filtros actuales
      updateFilteredData(
        yearFilter,
        monthFilter,
        weekFilter,
        distributionFilter
      );
    } else {
      // Seleccionar este empleado
      setSelectedEmployee(employee);

      // Actualizar los datos basados en este empleado específico
      setFilteredData({
        datos: employee.datos,
        citas: employee.citas,
        demos: employee.demos,
        ventas: employee.ventas,
        citasPV: employee.citasPostv,
        demosPV: employee.demosPostv,
        ventasPV: employee.ventaPostv,
      });

      // Calcular KPIs para este empleado
      updateKPIsForEmployee(employee);
    }
  };

  // Función para actualizar KPIs basados en un empleado
  const updateKPIsForEmployee = (employee) => {
    const { datos, citas, demos, ventas, citasPostv, demosPostv, ventaPostv } =
      employee;

    const citasDemos =
      citas > 0 && demos > 0 ? (citas / demos).toFixed(1) : "0.0";
    const datosCitas =
      datos > 0 && citas > 0 ? (datos / citas).toFixed(1) : "0.0";
    const datosVentas =
      datos > 0 && ventas > 0 ? (datos / ventas).toFixed(1) : "0.0";
    const demosVentas =
      demos > 0 && ventas > 0 ? (demos / ventas).toFixed(1) : "0.0";

    const citasDemosPV =
      citasPostv > 0 && demosPostv > 0
        ? (citasPostv / demosPostv).toFixed(1)
        : "0.0";
    const demosVentasPV =
      demosPostv > 0 && ventaPostv > 0
        ? (demosPostv / ventaPostv).toFixed(1)
        : "0.0";

    // Porcentaje de cierre
    const closeRate = demos > 0 ? Math.round((ventas / demos) * 100) : 0;
    const closeRatePV =
      demosPostv > 0 ? Math.round((ventaPostv / demosPostv) * 100) : 0;

    // Actualizar KPIs con los mismos iconos y colores
    setKpiData([
      {
        title: "Citas vs Demos",
        value: citasDemos,
        description: "¿Cuántas citas para 1 demo?",
        target: "VR: menor a 2",
        icon: "📋",
        color: "bg-yellow-400",
      },
      {
        title: "Datos vs Citas",
        value: datosCitas,
        description: "¿Cuántos datos para 1 cita?",
        target: "VR: menor a 4",
        icon: "📊",
        color: "bg-green-400",
      },
      {
        title: "Datos vs Ventas",
        value: datosVentas,
        description: "¿Cuántos datos para 1 Venta?",
        target: "VR: menor a 14",
        icon: "💰",
        color: "bg-yellow-400",
      },
      {
        title: "Demo vs Venta",
        value: demosVentas,
        description: "¿Cuántas demos para 1 Venta?",
        target: "VR: menor a 2",
        icon: "🎯",
        color: "bg-green-400",
      },
    ]);

    setPostSaleKpiData([
      {
        title: "Cita vs Demo PV",
        value: citasDemosPV,
        description: "Citas a demos postventa",
        target: "VR: menor a 1.5",
        icon: "🔄",
        color: "bg-blue-400",
      },
      {
        title: "Demo vs Venta PV",
        value: demosVentasPV,
        description: "Demos a ventas postventa",
        target: "VR: menor a 2",
        icon: "🔄",
        color: "bg-purple-400",
      },
    ]);

    setCloseRateData({
      percentage: `${closeRate}%`,
      ticketValue: "362.86",
    });

    setPostSaleCloseRateData({
      percentage: `${closeRatePV}%`,
    });
  };

  // Función para actualizar datos basados en filtros
  const updateFilteredData = (year, month, week, distribution) => {
    // Obtener datos del año seleccionado
    const yearData = allPerformanceData[year] || allPerformanceData["2024"];

    // Filtrar por mes si está seleccionado
    let filteredMonthData = yearData;
    if (month && month !== "all") {
      const monthIndex = parseInt(month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        filteredMonthData = [yearData[monthIndex]];
      }
    }

    // Aplicar el factor de distribución
    const distFactor = distributions[distribution]?.factor || 1;

    // Calcular totales
    let totalDatos = 0;
    let totalCitas = 0;
    let totalDemos = 0;
    let totalVentas = 0;
    let totalCitasPV = 0;
    let totalDemosPV = 0;
    let totalVentasPV = 0;

    filteredMonthData.forEach((month) => {
      totalDatos += Math.round(month.datos * distFactor);
      totalCitas += Math.round(month.citas * distFactor);
      totalDemos += Math.round(month.demos * distFactor);
      totalVentas += Math.round(month.ventas * distFactor);
      totalCitasPV += Math.round(month.citasPV * distFactor);
      totalDemosPV += Math.round(month.demosPV * distFactor);
      totalVentasPV += Math.round(month.ventasPV * distFactor);
    });

    // Actualizar datos filtrados totales
    setFilteredData({
      datos: totalDatos,
      citas: totalCitas,
      demos: totalDemos,
      ventas: totalVentas,
      citasPV: totalCitasPV,
      demosPV: totalDemosPV,
      ventasPV: totalVentasPV,
    });

    // Calcular KPIs
    const citasDemos =
      totalCitas > 0 && totalDemos > 0
        ? (totalCitas / totalDemos).toFixed(1)
        : "0.0";
    const datosCitas =
      totalDatos > 0 && totalCitas > 0
        ? (totalDatos / totalCitas).toFixed(1)
        : "0.0";
    const datosVentas =
      totalDatos > 0 && totalVentas > 0
        ? (totalDatos / totalVentas).toFixed(1)
        : "0.0";
    const demosVentas =
      totalDemos > 0 && totalVentas > 0
        ? (totalDemos / totalVentas).toFixed(1)
        : "0.0";

    const citasDemosPV =
      totalCitasPV > 0 && totalDemosPV > 0
        ? (totalCitasPV / totalDemosPV).toFixed(1)
        : "0.0";
    const demosVentasPV =
      totalDemosPV > 0 && totalVentasPV > 0
        ? (totalDemosPV / totalVentasPV).toFixed(1)
        : "0.0";

    // Porcentaje de cierre
    const closeRate =
      totalDemos > 0 ? Math.round((totalVentas / totalDemos) * 100) : 0;
    const closeRatePV =
      totalDemosPV > 0 ? Math.round((totalVentasPV / totalDemosPV) * 100) : 0;

    // Actualizar KPIs
    setKpiData([
      {
        title: "Citas vs Demos",
        value: citasDemos,
        description: "¿Cuántas citas para 1 demo?",
        target: "VR: menor a 2",
        icon: "📋",
        color: "bg-yellow-400",
      },
      {
        title: "Datos vs Citas",
        value: datosCitas,
        description: "¿Cuántos datos para 1 cita?",
        target: "VR: menor a 4",
        icon: "📊",
        color: "bg-green-400",
      },
      {
        title: "Datos vs Ventas",
        value: datosVentas,
        description: "¿Cuántos datos para 1 Venta?",
        target: "VR: menor a 14",
        icon: "💰",
        color: "bg-yellow-400",
      },
      {
        title: "Demo vs Venta",
        value: demosVentas,
        description: "¿Cuántas demos para 1 Venta?",
        target: "VR: menor a 2",
        icon: "🎯",
        color: "bg-green-400",
      },
    ]);

    setPostSaleKpiData([
      {
        title: "Cita vs Demo PV",
        value: citasDemosPV,
        description: "Citas a demos postventa",
        target: "VR: menor a 1.5",
        icon: "🔄",
        color: "bg-blue-400",
      },
      {
        title: "Demo vs Venta PV",
        value: demosVentasPV,
        description: "Demos a ventas postventa",
        target: "VR: menor a 2",
        icon: "🔄",
        color: "bg-purple-400",
      },
    ]);

    setCloseRateData({
      percentage: `${closeRate}%`,
      ticketValue: "362.86",
    });

    setPostSaleCloseRateData({
      percentage: `${closeRatePV}%`,
    });
  };

  // Función para renderizar embudo con CanvasJS
  const renderFunnelChart = () => {
    if (window.CanvasJS && funnelChartRef.current) {
      const { datos, citas, demos, ventas } = filteredData;

      const chart = new window.CanvasJS.Chart(funnelChartRef.current, {
        theme: "light2",
        animationEnabled: true,
        title: {
          text: "",
          fontFamily: "Arial",
          fontSize: 0,
        },
        data: [
          {
            type: "funnel",
            indexLabelPlacement: "inside",
            indexLabelFontColor: "white",
            toolTipContent: "<b>{label}</b>: {y} ({percentage}%)",
            indexLabel: "{percentage}% ({y})",
            dataPoints: [
              { y: datos, label: "Datos", color: "#60A5FA" },
              { y: citas, label: "Citas", color: "#93C5FD" },
              { y: demos, label: "Demos", color: "#EC4899" },
              { y: ventas, label: "Ventas", color: "#FBBF24" },
            ],
          },
        ],
        legend: {
          verticalAlign: "bottom",
          horizontalAlign: "center",
        },
      });

      // Calcular porcentajes - CORREGIDO
      if (
        chart &&
        chart.data &&
        chart.data[0] &&
        chart.data[0].dataPoints &&
        chart.data[0].dataPoints.length > 0
      ) {
        const totalValue = chart.data[0].dataPoints[0].y || 1; // Evitar división por cero
        chart.data[0].dataPoints.forEach((point) => {
          if (point) {
            point.percentage = Math.round((point.y / totalValue) * 100);
          }
        });
      }

      chart.render();
    }
  };

  // Función para renderizar embudo de postventa con CanvasJS
  const renderPostSaleFunnelChart = () => {
    if (window.CanvasJS && postSaleFunnelChartRef.current) {
      const { citasPV, demosPV, ventasPV } = filteredData;

      const chart = new window.CanvasJS.Chart(postSaleFunnelChartRef.current, {
        theme: "light2",
        animationEnabled: true,
        title: {
          text: "",
          fontFamily: "Arial",
          fontSize: 0,
        },
        data: [
          {
            type: "funnel",
            indexLabelPlacement: "inside",
            indexLabelFontColor: "white",
            toolTipContent: "<b>{label}</b>: {y} ({percentage}%)",
            indexLabel: "{percentage}% ({y})",
            dataPoints: [
              { y: citasPV, label: "Citas Postventa", color: "#60A5FA" },
              { y: demosPV, label: "Demos Postventa", color: "#93C5FD" },
              { y: ventasPV, label: "Venta postventa", color: "#EC4899" },
            ],
          },
        ],
        legend: {
          verticalAlign: "bottom",
          horizontalAlign: "center",
        },
      });

      // Calcular porcentajes - CORREGIDO
      if (
        chart &&
        chart.data &&
        chart.data[0] &&
        chart.data[0].dataPoints &&
        chart.data[0].dataPoints.length > 0
      ) {
        const totalValue = chart.data[0].dataPoints[0].y || 1; // Evitar división por cero
        chart.data[0].dataPoints.forEach((point) => {
          if (point) {
            point.percentage = Math.round((point.y / totalValue) * 100);
          }
        });
      }

      chart.render();
    }
  };

  // Efecto para actualizar datos cuando cambian los filtros
  useEffect(() => {
    // Si hay un empleado seleccionado, no cambiamos los datos al cambiar los filtros
    if (!selectedEmployee) {
      updateFilteredData(
        yearFilter,
        monthFilter,
        weekFilter,
        distributionFilter
      );
    }

    // Actualizar datos de rendimiento (gráfica mensual) independientemente
    const yearData =
      allPerformanceData[yearFilter] || allPerformanceData["2024"];

    // Filtrar por mes si está seleccionado
    let filteredMonthData = yearData;
    if (monthFilter && monthFilter !== "all") {
      const monthIndex = parseInt(monthFilter) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        filteredMonthData = [yearData[monthIndex]];
      }
    }

    setPerformanceData(filteredMonthData);
  }, [
    yearFilter,
    monthFilter,
    weekFilter,
    distributionFilter,
    selectedEmployee,
  ]);

  // Renderizar embudos cuando cambien los datos
  useEffect(() => {
    // Usar setTimeout para asegurar que CanvasJS esté disponible
    const timer = setTimeout(() => {
      try {
        renderFunnelChart();
        renderPostSaleFunnelChart();
      } catch (error) {
        console.error("Error al renderizar embudos:", error);
      }
    }, 300); // Aumentado el tiempo para asegurar que CanvasJS esté completamente cargado

    return () => clearTimeout(timer);
  }, [filteredData]);

  // Script para cargar CanvasJS
  useEffect(() => {
    const loadCanvasJS = () => {
      if (!window.CanvasJS) {
        const script = document.createElement("script");
        script.src = "https://cdn.canvasjs.com/canvasjs.min.js";
        script.async = true;
        script.onload = () => {
          setTimeout(() => {
            try {
              renderFunnelChart();
              renderPostSaleFunnelChart();
            } catch (error) {
              console.error(
                "Error al renderizar embudos después de cargar CanvasJS:",
                error
              );
            }
          }, 500);
        };
        document.body.appendChild(script);

        return () => {
          if (script.parentNode) {
            document.body.removeChild(script);
          }
        };
      } else {
        renderFunnelChart();
        renderPostSaleFunnelChart();
      }
    };

    loadCanvasJS();
  }, []);

  // Componente para las tarjetas de KPI con diseño minimalista moderno
  const KPICard = ({ data }) => (
    <div
      className={`${data.color} rounded-lg p-3 text-center transition-all duration-300 hover:shadow-lg flex flex-col h-32 justify-center`}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div className="text-3xl font-bold mb-1">{data.value}</div>
      <div className="text-sm font-semibold mb-1">{data.title}</div>
      <div className="text-xs opacity-80 mb-1">{data.target}</div>
      <div className="text-xs opacity-80">{data.description}</div>
    </div>
  );

  // Función para mostrar el estado del vendedor
  const getStatusBadge = (status) => {
    switch (status) {
      case "star":
        return (
          <Badge color="yellow" variant="filled">
            ⭐ Destacado
          </Badge>
        );
      case "active":
        return (
          <Badge color="green" variant="filled">
            ✓ Activo
          </Badge>
        );
      case "warning":
        return (
          <Badge color="red" variant="filled">
            ⚠️ Atención
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Cabecera con título */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard de Rendimiento
        </h1>
        <p className="text-gray-500">
          Análisis de métricas de ventas y seguimiento de KPIs
        </p>
      </div>

      {/* Filtros con diseño moderno */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center mb-4">
          <IconFilter size={18} className="mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Año
            </label>
            <Select
              placeholder="Seleccionar año"
              value={yearFilter}
              onChange={setYearFilter}
              data={[
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
                { value: "2026", label: "2026" },
              ]}
              className="w-full"
              rightSection={<IconChevronDown size={14} />}
              styles={{
                input: {
                  backgroundColor: "white",
                  borderColor: "#e5e7eb",
                  height: "38px",
                },
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Mes
            </label>
            <Select
              placeholder="Seleccionar mes"
              value={monthFilter}
              onChange={setMonthFilter}
              data={[
                { value: "all", label: "Todos" },
                { value: "01", label: "Enero" },
                { value: "02", label: "Febrero" },
                { value: "03", label: "Marzo" },
                { value: "04", label: "Abril" },
                { value: "05", label: "Mayo" },
                { value: "06", label: "Junio" },
                { value: "07", label: "Julio" },
                { value: "08", label: "Agosto" },
                { value: "09", label: "Septiembre" },
                { value: "10", label: "Octubre" },
                { value: "11", label: "Noviembre" },
                { value: "12", label: "Diciembre" },
              ]}
              className="w-full"
              rightSection={<IconChevronDown size={14} />}
              styles={{
                input: {
                  backgroundColor: "white",
                  borderColor: "#e5e7eb",
                  height: "38px",
                },
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Semana
            </label>
            <Select
              placeholder="Seleccionar semana"
              value={weekFilter}
              onChange={setWeekFilter}
              data={[
                { value: "all", label: "Todas" },
                { value: "1", label: "Semana 1" },
                { value: "2", label: "Semana 2" },
                { value: "3", label: "Semana 3" },
                { value: "4", label: "Semana 4" },
                { value: "5", label: "Semana 5" },
              ]}
              className="w-full"
              rightSection={<IconChevronDown size={14} />}
              styles={{
                input: {
                  backgroundColor: "white",
                  borderColor: "#e5e7eb",
                  height: "38px",
                },
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Distribución
            </label>
            <Select
              placeholder="Seleccionar distribución"
              value={distributionFilter}
              onChange={setDistributionFilter}
              data={[
                { value: "all", label: "Todos" },
                { value: "dist1", label: "Distribución 1" },
                { value: "dist2", label: "Distribución 2" },
                { value: "dist3", label: "Distribución 3" },
              ]}
              className="w-full"
              rightSection={<IconChevronDown size={14} />}
              styles={{
                input: {
                  backgroundColor: "white",
                  borderColor: "#e5e7eb",
                  height: "38px",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Métricas principales en tarjetas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="text-sm text-gray-500 mb-1">Datos</div>
          <div className="text-3xl font-bold text-blue-500 mb-1">
            {filteredData.datos}
          </div>
          <div className="text-xs text-gray-400">Contactos totales</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="text-sm text-gray-500 mb-1">Citas</div>
          <div className="text-3xl font-bold text-indigo-500 mb-1">
            {filteredData.citas}
          </div>
          <div className="text-xs text-gray-400">Agendadas en periodo</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="text-sm text-gray-500 mb-1">Demos</div>
          <div className="text-3xl font-bold text-pink-500 mb-1">
            {filteredData.demos}
          </div>
          <div className="text-xs text-gray-400">Presentaciones realizadas</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="text-sm text-gray-500 mb-1">Ventas</div>
          <div className="text-3xl font-bold text-amber-500 mb-1">
            {filteredData.ventas}
          </div>
          <div className="text-xs text-gray-400">Conversiones totales</div>
        </div>
      </div>

      {/* Lista de empleados */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IconUsers size={18} className="mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">Equipo de Ventas</h2>
          </div>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg pl-8 text-sm"
            />
            <IconSearch
              size={16}
              className="absolute left-2.5 top-2.5 text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendedores.map((vendedor, index) => (
                <tr
                  key={index}
                  className={`${
                    selectedEmployee &&
                    selectedEmployee.nombre === vendedor.nombre
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  } cursor-pointer transition-colors duration-200`}
                  onClick={() => handleEmployeeClick(vendedor)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {vendedor.nombre.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {vendedor.nombre}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vendedor.performance}% rendimiento
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      vendedor.datos > 150
                        ? "text-green-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {vendedor.datos}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vendedor.citas}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vendedor.demos}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vendedor.ventas}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {getStatusBadge(vendedor.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPIs - NUEVOS CLIENTES */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold">KPIs Nuevos Clientes</h2>
          {selectedEmployee && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {selectedEmployee.nombre}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} data={kpi} />
          ))}
        </div>
      </div>

      {/* KPIs - POSTVENTA */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">KPIs Postventa</h2>
        <div className="grid grid-cols-2 gap-3">
          {postSaleKpiData.map((kpi, index) => (
            <KPICard key={index} data={kpi} />
          ))}
        </div>
      </div>

      {/* Gráficos de Embudo con CanvasJS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Embudo de nuevos clientes */}
        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Funnel Nuevos Clientes
            </h3>
            <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
              <div className="text-xs text-gray-500 mb-1">% de cierre</div>
              <div className="text-2xl font-bold text-amber-500">
                {closeRateData.percentage}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Ticket promedio</div>
            <div className="text-2xl font-bold text-gray-800">
              ${closeRateData.ticketValue}
            </div>
          </div>

          {/* Contenedor para el gráfico de embudo con CanvasJS */}
          <div
            ref={funnelChartRef}
            className="w-full"
            style={{ height: "250px" }}
          ></div>
        </div>

        {/* Embudo de postventa */}
        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Funnel Postventa
            </h3>
            <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
              <div className="text-xs text-gray-500 mb-1">% cierre PV</div>
              <div className="text-2xl font-bold text-purple-500">
                {postSaleCloseRateData.percentage}
              </div>
            </div>
          </div>

          {/* Contenedor para el gráfico de embudo postventa con CanvasJS */}
          <div
            ref={postSaleFunnelChartRef}
            className="w-full"
            style={{ height: "250px" }}
          ></div>
        </div>
      </div>

      {/* Gráfico de rendimiento mensual */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 transition-all hover:shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Rendimiento Mensual
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                border: "none",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#F59E0B"
              fill="#FEF3C7"
              name="Ventas"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="meta"
              stroke="#10B981"
              fill="#D1FAE5"
              name="Meta"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos circulares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Distribución de Demos
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Finalizados", value: filteredData.demos },
                  {
                    name: "Sin finalizar",
                    value: Math.max(0, filteredData.citas - filteredData.demos),
                  },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                <Cell fill="#EC4899" />
                <Cell fill="#60A5FA" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  border: "none",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Distribución de Ventas
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Nuevos Clientes", value: filteredData.ventas },
                  { name: "Postventa", value: filteredData.ventasPV },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                <Cell fill="#F59E0B" />
                <Cell fill="#10B981" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  border: "none",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mensaje cuando hay empleado seleccionado */}
      {selectedEmployee && (
        <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm border border-blue-100 mb-6">
          <div className="font-medium">
            Datos filtrados para: {selectedEmployee.nombre}
          </div>
          <div className="text-xs mt-1">
            Haz clic nuevamente en el vendedor para ver datos generales
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePage;
