import { useBoardStore } from '../store/useBoardStore';
import { Zap, ArrowRight, Play, Settings2, Plus, Sparkles } from 'lucide-react';

export default function Workflows() {
  const skin = useBoardStore((state) => state.skin);
  const isLight = skin === 'light';
  
  const cardClasses = isLight ? 'glass-card-light text-gray-800 border-gray-200' : 'glass-card-dark text-white border-white/10';
  const textMuted = isLight ? 'text-gray-500' : 'text-white/60';

  const workflows = useBoardStore((state) => state.workflows);
  const toggleWorkflow = useBoardStore((state) => state.toggleWorkflow);

  return (
    <div className="h-full w-full p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10 pb-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-bold flex items-center gap-3 ${isLight ? 'text-gray-800' : 'text-white'}`}>
              <div className="p-2.5 bg-yellow-500/20 rounded-xl shadow-inner">
                <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
              </div>
              Automation Workflows
            </h2>
            <p className={`mt-3 text-lg ${textMuted} flex items-center gap-2`}>
              <Sparkles className="w-5 h-5 text-blue-400" />
              Automate your board with custom triggers and actions.
            </p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            <Plus className="w-5 h-5" /> Create New Workflow
          </button>
        </div>

        {/* Workflows List */}
        <div className="grid grid-cols-1 gap-6">
          {workflows.map((wf) => (
            <div key={wf.id} className={`${cardClasses} p-6 md:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-all hover:scale-[1.01] border`}>
              
              <div className="flex-1 space-y-6 w-full">
                <div className="flex items-center gap-4">
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${wf.active ? 'bg-green-500/20' : isLight ? 'bg-gray-200' : 'bg-white/10'}`}>
                    <div className={`w-3 h-3 rounded-full ${wf.active ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]' : 'bg-gray-400'}`} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{wf.title}</h3>
                  {!wf.active && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isLight ? 'bg-gray-200 text-gray-500' : 'bg-white/10 text-white/50'}`}>PAUSED</span>
                  )}
                </div>
                
                <div className={`flex flex-col md:flex-row md:items-stretch gap-0 rounded-2xl border overflow-hidden ${isLight ? 'border-gray-200 bg-gray-50/50' : 'border-white/10 bg-black/20'}`}>
                  
                  {/* Trigger */}
                  <div className={`flex-1 p-5 ${isLight ? 'border-b md:border-b-0 md:border-r border-gray-200' : 'border-b md:border-b-0 md:border-r border-white/10'}`}>
                    <p className={`text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-2 ${textMuted}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      Trigger
                    </p>
                    <p className="font-medium text-[15px]">{wf.trigger}</p>
                  </div>

                  {/* Arrow Separator */}
                  <div className={`hidden md:flex items-center justify-center px-4 ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                    <ArrowRight className={`w-6 h-6 ${textMuted}`} />
                  </div>
                  
                  {/* Action */}
                  <div className="flex-1 p-5">
                    <p className={`text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-2 ${textMuted}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${wf.color}`} />
                      Action
                    </p>
                    <p className="font-medium text-[15px]">{wf.action}</p>
                  </div>

                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-6 lg:pt-0 border-white/10">
                <button 
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`flex-1 lg:flex-none px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${wf.active ? (isLight ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200' : 'bg-white/10 hover:bg-white/20 text-white') : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                >
                  <Play className={`w-5 h-5 ${wf.active ? 'fill-current' : ''}`} /> {wf.active ? 'Pause Automation' : 'Enable Automation'}
                </button>
                <button className={`p-3 rounded-xl transition-colors border ${isLight ? 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200 shadow-md' : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border-transparent shadow-md'}`}>
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
