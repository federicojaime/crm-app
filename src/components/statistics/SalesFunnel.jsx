import React from 'react';
import { Paper, Title, Text } from '@mantine/core';

const SalesFunnel = ({ data, type = 'nuevos' }) => {
  // Lógica de tu embudo y estilos
  // ...
  // (Puedes usar el mismo que compartiste, o la versión refinada que prefieras)

  return (
    <Paper shadow="sm" p="lg" radius="md" className="relative h-full">
      {/* Título y % de cierre */}
      <div className="flex justify-between items-center mb-6">
        <Title order={3}>
          {type === 'nuevos' 
            ? 'Embudo de Ventas - Nuevos Clientes' 
            : 'Embudo de Ventas - Postventa'
          }
        </Title>
        <div className="bg-white border rounded-lg p-2">
          <Text size="sm" color="dimmed">% de Cierre</Text>
          <Title order={3}>{data.closeRate}%</Title>
        </div>
      </div>

      {/* Bloques del embudo */}
      <div className="relative w-full h-[400px] flex flex-col justify-center items-center">
        {/* Primer bloque: leads / citas postventa */}
        {/* ... resto de niveles ... */}
      </div>

      {/* Ticket promedio solo para "nuevos" */}
      {type === 'nuevos' && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-700">Ticket de venta promedio</div>
          <div className="text-2xl font-bold">${data.avgTicket}</div>
        </div>
      )}
    </Paper>
  );
};

export default SalesFunnel;
