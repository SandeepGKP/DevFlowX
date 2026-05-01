import { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';
import { TrendingUp, CheckCircle2, XCircle, Clock, Package, BarChart3, Activity } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, suffix = "" }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">{value}{suffix}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
        <Activity size={12} className="animate-pulse text-blue-500" />
        LIVE UPDATING
    </div>
  </div>
);

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await analyticsService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="flex items-center justify-center h-96 text-slate-500 font-bold animate-pulse">Gathering intelligence...</div>;

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-4">
          <BarChart3 className="text-blue-500" size={40} /> Operational Insights
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Measure and optimize your delivery pipeline performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Deployments" value={stats.totalDeployments} icon={Package} color="bg-blue-500" />
        <StatCard label="Success Rate" value={stats.successRate.toFixed(1)} icon={TrendingUp} color="bg-emerald-500" suffix="%" />
        <StatCard label="Pipeline Passes" value={stats.successCount} icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard label="Failed Blocks" value={stats.failureCount} icon={XCircle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Distribution */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Package size={20} className="text-blue-500" /> Deployment Frequency
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">By Project</span>
          </div>
          
          <div className="space-y-6">
            {Object.entries(stats.projectDistribution).map(([name, count]) => {
                const percentage = (count / stats.totalDeployments) * 100;
                return (
                    <div key={name} className="space-y-2 group">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{name}</span>
                            <span className="text-xs font-mono text-slate-500">{count} Deployments</span>
                        </div>
                        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
            {Object.keys(stats.projectDistribution).length === 0 && (
                <div className="text-center py-20 text-slate-600 italic">No data available yet.</div>
            )}
          </div>
        </div>

        {/* Health Summary */}
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between">
           <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Pipeline Health</h3>
              <p className="text-sm text-slate-400">Your current deployment velocity is stable. Security scans are catching vulnerabilities in 12% of runs.</p>
           </div>
           
           <div className="py-8 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" className="stroke-slate-800 fill-none" strokeWidth="8" />
                    <circle 
                        cx="64" cy="64" r="60" 
                        className="stroke-blue-500 fill-none" 
                        strokeWidth="8" 
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * stats.successRate) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{stats.successRate.toFixed(0)}%</span>
                    <span className="text-[8px] font-bold text-slate-500">OPTIMAL</span>
                </div>
              </div>
           </div>

           <button className="w-full bg-white text-slate-950 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
              <Clock size={16} /> Schedule Report
           </button>
        </div>
      </div>
    </div>
  );
}
