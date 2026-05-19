import { useBoardStore } from '../store/useBoardStore';
import { BarChart3, CheckCircle2, ListTodo, Tag } from 'lucide-react';

const LABEL_NAMES = {
  'bg-red-500':    { name: 'Red',    hex: '#F87168' },
  'bg-blue-500':   { name: 'Blue',   hex: '#579DFF' },
  'bg-green-500':  { name: 'Green',  hex: '#4BCE97' },
  'bg-yellow-500': { name: 'Yellow', hex: '#F5CD47' },
  'bg-purple-500': { name: 'Purple', hex: '#9F8FEF' },
  'bg-orange-500': { name: 'Orange', hex: '#FEA362' },
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-[#44546F] uppercase tracking-wider">{label}</p>
        <p className="text-4xl font-black text-[#172B4D] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function Statistics() {
  const lists = useBoardStore((state) => {
    const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
    return activeBoard ? activeBoard.lists : [];
  });

  const totalCards = lists.reduce((acc, list) => acc + list.cards.length, 0);
  const completedCards = lists.reduce((acc, list) => acc + list.cards.filter(c => c.checked).length, 0);
  const completionRate = totalCards === 0 ? 0 : Math.round((completedCards / totalCards) * 100);

  const labelCounts = {};
  lists.forEach(list => list.cards.forEach(card => {
    if (card.label) labelCounts[card.label] = (labelCounts[card.label] || 0) + 1;
  }));

  return (
    <div className="h-full w-full bg-white overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <h2 className="text-2xl font-bold text-[#172B4D]">Analytics</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<ListTodo className="w-7 h-7 text-[#0052CC]" />} label="Total Cards" value={totalCards} color="bg-[#E9F2FF]" />
          <StatCard icon={<CheckCircle2 className="w-7 h-7 text-green-600" />} label="Completed" value={completedCards} color="bg-green-50" />
          <StatCard icon={<BarChart3 className="w-7 h-7 text-purple-600" />} label="Completion Rate" value={`${completionRate}%`} color="bg-purple-50" />
          <StatCard icon={<Tag className="w-7 h-7 text-yellow-600" />} label="Labeled" value={Object.values(labelCounts).reduce((a, b) => a + b, 0)} color="bg-yellow-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cards per list */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#172B4D] mb-6">Cards per List</h3>
            <div className="space-y-5">
              {lists.length === 0 && <p className="text-sm text-gray-400 italic">No lists on this board.</p>}
              {lists.map(list => {
                const pct = totalCards === 0 ? 0 : (list.cards.length / totalCards) * 100;
                return (
                  <div key={list.id}>
                    <div className="flex justify-between text-sm font-semibold text-[#172B4D] mb-2">
                      <span>{list.title}</span>
                      <span className="text-[#44546F]">{list.cards.length}</span>
                    </div>
                    <div className="h-3 bg-[#F1F2F4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0052CC] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Label distribution */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#172B4D] mb-6">Label Distribution</h3>
            {Object.keys(labelCounts).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Tag className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400 italic">No labeled cards found.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(labelCounts).map(([color, count]) => {
                  const total = Object.values(labelCounts).reduce((a, b) => a + b, 0);
                  const pct = (count / total) * 100;
                  const label = LABEL_NAMES[color];
                  return (
                    <div key={color}>
                      <div className="flex justify-between text-sm font-semibold text-[#172B4D] mb-2">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full inline-block" style={{ background: label?.hex || '#ccc' }} />
                          {label?.name || color}
                        </span>
                        <span className="text-[#44546F]">{count} ({Math.round(pct)}%)</span>
                      </div>
                      <div className="h-3 bg-[#F1F2F4] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: label?.hex || '#ccc' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Completion donut (CSS only) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F2F4" strokeWidth="12" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#0052CC" strokeWidth="12"
                strokeDasharray={`${completionRate * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#172B4D]">{completionRate}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172B4D] mb-1">Overall Progress</h3>
            <p className="text-sm text-[#44546F]">{completedCards} of {totalCards} cards completed</p>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-[#0052CC]" /> Done ({completedCards})
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-[#F1F2F4] border border-gray-300" /> Remaining ({totalCards - completedCards})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
