import React, { useEffect, useState } from 'react';
import { BodyMap } from '../components/BodyMap';
import { getMuscleStats, clearWorkouts } from '../api';
import { muscles } from '../data/gymData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, TrendingUp, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const Dashboard = () => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    const data = await getMuscleStats(period);
    setStats(data);
  };

  const handleClear = async () => {
    await clearWorkouts(period);
    loadStats();
  };

  // Prepare data for BodyMap (normalize 0-10)
  const values = Object.values(stats) as number[];
  const maxVol = values.length > 0 ? Math.max(...values) : 1;
  
  const muscleIntensities = Object.fromEntries(
    Object.entries(stats).map(([k, v]) => [k, ((v as number) / maxVol) * 10])
  );

  // Prepare data for Chart
  const chartData = Object.entries(stats)
    .map(([id, value]) => ({ 
      name: muscles.find(m => m.id === id)?.name || id, 
      value: Number(value) 
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Heatmap */}
        <div className="lg:col-span-8 bg-gray-900/50 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="text-emerald-500" /> Muscle Heatmap
              </h2>
              <p className="text-gray-400 text-sm mt-1">Based on total volume lifted</p>
            </div>
            
            <div className="bg-gray-800/50 p-1 rounded-lg flex gap-1">
              {(['today', 'week', 'month', 'all'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p 
                      ? 'bg-emerald-500 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <div className="w-px bg-gray-700 mx-1" />
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-1"
                title="Clear history for this period"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <BodyMap muscleIntensities={muscleIntensities} />
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Top Muscles
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {chartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-gray-300">{entry.name}</span>
                  </div>
                  <span className="font-mono text-gray-500">{Math.round(entry.value).toLocaleString()} kg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-400 mb-2">Keep going!</h3>
            <p className="text-sm text-gray-400 mb-4">
              Consistency is key. Start a new workout to light up more muscles.
            </p>
          </div>

        </div>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClear}
        title="Clear History"
        message={`Are you sure you want to clear workout history for ${period === 'all' ? 'all time' : 'this ' + period}? This action cannot be undone.`}
      />
    </div>
  );
};
