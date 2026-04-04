Êimport React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', active: 4000 },
  { name: 'Tue', active: 3000 },
  { name: 'Wed', active: 2000 },
  { name: 'Thu', active: 2780 },
  { name: 'Fri', active: 1890 },
  { name: 'Sat', active: 2390 },
  { name: 'Sun', active: 3490 },
];

export default function ActivityChart() {
  return (
    <div className="glass-card h-80">
      <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
        Weekly Activity
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '8px',
              color: '#fff' 
            }}
          />
          <Bar dataKey="active" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
            ))}
          </Bar>
           <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
Ê"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Xfile:///d:/project/Fittness%20tracking%20website/client/src/components/ActivityChart.jsx:0file:///d:/project/Fittness%20tracking%20website