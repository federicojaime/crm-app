import React from 'react';
import { Card, Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';

const KpiCard = ({
  title,
  value,
  description,
  target,
  color = 'bg-gray-200',
  animate = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 ${color} text-white`} shadow="sm" radius="md">
        <Title order={4} className="mb-1">
          {title}
        </Title>
        <Text size="xl" weight={700} className="mb-1">
          {value}
        </Text>
        <Text size="sm" className="mb-1">
          {description}
        </Text>
        <Text size="xs" className="text-gray-200 italic">
          {target}
        </Text>
      </Card>
    </motion.div>
  );
};

export default KpiCard;
