import React from 'react';

const StatusBadge = ({ type }) => {
  const getColorClass = () => {
    const upperType = (type || '').toUpperCase();
    switch (upperType) {
      case 'CRITICAL':
        return 'bg-red-600 text-white border-red-700';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MODERATE':
      case 'MEDIUM':
        return 'bg-yellow-500 text-slate-900 border-yellow-600';
      case 'LOW':
        return 'bg-green-500 text-white border-green-600';
      default:
        return 'bg-slate-600 text-white border-slate-700';
    }
  };

  const getLabel = () => {
    const upperType = (type || '').toUpperCase();
    switch (upperType) {
      case 'CRITICAL':
        return '🔴 Critical';
      case 'HIGH':
        return '🟠 High';
      case 'MODERATE':
      case 'MEDIUM':
        return '🟡 Moderate';
      case 'LOW':
        return '🟢 Low';
      default:
        return '⚪ Unknown';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getColorClass()}`}
    >
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
