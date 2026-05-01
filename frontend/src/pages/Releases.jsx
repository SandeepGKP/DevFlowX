import { useState, useEffect } from 'react';
import { releaseService } from '../services/api';
import { Rocket, RotateCcw, Trash2, CheckCircle2, AlertCircle, History, Package, Key, Settings, X, Plus, Save } from 'lucide-react';

export default function Releases() {
  const [releases, setReleases] = useState([]);
  const [editingRelease, setEditingRelease] = useState(null);
  const [tempEnvVars, setTempEnvVars] = useState([]);

  useEffect(() => {
    fetchReleases();
    const interval = setInterval(fetchReleases, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchReleases = async () => {
    try {
      const res = await releaseService.getAll();
      setReleases(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRollback = async (id) => {
    try {
      await releaseService.rollback(id);
      fetchReleases();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this release and its workspace?')) {
      try {
        await releaseService.delete(id);
        fetchReleases();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEnvEditor = (release) => {
    setEditingRelease(release);
    const vars = Object.entries(release.environmentVariables || {}).map(([key, value]) => ({ key, value }));
    setTempEnvVars(vars.length > 0 ? vars : [{ key: '', value: '' }]);
  };

  const saveEnvVars = async () => {
    const environmentVariables = {};
    tempEnvVars.forEach(ev => { if(ev.key) environmentVariables[ev.key] = ev.value; });
    try {
      await releaseService.updateEnvVars(editingRelease.id, environmentVariables);
      setEditingRelease(null);
      fetchReleases();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <History className="text-blue-400" /> Release Management
        </h1>
        <p className="text-slate-400 mt-2">View and manage all pipeline deployments</p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold">Project</th>
              <th className="px-6 py-4 font-bold">Version</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Created At</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {releases.map((release) => (
              <tr key={release.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 text-slate-500 font-mono">#{release.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-200">{release.projectName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-blue-400 font-mono text-xs">{release.version}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {release.status === 'DEPLOYED' && <CheckCircle2 size={14} className="text-emerald-500" />}
                    {release.status === 'FAILED' && <AlertCircle size={14} className="text-red-500" />}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                      ${release.status === 'DEPLOYED' ? 'bg-emerald-500/10 text-emerald-400' :
                        release.status === 'FAILED' ? 'bg-red-500/10 text-red-400' :
                        release.status === 'ROLLBACK' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'}`}>
                      {release.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  {new Date(release.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => openEnvEditor(release)}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 bg-slate-800/50 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                    title="Edit Environment Variables"
                  >
                    <Key size={14} />
                  </button>
                  {release.status === 'FAILED' && (
                    <button 
                      onClick={() => handleRollback(release.id)}
                      className="flex items-center gap-2 text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
                    >
                      <RotateCcw size={14} /> Rollback
                    </button>
                  )}
                  {release.status === 'DEPLOYED' && release.liveUrl && (
                    <a 
                      href={release.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold mr-2 border border-emerald-500/20"
                      title="Launch Live App"
                    >
                      <Rocket size={14} />
                      <span className="text-[10px] font-bold uppercase">Launch</span>
                    </a>
                  )}
                  <button 
                    onClick={() => handleDelete(release.id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    title="Delete Release"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Env Editor Modal */}
      {editingRelease && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
               <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Settings className="text-blue-400" /> Environment Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{editingRelease.projectName} - {editingRelease.version}</p>
               </div>
               <button onClick={() => setEditingRelease(null)} className="text-slate-500 hover:text-slate-100 p-2"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    Active Variables
                  </label>
                  <button onClick={() => setTempEnvVars([...tempEnvVars, { key: '', value: '' }])} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[10px] font-bold">
                    <Plus size={12} /> ADD KEY
                  </button>
               </div>
               {tempEnvVars.map((ev, i) => (
                  <div key={i} className="flex gap-2 animate-in slide-in-from-left-2 duration-200" style={{ animationDelay: `${i * 50}ms` }}>
                    <input placeholder="KEY" value={ev.key} onChange={e => {
                        const next = [...tempEnvVars];
                        next[i].key = e.target.value;
                        setTempEnvVars(next);
                    }} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none" />
                    <input type="password" placeholder="VALUE" value={ev.value} onChange={e => {
                        const next = [...tempEnvVars];
                        next[i].value = e.target.value;
                        setTempEnvVars(next);
                    }} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none" />
                    <button onClick={() => setTempEnvVars(tempEnvVars.filter((_, idx) => idx !== i))} className="text-red-500/30 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                  </div>
               ))}
               {tempEnvVars.length === 0 && (
                  <p className="text-center py-8 text-slate-600 text-sm italic">No variables defined for this release.</p>
               )}
            </div>
            <div className="p-6 bg-slate-800/20 border-t border-slate-800 flex justify-end gap-3">
               <button onClick={() => setEditingRelease(null)} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors">Cancel</button>
               <button onClick={saveEnvVars} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
                  <Save size={16} /> Save Changes
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
