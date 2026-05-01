import React from 'react';
import { GitBranch, Box, ShieldCheck, Rocket, ChevronRight, ListChecks, CheckCircle2, Loader2, AlertCircle, Check, X } from 'lucide-react';

const PipelineGraph = ({ currentStatus, failedStage, onResume }) => {
  const stages = [
    { id: 'COMMIT', label: 'Clone', icon: GitBranch, activeStatuses: ['CLONING'] },
    { id: 'BUILD', label: 'Build', icon: Box, activeStatuses: ['BUILDING'] },
    { id: 'TEST', label: 'Test', icon: ListChecks, activeStatuses: ['TESTING'] },
    { id: 'SECURITY', label: 'Security', icon: ShieldCheck, activeStatuses: ['SCANNING'] },
    { id: 'DEPLOY', label: 'Deploy', icon: Rocket, activeStatuses: ['DEPLOYING'] },
  ];

  const getStageStatus = (stage, index) => {
    if (failedStage === stage.id || currentStatus === 'FAILED') {
        const failedIndex = stages.findIndex(s => s.id === failedStage);
        if (index === failedIndex) return 'failed';
        if (index < failedIndex) return 'completed';
        return 'pending';
    }

    const currentStageIndex = stages.findIndex(s => s.activeStatuses.includes(currentStatus));
    if (currentStatus === 'DEPLOYED') return 'completed';
    if (index === currentStageIndex) return 'active';

    if (currentStageIndex > index || currentStageIndex === -1) {
       if (currentStatus === 'BUILDING' && index < 1) return 'completed';
       if (currentStatus === 'WAITING_FOR_TEST' && index < 2) return 'completed';
       if (currentStatus === 'TESTING' && index < 2) return 'completed';
       if (currentStatus === 'SCANNING' && index < 3) return 'completed';
       if (currentStatus === 'SCANNED' && index < 4) return 'completed';
       if (currentStatus === 'DEPLOYING' && index < 4) return 'completed';
       
       if (currentStatus === 'WAITING_FOR_TEST' && stage.id === 'TEST') return 'active';
    }
    
    return 'pending';
  };

  return (
    <div className="bg-slate-900/50 p-8 py-12 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
      <div className="flex items-center justify-between min-w-[800px] relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>

        {stages.map((stage, index) => {
          const status = getStageStatus(stage, index);
          const Icon = stage.icon;
          const isWaiting = currentStatus === 'WAITING_FOR_TEST' && stage.id === 'TEST';

          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                  ${status === 'completed' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                    status === 'active' ? 'bg-blue-600/20 border-blue-500 text-blue-400 animate-pulse shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-110' :
                    status === 'failed' ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                    'bg-slate-900 border-slate-800 text-slate-600'}`}>
                  
                  {status === 'completed' ? <CheckCircle2 size={24} /> : 
                   status === 'active' ? <Loader2 size={24} className="animate-spin" /> :
                   status === 'failed' ? <AlertCircle size={24} /> :
                   <Icon size={24} />}
                </div>
                
                <div className="mt-4 text-center">
                  <span className={`text-xs font-bold uppercase tracking-widest
                    ${status === 'completed' ? 'text-emerald-400' :
                      status === 'active' ? 'text-blue-400' :
                      status === 'failed' ? 'text-red-400' :
                      'text-slate-600'}`}>
                    {stage.label}
                  </span>
                  
                  {isWaiting && (
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-32 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap mb-1">APPROVAL NEEDED</div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => onResume(true)}
                                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-110"
                                title="Run Tests"
                            >
                                <Check size={14} />
                            </button>
                            <button 
                                onClick={() => onResume(false)}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg shadow-lg transition-all hover:scale-110"
                                title="Skip Tests"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                  )}

                  {status === 'active' && !isWaiting && (
                    <div className="flex gap-1 justify-center mt-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  )}
                </div>
              </div>

              {index < stages.length - 1 && (
                <div className="flex-1 flex justify-center">
                  <ChevronRight size={20} className={status === 'completed' ? 'text-emerald-500' : 'text-slate-800'} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineGraph;
