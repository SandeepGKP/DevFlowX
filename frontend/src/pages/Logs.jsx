import { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Search, List, Activity, History } from 'lucide-react';
import { releaseService, pipelineService } from '../services/api';
import LogsTerminal from '../components/LogsTerminal';

export default function Logs() {
  const [releases, setReleases] = useState([]);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchReleases();
  }, []);

  useEffect(() => {
    let interval;
    if (selectedRelease) {
      fetchLogs(selectedRelease.id);
      interval = setInterval(() => fetchLogs(selectedRelease.id), 2000);
    }
    return () => clearInterval(interval);
  }, [selectedRelease]);

  const fetchReleases = async () => {
    try {
      const res = await releaseService.getAll();
      const data = res.data.sort((a, b) => b.id - a.id);
      setReleases(data);
      if (data.length > 0 && !selectedRelease) {
        setSelectedRelease(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async (id) => {
    try {
      const res = await pipelineService.getLogs(id);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-100px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <TerminalIcon className="text-emerald-400" /> Audit Log Explorer
        </h1>
        <p className="text-slate-400 mt-2">Historical build and deployment terminal logs</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar for selecting release */}
        <div className="w-80 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input type="text" placeholder="Search releases..." className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-[10px] focus:outline-none focus:border-blue-500 text-slate-200" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {releases.map((release) => (
              <button
                key={release.id}
                onClick={() => setSelectedRelease(release)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedRelease?.id === release.id 
                  ? 'bg-blue-600/20 border border-blue-500/30 shadow-lg' 
                  : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">ID: {release.id}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border
                    ${release.status === 'DEPLOYED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    release.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {release.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-200 truncate">{release.projectName}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1 opacity-70">{release.version}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Area */}
        <div className="flex-1 min-w-0">
          {selectedRelease ? (
            <div className="h-full flex flex-col">
               <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-200">{selectedRelease.projectName}</h2>
                    <p className="text-xs text-slate-500 mt-1">Audit log stream for version {selectedRelease.version}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1 justify-end">
                       <Activity size={10} /> Pipeline Node
                     </p>
                     <p className="text-[10px] text-blue-400 font-mono mt-1 truncate max-w-[200px]">{selectedRelease.repoUrl || 'Manual Execution'}</p>
                  </div>
               </div>
               <div className="flex-1 min-h-0">
                  <LogsTerminal logs={logs} />
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
               <History size={48} className="text-slate-800 mb-4" />
               <p className="text-slate-500 text-sm">Select a release to view execution history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
