// src/components/statistics/SalesFunnel.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paper, Title, Text, Group } from '@mantine/core';

const SalesFunnel = ({ type = 'nuevos', data }) => {
  // Por defecto usamos datos de ejemplo si no se proporcionan datos
  const defaultNewClientsData = {
    totalLeads: 530,
    leads_label: "Datos",
    meetings: 117,
    meetings_percentage: 22,
    meetings_label: "Citas",
    demos: 74,
    demos_percentage: 14,
    demos_label: "Demos",
    sales: 38,
    sales_percentage: 7,
    sales_label: "Ventas",
    closeRate: 51,
    avgTicket: 518.46
  };

  const defaultPostSaleData = {
    totalLeads: 75,
    leads_label: "Citas Postventa",
    meetings: 58,
    meetings_percentage: 77,
    meetings_label: "Demos Postventa",
    sales: 28,
    sales_percentage: 37,
    sales_label: "Venta postventa",
    closeRate: 48
  };

  // Usamos los datos proporcionados o los datos por defecto
  const funnelData = data || (type === 'nuevos' ? defaultNewClientsData : defaultPostSaleData);

  // Animaciones para cada nivel del embudo
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Iniciamos la animación poco después de que el componente se monte
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Paper p="lg" radius="md" shadow="sm" className="relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Title order={3} className="mb-2">
            {type === 'nuevos' ? 'Embudo de Ventas - Nuevos Clientes' : 'Embudo de Ventas - Postventa'}
          </Title>
          <Text color="dimmed" size="sm">
            {type === 'nuevos' 
              ? 'Conversión desde contactos hasta ventas finalizadas' 
              : 'Conversión desde citas de postventa hasta ventas adicionales'}
          </Text>
        </div>
        
        {/* Tasa de cierre */}
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="text-sm text-gray-700 mb-1">% de cierre</div>
          <div className="text-3xl font-bold">{funnelData.closeRate}%</div>
        </div>
      </div>

      {/* Visualización del embudo */}
      <div className="relative" style={{ height: '320px' }}>
        {/* Nivel 1: Datos */}
        <motion.div 
          className="absolute w-full top-0 bg-blue-400 py-4 rounded-t-lg text-center text-white"
          initial={{ height: '0px', opacity: 0 }}
          animate={{ 
            height: animated ? '80px' : '0px', 
            opacity: animated ? 1 : 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="font-bold">100% ({funnelData.totalLeads})</div>
          <div>{funnelData.leads_label}</div>
        </motion.div>
        
        {/* Nivel 2: Citas */}
        <motion.div 
          className="absolute w-3/4 left-[12.5%] top-[80px] bg-blue-300 py-4 text-center text-white"
          initial={{ height: '0px', opacity: 0 }}
          animate={{ 
            height: animated ? '70px' : '0px', 
            opacity: animated ? 1 : 0 
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="font-bold">{funnelData.meetings_percentage}% ({funnelData.meetings})</div>
          <div>{funnelData.meetings_label}</div>
        </motion.div>
        
        {/* Nivel 3: Demos */}
        {(type === 'nuevos' || (type === 'postventa' && funnelData.demos)) && (
          <motion.div 
            className="absolute w-1/2 left-1/4 top-[150px] bg-pink-400 py-4 text-center text-white"
            initial={{ height: '0px', opacity: 0 }}
            animate={{ 
              height: animated ? '70px' : '0px', 
              opacity: animated ? 1 : 0 
            }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="font-bold">{funnelData.demos_percentage}% ({funnelData.demos})</div>
            <div>{funnelData.demos_label}</div>
          </motion.div>
        )}
        
        {/* Nivel 4: Ventas */}
        <motion.div 
          className={`absolute ${type === 'nuevos' ? 'w-1/3 left-1/3 top-[220px]' : 'w-1/2 left-1/4 top-[150px]'} bg-yellow-400 py-4 text-center text-white`}
          initial={{ height: '0px', opacity: 0 }}
          animate={{ 
            height: animated ? '70px' : '0px', 
            opacity: animated ? 1 : 0 
          }}
          transition={{ duration: 0.8, delay: type === 'nuevos' ? 0.6 : 0.4, ease: "easeOut" }}
        >
          <div className="font-bold">{funnelData.sales_percentage}% ({funnelData.sales})</div>
          <div>{funnelData.sales_label}</div>
        </motion.div>
        
        {/* Conectores (líneas) entre niveles */}
        <svg className="absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
          {/* De Datos a Citas - triángulo */}
          <motion.path 
            d="M 0,80 L 62.5,80 L 187.5,150 L 312.5,150 L 437.5,80 L 500,80" 
            fill="rgb(96, 165, 250)"
            initial={{ opacity: 0 }}
            animate={{ opacity: animated ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          
          {type === 'nuevos' && (
            <>
              {/* De Citas a Demos - triángulo */}
              <motion.path 
                d="M 125,150 L 175,150 L 225,220 L 275,220 L 325,150 L 375,150" 
                fill="rgb(167, 139, 250)"
                initial={{ opacity: 0 }}
                animate={{ opacity: animated ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              
              {/* De Demos a Ventas - triángulo */}
              <motion.path 
                d="M 175,220 L 208.3,220 L 227.8,290 L 272.2,290 L 291.7,220 L 325,220" 
                fill="rgb(249, 115, 22)"
                initial={{ opacity: 0 }}
                animate={{ opacity: animated ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </>
          )}
          
          {type === 'postventa' && (
            <>
              {/* De Citas a Ventas (si no hay demos) o Demos (si hay) */}
              <motion.path 
                d="M 125,150 L 175,150 L 225,220 L 275,220 L 325,150 L 375,150" 
                fill="rgb(249, 115, 22)"
                initial={{ opacity: 0 }}
                animate={{ opacity: animated ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </>
          )}
        </svg>
      </div>

      {/* Ticket promedio para nuevos clientes */}
      {type === 'nuevos' && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-700 text-sm mb-1">Ticket de venta</div>
          <div className="text-3xl font-bold">{funnelData.avgTicket}</div>
        </div>
      )}
    </Paper>
  );
};

export default SalesFunnel;