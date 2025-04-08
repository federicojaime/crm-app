import React from 'react';
import { Paper, Title, Text } from '@mantine/core';

/**
 * Componente: BetterSalesFunnel
 *
 * @param {Object} props
 * @param {Object} props.data - Datos para el embudo de ventas.
 * @param {string} [props.type="nuevos"] - El tipo de embudo: 'nuevos' o 'postventa'.
 *
 * Estructura esperada en `data`:
 * {
 *   totalLeads: number,  //  Cantidad de la primera etapa
 *   meetings: number,    //  2da etapa
 *   demos: number,       //  3ra etapa
 *   sales: number,       //  4ta etapa
 *
 *   leads_label: string, //  "Datos" o "Citas PV" etc.
 *   meetings_label: string,
 *   demos_label: string,
 *   sales_label: string,
 *
 *   closeRate: number,   //  Porcentaje de cierre (0 a 100)
 *   avgTicket: number,   //  Solo para "nuevos"
 * }
 *
 * Ejemplo:
 * const dataExample = {
 *   totalLeads: 530,
 *   leads_label: 'Datos',
 *   meetings: 117,
 *   meetings_label: 'Citas',
 *   demos: 74,
 *   demos_label: 'Demos',
 *   sales: 38,
 *   sales_label: 'Ventas',
 *   closeRate: 51,
 *   avgTicket: 518.46,
 * };
 */
const BetterSalesFunnel = ({ data = {}, type = 'nuevos' }) => {
  // Aseguramos que existe un objeto data, aunque sea vacío:
  // Si data no tiene valores, definimos "0" para evitar fallos.
  const {
    totalLeads = 0,
    leads_label = 'Datos',
    meetings = 0,
    meetings_label = 'Citas',
    demos = 0,
    demos_label = 'Demos',
    sales = 0,
    sales_label = 'Ventas',
    closeRate = 0,
    avgTicket,
  } = data;

  // Función para calcular porcentaje relativo
  const calcPct = (val, base) => {
    if (!base) return 0;
    return ((val / base) * 100).toFixed(1);
  };

  // Arreglo de etapas (funnelStages) en orden
  const funnelStages = [
    { label: leads_label, value: totalLeads, color: 'bg-blue-200', textColor: 'text-blue-800' },
    { label: meetings_label, value: meetings, color: 'bg-green-200', textColor: 'text-green-800' },
    { label: demos_label, value: demos, color: 'bg-yellow-200', textColor: 'text-yellow-800' },
    { label: sales_label, value: sales, color: 'bg-pink-200', textColor: 'text-pink-800' },
  ];

  // Definimos anchos decrecientes para simular un embudo
  // ¡Asegúrate de tener la misma cantidad de ítems que en funnelStages!
  const widths = ['100%', '85%', '70%', '55%'];

  return (
    <Paper shadow="sm" p="lg" radius="md" className="relative h-full">
      {/* Cabecera: Título y % de cierre */}
      <div className="flex justify-between items-center mb-4">
        <Title order={4}>
          {type === 'nuevos' ? 'Embudo de Ventas - Nuevos Clientes' : 'Embudo de Ventas - Postventa'}
        </Title>
        <div className="bg-white border rounded-lg p-2">
          <Text size="xs" color="dimmed">
            % DE CIERRE
          </Text>
          <Title order={3}>
            {closeRate ?? 0}%
          </Title>
        </div>
      </div>

      {/* Contenedor principal del embudo */}
      <div className="flex flex-col items-center space-y-4 mt-4">
        {funnelStages.map((stage, i) => {
          const stagePct = calcPct(stage.value, funnelStages[0].value);
          // Creamos un trapezoide con clip-path
          return (
            <div
              key={stage.label}
              className={`
                relative 
                ${stage.color} 
                ${stage.textColor} 
                text-center 
                rounded 
                py-2 
                transition 
                duration-300 
                hover:shadow-lg 
                font-bold
              `}
              style={{
                width: widths[i] || '100%',
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
              }}
            >
              <div className="flex flex-col items-center text-sm leading-tight">
                <span className="text-lg font-extrabold mb-1">{stage.value}</span>
                <span className="text-xs">{stage.label}</span>
                <span className="text-[10px] font-normal">{stagePct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket promedio (solo si type === "nuevos") */}
      {type === 'nuevos' && avgTicket && (
        <div className="mt-4 bg-gray-50 p-4 text-center rounded">
          <Text size="sm" color="dimmed">
            Ticket de venta promedio
          </Text>
          <Title order={3}>
            ${avgTicket.toFixed(2)}
          </Title>
        </div>
      )}
    </Paper>
  );
};

export default BetterSalesFunnel;
