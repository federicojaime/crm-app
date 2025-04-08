// src/components/statistics/KpiCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const KpiCard = ({ 
  title, 
  value, 
  target, 
  description, 
  color = "bg-green-400",
  animate = true
}) => {
  return (
    <motion.div
      className={`${color} rounded-lg shadow-sm overflow-hidden`}
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 text-center">
        <motion.div 
          className="text-4xl font-bold mb-1"
          initial={animate ? { y: 20, opacity: 0 } : {}}
          animate={animate ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {value}
        </motion.div>
        <div className="text-sm mb-1">{title}</div>
        <div className="text-xs mb-1">{target}</div>
        <div className="text-xs">{description}</div>
      </div>
    </motion.div>
  );
};

export default KpiCard;