import { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function LogsTerminal({ logs }) {
  const endOfLogsRef = useRef(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (level) => {
    switch (level) {
      case 'ERROR': return 'text-red-400';
      case 'WARNING': return 'text-amber-400';
      case 'INFO': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-sm shadow-xl">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
        <TerminalIcon size={16} className="text-slate-400" />
        <span className="text-slate-300 font-semibold">Build & Deploy Logs</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>
      
      <div className="p-4 h-[400px] overflow-y-auto bg-[#0a0a0a]">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic">Waiting for pipeline execution...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-3 hover:bg-slate-900/50 px-2 py-0.5 rounded transition-colors">
                <span className="text-slate-600 w-24 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`w-16 shrink-0 font-bold ${getLogColor(log.level)}`}>
                  [{log.level}]
                </span>
                <span className="text-blue-400 w-24 shrink-0">
                  [{log.stage}]
                </span>
                <span className="text-slate-300">
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={endOfLogsRef} />
          </div>
        )}
      </div>
    </div>
  );
}
