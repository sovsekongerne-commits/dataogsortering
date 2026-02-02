import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList, 
  PieChart, Pie, Tooltip
} from 'recharts';
import { BucketData } from '../types';
import { 
  BarChart3, // Vertical
  BarChartHorizontal, // Horizontal
  PieChart as PieChartIcon, 
  GripVertical, // Using generic icon for "Stick" representation
  Eye, 
  EyeOff 
} from 'lucide-react';

interface LiveChartProps {
  data: BucketData[];
}

type ChartType = 'vertical' | 'horizontal' | 'stick' | 'pie';

export const LiveChart: React.FC<LiveChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('vertical');
  const [showValues, setShowValues] = useState(true);

  // Filter for Pie Chart (don't show empty slices)
  const activeData = data.filter(d => d.count > 0);
  const hasData = activeData.length > 0;

  // Common axis styles
  const axisStyle = { stroke: '#4338ca', fontSize: 12, fontWeight: 'bold' };
  const tickStyle = { fill: '#4338ca', fontSize: 12 };

  const renderChart = () => {
    // Empty state for Pie chart if no items sorted yet
    if (chartType === 'pie' && !hasData) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-indigo-300 opacity-50">
          <PieChartIcon size={64} className="mb-2" />
          <p className="font-bold">Begynd at sortere for at se cirklen</p>
        </div>
      );
    }

    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={activeData as any[]}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={showValues ? ({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%` : undefined}
                labelLine={showValues}
              >
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'horizontal':
        return (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              layout="vertical"
              data={data as any[]}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e7ff" />
              <XAxis type="number" hide={false} {...axisStyle} allowDecimals={false} />
              <YAxis 
                dataKey="label" 
                type="category" 
                width={70}
                tick={({ x, y, payload }: any) => {
                   const bucket = data.find(d => d.label === payload.value);
                   if (!bucket || bucket.count === 0) return null;
                   return (
                     <text x={x - 5} y={y} dy={4} textAnchor="end" fill="#4338ca" fontSize={11} fontWeight="bold">
                       {payload.value}
                     </text>
                   );
                }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="count" radius={[0, 10, 10, 0]} animationDuration={500} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? entry.fill : '#f3f4f6'} />
                ))}
                {showValues && (
                  <LabelList 
                    dataKey="count" 
                    position="right" 
                    fill="#3730a3" 
                    fontWeight="bold" 
                    fontSize={14} 
                    formatter={(val: number) => val > 0 ? val : ''} 
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'stick':
        // Stick chart is essentially a bar chart with very thin bars
        return (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data as any[]}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
              <XAxis 
                dataKey="label" 
                {...axisStyle} 
                axisLine={false} 
                tickLine={false}
                tick={({ x, y, payload }: any) => {
                  const bucket = data.find(d => d.label === payload.value);
                  if (!bucket || bucket.count === 0) return null;
                  return (
                    <text x={x} y={y} dy={16} textAnchor="middle" fill="#4338ca" fontSize={11} fontWeight="bold">
                      {payload.value}
                    </text>
                  );
                }}
              />
              <YAxis {...axisStyle} tick={tickStyle} allowDecimals={false} axisLine={false} tickLine={false} />
              {/* Very thin bar size simulates a "stick" or "pinde" diagram */}
              <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={500} barSize={6}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? entry.fill : '#f3f4f6'} />
                ))}
                {showValues && (
                   <LabelList 
                     dataKey="count" 
                     position="top" 
                     fill="#3730a3" 
                     fontWeight="bold" 
                     fontSize={16} 
                     formatter={(val: number) => val > 0 ? val : ''} 
                   />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'vertical':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data as any[]}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
              <XAxis 
                dataKey="label" 
                {...axisStyle} 
                axisLine={false} 
                tickLine={false}
                tick={({ x, y, payload }: any) => {
                  const bucket = data.find(d => d.label === payload.value);
                  if (!bucket || bucket.count === 0) return null;
                  return (
                    <text x={x} y={y} dy={16} textAnchor="middle" fill="#4338ca" fontSize={11} fontWeight="bold">
                      {payload.value}
                    </text>
                  );
                }}
              />
              <YAxis {...axisStyle} tick={tickStyle} allowDecimals={false} axisLine={false} tickLine={false} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} animationDuration={500}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? entry.fill : '#f3f4f6'} />
                ))}
                {showValues && (
                  <LabelList 
                    dataKey="count" 
                    position="top" 
                    fill="#3730a3" 
                    fontWeight="bold" 
                    fontSize={16} 
                    formatter={(val: number) => val > 0 ? val : ''} 
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-3xl p-4 shadow-xl border-4 border-indigo-100 flex flex-col">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-indigo-50/50 p-2 rounded-xl shrink-0">
        <h2 className="text-xl font-bold text-indigo-900 px-2">
          Resultat
        </h2>
        
        <div className="flex items-center gap-1">
          {/* Chart Type Toggles */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-indigo-100">
            <button 
              onClick={() => setChartType('vertical')}
              className={`p-1.5 rounded-md transition-all ${chartType === 'vertical' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              title="Søjlediagram"
            >
              <BarChart3 size={20} />
            </button>
            <button 
              onClick={() => setChartType('horizontal')}
              className={`p-1.5 rounded-md transition-all ${chartType === 'horizontal' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              title="Liggende søjler"
            >
              <BarChartHorizontal size={20} />
            </button>
            <button 
              onClick={() => setChartType('stick')}
              className={`p-1.5 rounded-md transition-all ${chartType === 'stick' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              title="Pindediagram"
            >
              <GripVertical size={20} />
            </button>
            <button 
              onClick={() => setChartType('pie')}
              className={`p-1.5 rounded-md transition-all ${chartType === 'pie' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              title="Cirkeldiagram"
            >
              <PieChartIcon size={20} />
            </button>
          </div>

          {/* Value Toggle */}
          <button 
            onClick={() => setShowValues(!showValues)}
            className={`p-2 rounded-lg border ml-2 transition-all ${
              showValues 
                ? 'bg-indigo-100 border-indigo-200 text-indigo-600' 
                : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-200'
            }`}
            title={showValues ? "Skjul tal" : "Vis tal"}
          >
            {showValues ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {/* Chart Container - Using absolute positioning fix for Recharts in Flexbox */}
      <div className="flex-grow relative w-full min-h-[250px]">
        <div className="absolute inset-0 w-full h-full">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};