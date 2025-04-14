import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Title,
  Select,
  Text,
  Group,
  Button,
  Badge,
} from "@mantine/core";
import {
  IconChevronDown,
  IconCalendar,
  IconDownload,
  IconRefresh,
  IconFilter,
  IconUsers,
  IconSearch,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

// Datos por año para hacer la página dinámica
const dataByYear = {
  2024: {
    newClients: {
      kpis: [
        {
          title: "Citas vs Demos",
          value: "1,8",
          description: "¿Cuántas citas para 1 demo?",
          target: "VR: menor a 2",
          icon: "📋",
          color: "bg-yellow-400",
        },
        {
          title: "Datos vs Citas",
          value: "4,8",
          description: "¿Cuántos datos para 1 cita?",
          target: "VR: menor a 4",
          icon: "📊",
          color: "bg-red-400",
        },
        {
          title: "Datos vs Ventas",
          value: "15,2",
          description: "¿Cuántos datos para 1 Venta?",
          target: "VR: menor a 14",
          icon: "💰",
          color: "bg-red-400",
        },
        {
          title: "Demo vs Venta",
          value: "2,1",
          description: "¿Cuántas demos para 1 Venta?",
          target: "VR: menor a 2",
          icon: "🎯",
          color: "bg-yellow-400",
        },
      ],
      funnel: {
        totalLeads: 480,
        leads_label: "Datos",
        meetings: 100,
        meetings_label: "Citas",
        demos: 56,
        demos_label: "Demos",
        sales: 27,
        sales_label: "Ventas",
        closeRate: 48,
        avgTicket: 496.24,
      },
      vendorData: [
        {
          nombre: "Isabel Jauregui",
          datos: 480,
          citas: 100,
          demos: 56,
          ventas: 27,
          performance: 95,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,7",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "4,8",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-red-400",
            },
            {
              title: "Datos vs Ventas",
              value: "17,8",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-red-400",
            },
            {
              title: "Demo vs Venta",
              value: "2,1",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 480,
            leads_label: "Datos",
            meetings: 100,
            meetings_label: "Citas",
            demos: 56,
            demos_label: "Demos",
            sales: 27,
            sales_label: "Ventas",
            closeRate: 48,
            avgTicket: 510.75,
          },
        },
        {
          nombre: "Eloy Giordano",
          datos: 410,
          citas: 130,
          demos: 92,
          ventas: 74,
          performance: 86,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,2",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "5,5",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "1,2",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 410,
            leads_label: "Datos",
            meetings: 130,
            meetings_label: "Citas",
            demos: 92,
            demos_label: "Demos",
            sales: 74,
            sales_label: "Ventas",
            closeRate: 80,
            avgTicket: 476.5,
          },
        },
        {
          nombre: "Melisa Arias",
          datos: 320,
          citas: 82,
          demos: 58,
          ventas: 21,
          performance: 78,
          tendencia: "down",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,9",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "15,2",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-red-400",
            },
            {
              title: "Demo vs Venta",
              value: "2,8",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 320,
            leads_label: "Datos",
            meetings: 82,
            meetings_label: "Citas",
            demos: 58,
            demos_label: "Demos",
            sales: 21,
            sales_label: "Ventas",
            closeRate: 36,
            avgTicket: 485.9,
          },
        },
        {
          nombre: "Juan Benzi",
          datos: 290,
          citas: 75,
          demos: 43,
          ventas: 19,
          performance: 75,
          tendencia: "down",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,7",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,9",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "15,3",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-red-400",
            },
            {
              title: "Demo vs Venta",
              value: "2,3",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 290,
            leads_label: "Datos",
            meetings: 75,
            meetings_label: "Citas",
            demos: 43,
            demos_label: "Demos",
            sales: 19,
            sales_label: "Ventas",
            closeRate: 44,
            avgTicket: 463.25,
          },
        },
      ],
    },
    postSale: {
      kpis: [
        {
          title: "Cita vs Demo PV",
          value: "1,4",
          description: "Citas a demos postventa",
          target: "VR: menor a 1.5",
          icon: "🔄",
          color: "bg-green-400",
        },
        {
          title: "Demo vs Venta PV",
          value: "2,3",
          description: "Demos a ventas postventa",
          target: "VR: menor a 2",
          icon: "🔄",
          color: "bg-yellow-400",
        },
      ],
      funnel: {
        totalLeads: 68,
        leads_label: "Citas Postventa",
        meetings: 49,
        meetings_label: "Demos Postventa",
        sales: 21,
        sales_label: "Venta postventa",
        closeRate: 43,
      },
      vendorData: [
        {
          nombre: "Isabel Jauregui",
          citas: 68,
          demos: 49,
          ventas: 21,
          performance: 92,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,4",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,3",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 68,
            leads_label: "Citas Postventa",
            meetings: 49,
            meetings_label: "Demos Postventa",
            sales: 21,
            sales_label: "Venta postventa",
            closeRate: 43,
          },
        },
        {
          nombre: "Eloy Giordano",
          citas: 62,
          demos: 43,
          ventas: 19,
          performance: 85,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,4",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,3",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 62,
            leads_label: "Citas Postventa",
            meetings: 43,
            meetings_label: "Demos Postventa",
            sales: 19,
            sales_label: "Venta postventa",
            closeRate: 44,
          },
        },
        {
          nombre: "Melisa Arias",
          citas: 56,
          demos: 37,
          ventas: 16,
          performance: 78,
          tendencia: "down",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,5",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-yellow-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,3",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 56,
            leads_label: "Citas Postventa",
            meetings: 37,
            meetings_label: "Demos Postventa",
            sales: 16,
            sales_label: "Venta postventa",
            closeRate: 43,
          },
        },
        {
          nombre: "Juan Benzi",
          citas: 49,
          demos: 32,
          ventas: 13,
          performance: 74,
          tendencia: "down",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,5",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-yellow-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,5",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 49,
            leads_label: "Citas Postventa",
            meetings: 32,
            meetings_label: "Demos Postventa",
            sales: 13,
            sales_label: "Venta postventa",
            closeRate: 41,
          },
        },
      ],
    },
  },
  2025: {
    newClients: {
      kpis: [
        {
          title: "Citas vs Demos",
          value: "1,6",
          description: "¿Cuántas citas para 1 demo?",
          target: "VR: menor a 2",
          icon: "📋",
          color: "bg-green-400",
        },
        {
          title: "Datos vs Citas",
          value: "4,5",
          description: "¿Cuántos datos para 1 cita?",
          target: "VR: menor a 4",
          icon: "📊",
          color: "bg-yellow-400",
        },
        {
          title: "Datos vs Ventas",
          value: "13,9",
          description: "¿Cuántos datos para 1 Venta?",
          target: "VR: menor a 14",
          icon: "💰",
          color: "bg-green-400",
        },
        {
          title: "Demo vs Venta",
          value: "1,9",
          description: "¿Cuántas demos para 1 Venta?",
          target: "VR: menor a 2",
          icon: "🎯",
          color: "bg-green-400",
        },
      ],
      funnel: {
        totalLeads: 530,
        leads_label: "Datos",
        meetings: 117,
        meetings_label: "Citas",
        demos: 74,
        demos_label: "Demos",
        sales: 38,
        sales_label: "Ventas",
        closeRate: 51,
        avgTicket: 518.46,
      },
      vendorData: [
        {
          nombre: "Isabel Jauregui",
          datos: 530,
          citas: 117,
          demos: 74,
          ventas: 38,
          performance: 98,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,6",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "4,5",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-yellow-400",
            },
            {
              title: "Datos vs Ventas",
              value: "13,9",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "1,9",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 530,
            leads_label: "Datos",
            meetings: 117,
            meetings_label: "Citas",
            demos: 74,
            demos_label: "Demos",
            sales: 38,
            sales_label: "Ventas",
            closeRate: 51,
            avgTicket: 518.46,
          },
        },
        {
          nombre: "Eloy Giordano",
          datos: 456,
          citas: 143,
          demos: 103,
          ventas: 83,
          performance: 90,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,2",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "5,5",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "1,2",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 456,
            leads_label: "Datos",
            meetings: 143,
            meetings_label: "Citas",
            demos: 103,
            demos_label: "Demos",
            sales: 83,
            sales_label: "Ventas",
            closeRate: 81,
            avgTicket: 504.87,
          },
        },
        {
          nombre: "Melisa Arias",
          datos: 339,
          citas: 90,
          demos: 63,
          ventas: 24,
          performance: 82,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,8",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "14,1",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-red-400",
            },
            {
              title: "Demo vs Venta",
              value: "2,6",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 339,
            leads_label: "Datos",
            meetings: 90,
            meetings_label: "Citas",
            demos: 63,
            demos_label: "Demos",
            sales: 24,
            sales_label: "Ventas",
            closeRate: 38,
            avgTicket: 495.75,
          },
        },
        {
          nombre: "Juan Benzi",
          datos: 310,
          citas: 82,
          demos: 51,
          ventas: 22,
          performance: 78,
          tendencia: "down",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,6",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,8",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "14,1",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-red-400",
            },
            {
              title: "Demo vs Venta",
              value: "2,3",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 310,
            leads_label: "Datos",
            meetings: 82,
            meetings_label: "Citas",
            demos: 51,
            demos_label: "Demos",
            sales: 22,
            sales_label: "Ventas",
            closeRate: 43,
            avgTicket: 486.32,
          },
        },
      ],
    },
    postSale: {
      kpis: [
        {
          title: "Cita vs Demo PV",
          value: "1,3",
          description: "Citas a demos postventa",
          target: "VR: menor a 1.5",
          icon: "🔄",
          color: "bg-green-400",
        },
        {
          title: "Demo vs Venta PV",
          value: "2,1",
          description: "Demos a ventas postventa",
          target: "VR: menor a 2",
          icon: "🔄",
          color: "bg-yellow-400",
        },
      ],
      funnel: {
        totalLeads: 75,
        leads_label: "Citas Postventa",
        meetings: 58,
        meetings_label: "Demos Postventa",
        sales: 28,
        sales_label: "Venta postventa",
        closeRate: 48,
      },
      vendorData: [
        {
          nombre: "Isabel Jauregui",
          citas: 75,
          demos: 58,
          ventas: 28,
          performance: 95,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,3",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,1",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 75,
            leads_label: "Citas Postventa",
            meetings: 58,
            meetings_label: "Demos Postventa",
            sales: 28,
            sales_label: "Venta postventa",
            closeRate: 48,
          },
        },
        {
          nombre: "Eloy Giordano",
          citas: 68,
          demos: 52,
          ventas: 24,
          performance: 88,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,3",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,2",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 68,
            leads_label: "Citas Postventa",
            meetings: 52,
            meetings_label: "Demos Postventa",
            sales: 24,
            sales_label: "Venta postventa",
            closeRate: 46,
          },
        },
        {
          nombre: "Melisa Arias",
          citas: 62,
          demos: 45,
          ventas: 21,
          performance: 82,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,4",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,1",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 62,
            leads_label: "Citas Postventa",
            meetings: 45,
            meetings_label: "Demos Postventa",
            sales: 21,
            sales_label: "Venta postventa",
            closeRate: 47,
          },
        },
        {
          nombre: "Juan Benzi",
          citas: 54,
          demos: 38,
          ventas: 16,
          performance: 76,
          tendencia: "down",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,4",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,4",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-red-400",
            },
          ],
          funnel: {
            totalLeads: 54,
            leads_label: "Citas Postventa",
            meetings: 38,
            meetings_label: "Demos Postventa",
            sales: 16,
            sales_label: "Venta postventa",
            closeRate: 42,
          },
        },
      ],
    },
  },
  2026: {
    newClients: {
      kpis: [
        {
          title: "Citas vs Demos",
          value: "1,4",
          description: "¿Cuántas citas para 1 demo?",
          target: "VR: menor a 2",
          icon: "📋",
          color: "bg-green-400",
        },
        {
          title: "Datos vs Citas",
          value: "4,2",
          description: "¿Cuántos datos para 1 cita?",
          target: "VR: menor a 4",
          icon: "📊",
          color: "bg-green-400",
        },
        {
          title: "Datos vs Ventas",
          value: "12,5",
          description: "¿Cuántos datos para 1 Venta?",
          target: "VR: menor a 14",
          icon: "💰",
          color: "bg-green-400",
        },
        {
          title: "Demo vs Venta",
          value: "1,7",
          description: "¿Cuántas demos para 1 Venta?",
          target: "VR: menor a 2",
          icon: "🎯",
          color: "bg-green-400",
        },
      ],
      funnel: {
        totalLeads: 580,
        leads_label: "Datos",
        meetings: 138,
        meetings_label: "Citas",
        demos: 98,
        demos_label: "Demos",
        sales: 46,
        sales_label: "Ventas",
        closeRate: 57,
        avgTicket: 542.18,
      },
      vendorData: [
        {
          nombre: "Isabel Jauregui",
          datos: 580,
          citas: 138,
          demos: 98,
          ventas: 46,
          performance: 99,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "4,2",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "12,5",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "1,7",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 580,
            leads_label: "Datos",
            meetings: 138,
            meetings_label: "Citas",
            demos: 98,
            demos_label: "Demos",
            sales: 46,
            sales_label: "Ventas",
            closeRate: 57,
            avgTicket: 542.18,
          },
        },
        {
          nombre: "Eloy Giordano",
          datos: 495,
          citas: 165,
          demos: 118,
          ventas: 96,
          performance: 94,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,0",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "5,1",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "1,2",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 495,
            leads_label: "Datos",
            meetings: 165,
            meetings_label: "Citas",
            demos: 118,
            demos_label: "Demos",
            sales: 96,
            sales_label: "Ventas",
            closeRate: 81,
            avgTicket: 523.65,
          },
        },
        {
          nombre: "Melisa Arias",
          datos: 362,
          citas: 102,
          demos: 72,
          ventas: 38,
          performance: 85,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,4",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,5",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "9,5",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "1,9",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 362,
            leads_label: "Datos",
            meetings: 102,
            meetings_label: "Citas",
            demos: 72,
            demos_label: "Demos",
            sales: 38,
            sales_label: "Ventas",
            closeRate: 53,
            avgTicket: 512.8,
          },
        },
        {
          nombre: "Juan Benzi",
          datos: 334,
          citas: 94,
          demos: 64,
          ventas: 31,
          performance: 82,
          tendencia: "up",
          kpis: [
            {
              title: "Citas vs Demos",
              value: "1,5",
              description: "¿Cuántas citas para 1 demo?",
              target: "VR: menor a 2",
              icon: "📋",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Citas",
              value: "3,6",
              description: "¿Cuántos datos para 1 cita?",
              target: "VR: menor a 4",
              icon: "📊",
              color: "bg-green-400",
            },
            {
              title: "Datos vs Ventas",
              value: "10,8",
              description: "¿Cuántos datos para 1 Venta?",
              target: "VR: menor a 14",
              icon: "💰",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta",
              value: "2,1",
              description: "¿Cuántas demos para 1 Venta?",
              target: "VR: menor a 2",
              icon: "🎯",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 334,
            leads_label: "Datos",
            meetings: 94,
            meetings_label: "Citas",
            demos: 64,
            demos_label: "Demos",
            sales: 31,
            sales_label: "Ventas",
            closeRate: 48,
            avgTicket: 498.35,
          },
        },
      ],
    },
    postSale: {
      kpis: [
        {
          title: "Cita vs Demo PV",
          value: "1,2",
          description: "Citas a demos postventa",
          target: "VR: menor a 1.5",
          icon: "🔄",
          color: "bg-green-400",
        },
        {
          title: "Demo vs Venta PV",
          value: "1,8",
          description: "Demos a ventas postventa",
          target: "VR: menor a 2",
          icon: "🔄",
          color: "bg-green-400",
        },
      ],
      funnel: {
        totalLeads: 82,
        leads_label: "Citas Postventa",
        meetings: 68,
        meetings_label: "Demos Postventa",
        sales: 37,
        sales_label: "Venta postventa",
        closeRate: 54,
      },
      vendorData: [
        {
          nombre: "Isabel Jauregui",
          citas: 82,
          demos: 68,
          ventas: 37,
          performance: 97,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,2",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "1,8",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 82,
            leads_label: "Citas Postventa",
            meetings: 68,
            meetings_label: "Demos Postventa",
            sales: 37,
            sales_label: "Venta postventa",
            closeRate: 54,
          },
        },
        {
          nombre: "Eloy Giordano",
          citas: 74,
          demos: 62,
          ventas: 32,
          performance: 92,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,2",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "1,9",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 74,
            leads_label: "Citas Postventa",
            meetings: 62,
            meetings_label: "Demos Postventa",
            sales: 32,
            sales_label: "Venta postventa",
            closeRate: 52,
          },
        },
        {
          nombre: "Melisa Arias",
          citas: 68,
          demos: 54,
          ventas: 28,
          performance: 86,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,3",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "1,9",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-green-400",
            },
          ],
          funnel: {
            totalLeads: 68,
            leads_label: "Citas Postventa",
            meetings: 54,
            meetings_label: "Demos Postventa",
            sales: 28,
            sales_label: "Venta postventa",
            closeRate: 52,
          },
        },
        {
          nombre: "Juan Benzi",
          citas: 60,
          demos: 46,
          ventas: 23,
          performance: 82,
          tendencia: "up",
          kpis: [
            {
              title: "Cita vs Demo PV",
              value: "1,3",
              description: "Citas a demos postventa",
              target: "VR: menor a 1.5",
              icon: "🔄",
              color: "bg-green-400",
            },
            {
              title: "Demo vs Venta PV",
              value: "2,0",
              description: "Demos a ventas postventa",
              target: "VR: menor a 2",
              icon: "🔄",
              color: "bg-yellow-400",
            },
          ],
          funnel: {
            totalLeads: 60,
            leads_label: "Citas Postventa",
            meetings: 46,
            meetings_label: "Demos Postventa",
            sales: 23,
            sales_label: "Venta postventa",
            closeRate: 50,
          },
        },
      ],
    },
  },
};

