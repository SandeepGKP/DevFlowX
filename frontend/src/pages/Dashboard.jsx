import { useState, useEffect } from 'react';
import { Rocket, ServerCrash, ShieldAlert, Activity, GitBranch, Code2, Loader2, Globe, CheckCircle2, Terminal, ListChecks, HelpCircle, Clock, Plus, Trash2, Key, Shield } from 'lucide-react';
import Cards from '../components/Cards';
import PipelineGraph from '../components/PipelineGraph';
import LogsTerminal from '../components/LogsTerminal';
import { releaseService, pipelineService } from '../services/api';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function Dashboard() {
  const [activeRelease, setActiveRelease] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ active: 0, failed: 0, risks: 0, total: 0 });
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [envVars, setEnvVars] = useState([{ key: '', value: '' }]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const [formData, setFormData] = useState({
    projectName: 'My Frontend App',
    repoUrl: 'https://github.com/github/fetch.git',
    branch: 'main',
    version: 'v1.0.0',
    rootDirectory: ''
  });

  useEffect(() => {
    fetchReleases();
    const interval = setInterval(fetchReleases, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    const isRunning = activeRelease && !['PENDING', 'DEPLOYED', 'FAILED', 'ROLLBACK', 'WAITING_FOR_TEST'].includes(activeRelease.status);
    if (isRunning) {
      timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [activeRelease?.status, activeRelease?.id]);

  useEffect(() => {
    if (!activeRelease?.id) return;

    // Initial fetch for historical logs
    fetchLogs(activeRelease.id);

    // Only set up WebSocket if the release is actually running or recently finished
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const socket = new SockJS(`${apiBaseUrl}/ws-logs`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Disable noisy console logs

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/logs/${activeRelease.id}`, (message) => {
        if (message.body) {
          try {
            const logObj = JSON.parse(message.body);
            setLogs(prev => [...prev, logObj]);
          } catch (e) {
            console.error("Failed to parse log message:", e);
          }
        }
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [activeRelease?.id]);

  const fetchReleases = async () => {
    try {
      const res = await releaseService.getAll();
      const releases = res.data;
      const failed = releases.filter(r => r.status === 'FAILED' || r.status === 'ROLLBACK').length;
      const active = releases.filter(r => !['PENDING', 'DEPLOYED', 'FAILED', 'ROLLBACK'].includes(r.status)).length;
      setStats({ active, failed, risks: 0, total: releases.length });
      if (releases.length > 0) {
        const sorted = releases.sort((a, b) => b.id - a.id);
        const inProgress = sorted.find(r => !['PENDING', 'DEPLOYED', 'FAILED', 'ROLLBACK'].includes(r.status));
        setActiveRelease(prev => {
          if (!prev || (inProgress && prev.id !== inProgress.id)) return inProgress || sorted[0];
          return prev.id === sorted[0].id ? sorted[0] : prev;
        });
      }
    } catch (err) { console.error(err); }
  };

  const fetchLogs = async (id) => {
    try {
      const res = await pipelineService.getLogs(id);
      setLogs(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    setIsDeploying(true);
    try {
      const environmentVariables = {};
      envVars.forEach(ev => { if(ev.key) environmentVariables[ev.key] = ev.value; });

      const res = await releaseService.create({
        ...formData,
        commitMessage: "Manual deployment via UI",
        environmentVariables
      });
      await pipelineService.start(res.data.id);
      setActiveRelease(res.data);
      setLogs([]);
      setShowDeployForm(false);
      fetchReleases();
    } catch (err) { console.error(err); } finally { setIsDeploying(false); }
  };

  const handleResume = async (runTests) => {
    if (!activeRelease) return;
    try {
      await pipelineService.resume(activeRelease.id, runTests);
      fetchReleases();
    } catch (err) { console.error(err); }
  };

  const handleStop = async () => {
    if (!activeRelease) return;
    try {
      await pipelineService.stop(activeRelease.id);
      fetchReleases();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deployment and all its files?")) return;
    try {
      await releaseService.delete(id);
      if (activeRelease?.id === id) setActiveRelease(null);
      fetchReleases();
    } catch (err) { console.error(err); }
  };

  const addEnvVar = () => setEnvVars([...envVars, { key: '', value: '' }]);
  const removeEnvVar = (index) => setEnvVars(envVars.filter((_, i) => i !== index));
  const updateEnvVar = (index, field, val) => {
    const newVars = [...envVars];
    newVars[index][field] = val;
    setEnvVars(newVars);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">DevOps Control Center</h1>
          <p className="text-slate-400 mt-2">Real-time CI/CD execution and monitoring</p>
        </div>
        <button onClick={() => setShowDeployForm(!showDeployForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Rocket size={18} /> {showDeployForm ? 'Cancel' : 'New Deployment'}
        </button>
      </div>

      {showDeployForm && (
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-blue-500/30 animate-in slide-in-from-top-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-100"><Code2 className="text-blue-400" /> Start Real Pipeline</h3>
          <form onSubmit={handleDeploy} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Project Name</label>
              <input type="text" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Version Tag</label>
              <input type="text" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Repository URL (.git)</label>
              <input type="url" value={formData.repoUrl} onChange={e => setFormData({...formData, repoUrl: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1"><GitBranch size={14}/> Branch</label>
              <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">Root Directory (Optional)</label>
              <input type="text" value={formData.rootDirectory} onChange={e => setFormData({...formData, rootDirectory: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
            
            <div className="col-span-2 space-y-2 mt-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Key size={14} className="text-amber-500" /> Environment Variables (Secrets)
                  </label>
                  <button type="button" onClick={addEnvVar} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[10px] font-bold">
                    <Plus size={12} /> ADD KEY
                  </button>
               </div>
               {envVars.map((ev, i) => (
                  <div key={i} className="flex gap-2">
                    <input placeholder="KEY (e.g. API_KEY)" value={ev.key} onChange={e => updateEnvVar(i, 'key', e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none" />
                    <input type="password" placeholder="VALUE" value={ev.value} onChange={e => updateEnvVar(i, 'value', e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none" />
                    <button type="button" onClick={() => removeEnvVar(i)} className="text-red-500/50 hover:text-red-500 px-1"><Trash2 size={14}/></button>
                  </div>
               ))}
               <p className="text-[9px] text-slate-600 italic">Variables are injected into the build process and never saved to source code.</p>
            </div>

            <div className="col-span-2 mt-2">
              <button disabled={isDeploying} type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                {isDeploying ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
                {isDeploying ? 'Starting Engine...' : 'Execute Pipeline'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Cards title="Active Deployments" value={stats.active} subtitle="Currently running" icon={Activity} colorClass="bg-blue-500/20 text-blue-400" />
        <Cards title="Total Deployments" value={stats.total} subtitle="Project lifetime" icon={Rocket} colorClass="bg-emerald-500/20 text-emerald-400" />
        <Cards title="Failed Builds" value={stats.failed} subtitle="Require attention" icon={ServerCrash} colorClass="bg-red-500/20 text-red-400" />
        <Cards title="Security Risks" value={stats.risks} subtitle="High severity" icon={ShieldAlert} colorClass="bg-amber-500/20 text-amber-400" />
      </div>

      {activeRelease ? (
        <>
          <div className="mb-6 flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400"><Code2 size={24} /></div>
              <div>
                <span className="text-slate-400 text-sm">Tracking Release: </span>
                <span className="font-bold text-blue-400">{activeRelease.projectName} {activeRelease.version}</span>
                {activeRelease.repoUrl && <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><GitBranch size={12} /> {activeRelease.repoUrl}</div>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2 items-center">
                {activeRelease.status === 'WAITING_FOR_TEST' && (
                  <div className="flex gap-2 mr-2 animate-in zoom-in duration-300">
                    <button onClick={() => handleResume(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"><CheckCircle2 size={12} /> Run Tests</button>
                    <button onClick={() => handleResume(false)} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"><ShieldAlert size={12} /> Skip Tests</button>
                  </div>
                )}
                {activeRelease && !['PENDING', 'DEPLOYED', 'FAILED', 'ROLLBACK', 'WAITING_FOR_TEST'].includes(activeRelease.status) && (
                   <div className="flex gap-2 mr-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                         <Clock size={10} className="animate-pulse" /> {formatTime(elapsedTime)}
                      </div>
                      <button onClick={handleStop} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border border-red-500/30">
                        <ShieldAlert size={12} /> STOP BUILD
                      </button>
                   </div>
                )}
                {activeRelease.status === 'DEPLOYED' && activeRelease.liveUrl && <a href={activeRelease.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20"><Rocket size={12} /> Launch App</a>}
                <button onClick={() => handleDelete(activeRelease.id)} className="bg-slate-700 hover:bg-red-600 text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-all border border-slate-600 hover:border-red-500" title="Remove Deployment"><Trash2 size={14}/></button>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs border ${activeRelease.status === 'DEPLOYED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : activeRelease.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse'}`}>{activeRelease.status}</span>
              </div>
            </div>
          </div>
          <PipelineGraph 
            currentStatus={activeRelease.status} 
            failedStage={logs.find(l => l.level === 'ERROR')?.stage} 
            onResume={handleResume}
          />
          <div className="mt-8"><LogsTerminal logs={logs} /></div>
        </>
      ) : (
        !showDeployForm && (
          <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
            <Rocket size={48} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-300">No Active Releases</h3>
            <p className="text-slate-500 mt-2">Click "New Deployment" to start the real CI/CD engine.</p>
          </div>
        )
      )}
    </div>
  );
}
