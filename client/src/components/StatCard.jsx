
import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      {subtext && (
        <div className="flex items-center gap-2 text-sm">
          {trend && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          <span className="text-gray-500">{subtext}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
