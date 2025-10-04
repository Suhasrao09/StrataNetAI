import React from 'react';

const MetricDisplay = ({ label = "", value = "", icon = null }) => {
  return (
    <div className="flex items-center space-x-2 bg-background-primary px-4 py-2 rounded-xl border border-border-light shadow-sm">
      {icon && <div className="text-xl">{icon}</div>}
      <div>
        <p className="text-xs text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-base font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default MetricDisplay;

