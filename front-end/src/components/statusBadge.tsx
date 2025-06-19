import React from 'react';

interface StatusBadgeProps {
  status: string;
  type: 'employment' | 'assignment' | 'certification';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const getStatusStyles = () => {
    if (type === 'employment') {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'inactive':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'on-leave':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'suspended':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    if (type === 'assignment') {
      switch (status) {
        case 'available':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'on-route':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'loading':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'maintenance':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'off-duty':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    // certification type
    return status === 'valid' || status === 'true'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {formatStatus(status)}
    </span>
  );
};