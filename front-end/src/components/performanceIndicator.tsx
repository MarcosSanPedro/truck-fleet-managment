import React from 'react';

interface PerformanceIndicatorProps {
  label: string;
  value: number;
  unit?: string;
  max?: number;
  type?: 'rating' | 'percentage' | 'number';
}

export const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({ 
  label, 
  value, 
  unit = '', 
  max = 5, 
  type = 'number' 
}) => {
  const getColor = () => {
    if (type === 'rating') {
      if (value >= 4.5) return 'text-green-600';
      if (value >= 3.5) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'percentage') {
      if (value >= 95) return 'text-green-600';
      if (value >= 85) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-blue-600';
  };

  const formatValue = () => {
    if (type === 'rating') {
      return `${value.toFixed(1)}/5`;
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    if (type === 'number' && value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${getColor()}`}>
        {formatValue()}{unit}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
};