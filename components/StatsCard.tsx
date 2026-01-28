import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, icon, colorClass = "bg-white" }) => {
  return (
    <div className={`${colorClass} p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">
          {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
        </h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-full text-slate-600">
        {icon}
      </div>
    </div>
  );
};