// Lista de vendedores para el filtro del select
const vendorsData = [
  { value: "all", label: "Todos los vendedores" },
  { value: "1", label: "Isabel Jauregui" },
  { value: "2", label: "Eloy Giordano" },
  { value: "3", label: "Melisa Arias" },
  { value: "4", label: "Juan Benzi" },
];

// Componente personalizado para las tarjetas de KPI
const KpiCard = ({ data }) => (
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

// Componente personalizado para el embudo de ventas
const SalesFunnel = ({ data, type }) => {
  const funnelRef = useRef(null);

  useEffect(() => {
    if (window.CanvasJS && funnelRef.current) {
      renderFunnelChart();
    }
  }, [data, type]);

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
            } catch (error) {
              console.error("Error al renderizar embudo:", error);
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
      }
    };

    loadCanvasJS();
  }, []);

  const renderFunnelChart = () => {
    if (window.CanvasJS && funnelRef.current) {
      const chart = new window.CanvasJS.Chart(funnelRef.current, {
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
            dataPoints:
              type === "nuevos"
                ? [
                    {
                      y: data.totalLeads || 0,
                      label: data.leads_label || "Datos",
                      color: "#60A5FA",
                    },
                    {
                      y: data.meetings || 0,
                      label: data.meetings_label || "Citas",
                      color: "#93C5FD",
                    },
                    {
                      y: data.demos || 0,
                      label: data.demos_label || "Demos",
                      color: "#EC4899",
                    },
                    {
                      y: data.sales || 0,
                      label: data.sales_label || "Ventas",
                      color: "#FBBF24",
                    },
                  ]
                : [
                    {
                      y: data.totalLeads || 0,
                      label: data.leads_label || "Citas Postventa",
                      color: "#60A5FA",
                    },
                    {
                      y: data.meetings || 0,
                      label: data.meetings_label || "Demos Postventa",
                      color: "#93C5FD",
                    },
                    {
                      y: data.sales || 0,
                      label: data.sales_label || "Venta postventa",
                      color: "#EC4899",
                    },
                  ],
          },
        ],
        legend: {
          verticalAlign: "bottom",
          horizontalAlign: "center",
        },
      });

      // Calcular porcentajes
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Embudo de {type === "nuevos" ? "Nuevos Clientes" : "Postventa"}
        </h3>
        <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
          <div className="text-xs text-gray-500 mb-1">% de cierre</div>
          <div className="text-2xl font-bold text-amber-500">
            {data.closeRate || 0}%
          </div>
        </div>
      </div>

      {type === "nuevos" && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Ticket promedio</div>
          <div className="text-2xl font-bold text-gray-800">
            {data.avgTicket || 0}
          </div>
        </div>
      )}

      {/* Contenedor para el gráfico de embudo con CanvasJS */}
      <div ref={funnelRef} className="w-full" style={{ height: "300px" }}></div>
    </div>
  );
};

