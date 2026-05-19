import { useBoardStore } from '../store/useBoardStore';
import { Zap, ArrowRight, Play, Settings2, Plus, Square, Check } from 'lucide-react';

export default function Workflows() {
  const workflows = useBoardStore(s => s.workflows);
  const toggleWorkflow = useBoardStore(s => s.toggleWorkflow);

  const COLOR_MAP = {
    'bg-green-500':  '#4BCE97',
    'bg-red-500':    '#F87168',
    'bg-blue-500':   '#579DFF',
    'bg-purple-500': '#9F8FEF',
  };

  return (
    <div className="h-full w-full bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" /> Automation
            </h2>
            <p className="text-sm text-[#44546F] mt-1">
              Automate your workflow with rules, triggers, and actions.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0052CC] hover:bg-[#0065FF] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create rule
          </button>
        </div>

        {/* Usage */}
        <div className="bg-[#E9F2FF] border border-[#CCE0FF] rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0052CC]">Automation runs this month</p>
            <p className="text-xs text-[#44546F] mt-0.5">Free plan: 250 runs / month</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#0052CC]">
              {workflows.filter(w => w.active).length * 12}
            </span>
            <span className="text-sm text-[#44546F]"> / 250</span>
          </div>
        </div>

        {/* Workflows */}
        <div className="space-y-3">
          {workflows.map(wf => {
            const dotColor = COLOR_MAP[wf.color] || '#ccc';
            return (
              <div key={wf.id} className={`bg-white border rounded-xl shadow-sm transition-all hover:shadow-md ${wf.active ? 'border-gray-200' : 'border-gray-200 opacity-75'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Active indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${wf.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <div className={`w-3 h-3 rounded-full ${wf.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#172B4D] truncate">{wf.title}</h3>
                        {!wf.active && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Disabled
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleWorkflow(wf.id)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          wf.active
                            ? 'bg-gray-100 hover:bg-gray-200 text-[#172B4D]'
                            : 'bg-[#0052CC] hover:bg-[#0065FF] text-white'
                        }`}
                      >
                        {wf.active ? (
                          <><Square className="w-3.5 h-3.5" /> Disable</>
                        ) : (
                          <><Play className="w-3.5 h-3.5 fill-current" /> Enable</>
                        )}
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rule flow */}
                  <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-0 rounded-lg border border-gray-100 overflow-hidden bg-gray-50/60">
                    <div className="flex-1 p-4">
                      <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" /> Trigger
                      </p>
                      <p className="text-sm text-[#172B4D] font-medium leading-snug">{wf.trigger}</p>
                    </div>
                    <div className="flex items-center justify-center px-3 bg-gray-100/80 border-y sm:border-y-0 sm:border-x border-gray-100 shrink-0">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: dotColor }}>
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dotColor }} /> Action
                      </p>
                      <p className="text-sm text-[#172B4D] font-medium leading-snug">{wf.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty templates */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#172B4D] mb-1">Ready-made automations</h3>
          <p className="text-xs text-[#44546F] mb-4">Get started with these popular automation templates.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Move overdue cards', 'Auto-assign members', 'Send Slack notification', 'Create recurring tasks'].map(t => (
              <button key={t} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#172B4D] hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <Plus className="w-3 h-3 text-[#0052CC]" /> {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
