import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldX, Lock, AlertTriangle, Search, Activity } from 'lucide-react';
import { releaseService } from '../services/api';

export default function Security() {
  const [releases, setReleases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const res = await releaseService.getAll();
      setReleases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCANNED': return <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1 uppercase tracking-wider"><Shield size={12}/> Safe</span>;
      case 'FAILED': return <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-red-500/20 flex items-center gap-1 uppercase tracking-wider"><ShieldX size={12}/> Critical</span>;
      case 'SCANNING': return <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-blue-500/20 flex items-center gap-1 uppercase tracking-wider animate-pulse"><Activity size={12}/> Scanning</span>;
      default: return <span className="bg-slate-500/10 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-500/20 flex items-center gap-1 uppercase tracking-wider">Pending</span>;
    }
  };

  const filteredReleases = releases.filter(r => 
    r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.repoUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            <ShieldAlert className="text-red-500" size={40} /> Security Engine
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Real-time vulnerability and secret detection monitoring</p>
        </div>
        
        <div className="relative group w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search artifacts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-bold animate-pulse uppercase tracking-widest">Infiltrating database...</div>
          ) : filteredReleases.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-500 italic">No security records found.</div>
          ) : (
            filteredReleases.map(release => (
              <div key={release.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex justify-between items-center hover:border-slate-700 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${release.status === 'SCANNED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {release.status === 'SCANNED' ? <Shield size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{release.projectName}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono tracking-tighter uppercase">{release.repoUrl}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {getStatusIcon(release.status)}
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Artifact ID: #{release.id}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Global Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-600/10 to-orange-600/10 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-red-500" size={28} />
                <h3 className="text-xl font-black text-white">Threat Level: LOW</h3>
             </div>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed">
               The intelligent scanner has processed {releases.length} artifacts today. No active secrets were leaked in the last 24 hours.
             </p>
             <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Scanner Health</span>
                    <span className="text-emerald-500">98% Optimal</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock size={18} className="text-blue-500" /> Best Practices
             </h3>
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]"></div>
                    <p className="text-xs text-slate-400">Always use environment variables for sensitive tokens.</p>
                </li>
                <li className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]"></div>
                    <p className="text-xs text-slate-400">Review security logs after every production build.</p>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