const FunnelPage = () => {
  // Estados para filtros y tipo de embudo
  const [yearFilter, setYearFilter] = useState("2025");
  const [monthFilter, setMonthFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [funnelType, setFunnelType] = useState("nuevos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Estado para los datos actuales filtrados
  const [currentData, setCurrentData] = useState({
    kpis: [],
    funnel: {},
    filteredVendors: [],
  });

  // Efecto para actualizar datos cuando cambian los filtros
  useEffect(() => {
    // Obtener los datos del año seleccionado (con valor por defecto)
    const yearData = dataByYear[yearFilter] || dataByYear["2025"];

    if (!yearData) {
      console.error("No data available for selected year");
      return;
    }

    // Obtener los datos del tipo seleccionado (nuevos clientes o postventa)
    const typeData =
      funnelType === "nuevos" ? yearData.newClients : yearData.postSale;

    if (!typeData) {
      console.error("No data available for selected type");
      return;
    }

    // Obtener los vendedores y filtrar por término de búsqueda
    let filteredVendors = [];
    if (typeData.vendorData && Array.isArray(typeData.vendorData)) {
      filteredVendors = typeData.vendorData.filter((vendor) =>
        vendor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Si hay un vendedor seleccionado, usar sus datos específicos
    if (selectedVendor) {
      // Buscar al vendedor actualizado (en caso de cambio de año/tipo)
      const updatedVendor = filteredVendors.find(
        (v) => v.nombre === selectedVendor.nombre
      );

      if (updatedVendor) {
        setCurrentData({
          kpis: updatedVendor.kpis || typeData.kpis || [],
          funnel: updatedVendor.funnel || typeData.funnel || {},
          filteredVendors: filteredVendors,
        });
      } else {
        // Si el vendedor ya no existe en el nuevo filtro, deseleccionarlo
        setSelectedVendor(null);
        setCurrentData({
          kpis: typeData.kpis || [],
          funnel: typeData.funnel || {},
          filteredVendors: filteredVendors,
        });
      }
    } else {
      // Usar datos generales si no hay vendedor seleccionado
      setCurrentData({
        kpis: typeData.kpis || [],
        funnel: typeData.funnel || {},
        filteredVendors: filteredVendors,
      });
    }
  }, [yearFilter, funnelType, searchTerm, selectedVendor]);

  // Función para manejar clic en un vendedor
  const handleVendorClick = (vendor) => {
    if (selectedVendor && selectedVendor.nombre === vendor.nombre) {
      // Deseleccionar
      setSelectedVendor(null);
    } else {
      // Seleccionar nuevo vendedor
      setSelectedVendor(vendor);

      // Actualizar el filtro del select de vendedor
      const vendorOption = vendorsData.find((v) => v.label === vendor.nombre);
      if (vendorOption) {
        setVendorFilter(vendorOption.value);
      }
    }
  };

  // Función para mostrar tendencia del vendedor
  const getTrendBadge = (trend) => {
    switch (trend) {
      case "up":
        return (
          <Badge
            color="green"
            variant="dot"
            rightSection={<IconArrowUp size={14} />}
          >
            Tendencia positiva
          </Badge>
        );
      case "down":
        return (
          <Badge
            color="red"
            variant="dot"
            rightSection={<IconArrowDown size={14} />}
          >
            Tendencia negativa
          </Badge>
        );
      default:
        return null;
    }
  };

  // Efecto para actualizar el vendedor seleccionado cuando cambia vendorFilter desde el Select
  useEffect(() => {
    if (vendorFilter && vendorFilter !== "all") {
      // Encuentra el vendedor correspondiente al valor seleccionado
      const vendor = vendorsData.find((v) => v.value === vendorFilter);
      if (vendor) {
        // Busca los datos completos del vendedor
        const yearData = dataByYear[yearFilter] || dataByYear["2025"];
        if (yearData) {
          const typeData =
            funnelType === "nuevos" ? yearData.newClients : yearData.postSale;
          if (typeData && typeData.vendorData) {
            const vendorData = typeData.vendorData.find(
              (v) => v.nombre === vendor.label
            );

            if (vendorData) {
              setSelectedVendor(vendorData);
            }
          }
        }
      }
    } else {
      // Si se selecciona "Todos los vendedores", deseleccionar vendedor específico
      setSelectedVendor(null);
    }
  }, [vendorFilter, yearFilter, funnelType]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Cabecera con título y botones de acción */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Embudo de Ventas</h1>
          <p className="text-gray-500">
            Análisis y seguimiento del proceso de ventas
          </p>
        </div>
        <Group>
          <Button
            leftSection={<IconDownload size={16} />}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            Exportar Datos
          </Button>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="filled"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Actualizar
          </Button>
        </Group>
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
              onChange={(value) => {
                setYearFilter(value);
                // Resetear el vendedor seleccionado al cambiar el año
                setSelectedVendor(null);
                setVendorFilter("");
              }}
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
              icon={<IconCalendar size={14} />}
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
              Vendedor
            </label>
            <Select
              placeholder="Seleccionar vendedor"
              value={vendorFilter}
              onChange={setVendorFilter}
              data={vendorsData}
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

      {/* Selector de tipo de embudo - Nuevo diseño con pestañas */}
      <div className="flex w-full mb-6 bg-white rounded-xl overflow-hidden shadow-sm">
        <button
          className={`flex-1 py-3 px-4 font-medium text-center transition-all ${
            funnelType === "nuevos"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => {
            setFunnelType("nuevos");
            setSelectedVendor(null); // Reset al cambiar de tipo
            setVendorFilter("");
          }}
        >
          Nuevos Clientes
        </button>
        <button
          className={`flex-1 py-3 px-4 font-medium text-center transition-all ${
            funnelType === "postventa"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => {
            setFunnelType("postventa");
            setSelectedVendor(null); // Reset al cambiar de tipo
            setVendorFilter("");
          }}
        >
          Postventa
        </button>
      </div>

      {/* Sección de KPIs con animación */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={`${funnelType}-${selectedVendor?.nombre || "general"}`} // Para que se anime al cambiar el tipo o vendedor
        >
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold">
              KPIs {funnelType === "nuevos" ? "Nuevos Clientes" : "Postventa"}
            </h2>
            {selectedVendor && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {selectedVendor.nombre}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentData.kpis.map((kpi, index) => (
              <KpiCard key={index} data={kpi} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Búsqueda de vendedores */}
      <div className="relative w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Buscar vendedor..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // Resetear filtro de vendedor cuando se usa búsqueda
            setVendorFilter("");
          }}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg pl-8 text-sm"
        />
        <IconSearch
          size={16}
          className="absolute left-2.5 top-2.5 text-gray-400"
        />
      </div>

      {/* Sección principal: Embudo + Tabla de vendedores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Componente del embudo */}
        <SalesFunnel type={funnelType} data={currentData.funnel} />

        {/* Tabla de detalle del embudo */}
        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Detalle por Vendedor
            </h3>
            <Badge color="blue" variant="light" size="sm">
              {currentData.filteredVendors.length} vendedores
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {funnelType === "nuevos" ? "Datos" : "Citas PV"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {funnelType === "nuevos" ? "Citas" : "Demos PV"}
                  </th>
                  {funnelType === "nuevos" && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demos
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.filteredVendors.map((vendor, index) => (
                  <tr
                    key={index}
                    className={`${
                      selectedVendor && selectedVendor.nombre === vendor.nombre
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-gray-50"
                    } cursor-pointer transition-colors duration-200`}
                    onClick={() => handleVendorClick(vendor)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {vendor.nombre.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.nombre}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vendor.performance}% rendimiento
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm ${
                        funnelType === "nuevos" && vendor.datos > 400
                          ? "text-green-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {funnelType === "nuevos" ? vendor.datos : vendor.citas}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {funnelType === "nuevos" ? vendor.citas : vendor.demos}
                    </td>
                    {funnelType === "nuevos" && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {vendor.demos}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {vendor.ventas}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getTrendBadge(vendor.tendencia)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paneles adicionales con métricas y visualización */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Panel de métricas clave */}
        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Métricas Clave
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">% de cierre</div>
              <div className="text-3xl font-bold text-blue-600">
                {currentData.funnel.closeRate || 0}%
              </div>
              <div className="text-xs text-gray-400 mt-1">Meta: 50%</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">
                {funnelType === "nuevos" ? "Total Demos" : "Demos Postventa"}
              </div>
              <div className="text-3xl font-bold text-pink-500">
                {funnelType === "nuevos"
                  ? currentData.funnel.demos || 0
                  : currentData.funnel.meetings || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Meta: {funnelType === "nuevos" ? "75" : "60"}
              </div>
            </div>
          </div>

          {funnelType === "nuevos" && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="text-sm text-gray-500 mb-1">Ticket promedio</div>
              <div className="text-3xl font-bold text-amber-500">
                ${currentData.funnel.avgTicket || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Meta: $500</div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Progreso de conversión</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${currentData.funnel.closeRate || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Panel de distribución visual */}
        <div className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Distribución de{" "}
            {funnelType === "nuevos" ? "Demos" : "Ventas Postventa"}
          </h3>

          <div className="flex items-center justify-center h-64">
            <div className="relative w-64 h-64">
              {/* Círculo exterior */}
              <div className="absolute inset-0 rounded-full bg-blue-100"></div>

              {/* Círculo medio */}
              <div
                className="absolute rounded-full bg-blue-300"
                style={{
                  top: "15%",
                  left: "15%",
                  right: "15%",
                  bottom: "15%",
                }}
              ></div>

              {/* Círculo interior */}
              <div
                className="absolute rounded-full bg-blue-500 flex items-center justify-center text-white"
                style={{
                  top: "30%",
                  left: "30%",
                  right: "30%",
                  bottom: "30%",
                }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {funnelType === "nuevos"
                      ? currentData.funnel.demos || 0
                      : currentData.funnel.sales || 0}
                  </div>
                  <div className="text-sm">
                    {funnelType === "nuevos" ? "Demos" : "Ventas PV"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Por completar</div>
              <div className="text-lg font-semibold">
                {funnelType === "nuevos"
                  ? Math.round((currentData.funnel.demos || 0) * 0.3)
                  : Math.round((currentData.funnel.sales || 0) * 0.2)}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">En proceso</div>
              <div className="text-lg font-semibold">
                {funnelType === "nuevos"
                  ? Math.round((currentData.funnel.demos || 0) * 0.5)
                  : Math.round((currentData.funnel.sales || 0) * 0.5)}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Completas</div>
              <div className="text-lg font-semibold">
                {funnelType === "nuevos"
                  ? Math.round((currentData.funnel.demos || 0) * 0.2)
                  : Math.round((currentData.funnel.sales || 0) * 0.3)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje cuando hay vendedor seleccionado */}
      {selectedVendor && (
        <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm border border-blue-100 mb-6">
          <div className="font-medium">
            Datos filtrados para: {selectedVendor.nombre}
          </div>
          <div className="text-xs mt-1">
            Haz clic nuevamente en el vendedor para ver datos generales
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelPage;
