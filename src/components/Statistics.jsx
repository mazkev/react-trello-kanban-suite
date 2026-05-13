import { useBoardStore } from '../store/useBoardStore';
import { BarChart3, CheckCircle2, ListTodo, Tag } from 'lucide-react';

export default function Statistics() {
  const lists = useBoardStore((state) => {
    const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
    return activeBoard ? activeBoard.lists : [];
  });
  const skin = useBoardStore((state) => state.skin);
  const isLight = skin === 'light';

  const totalCards = lists.reduce((acc, list) => acc + list.cards.length, 0);
  const completedCards = lists.reduce((acc, list) => acc + list.cards.filter(c => c.checked).length, 0);
  const completionRate = totalCards === 0 ? 0 : Math.round((completedCards / totalCards) * 100);

  // Label distribution
  const labelCounts = {};
  lists.forEach(list => list.cards.forEach(card => {
    if (card.label) {
      labelCounts[card.label] = (labelCounts[card.label] || 0) + 1;
    }
  }));

  const cardClasses = isLight ? 'glass-card-light text-gray-800 border border-gray-200' : 'glass-card-dark text-white border border-white/10';
  const textMuted = isLight ? 'text-gray-500' : 'text-white/60';

  return (
    <div className="h-full w-full p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        <h2 className={`text-3xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>Board Statistics</h2>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${cardClasses} p-6 rounded-3xl shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1`}>
            <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-500 shadow-inner">
              <ListTodo className="w-8 h-8" />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Total Cards</p>
              <p className="text-4xl font-black mt-1">{totalCards}</p>
            </div>
          </div>
          
          <div className={`${cardClasses} p-6 rounded-3xl shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1`}>
            <div className="p-4 bg-green-500/20 rounded-2xl text-green-500 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Completed</p>
              <p className="text-4xl font-black mt-1">{completedCards}</p>
            </div>
          </div>

          <div className={`${cardClasses} p-6 rounded-3xl shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1`}>
            <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-500 shadow-inner">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Completion Rate</p>
              <p className="text-4xl font-black mt-1">{completionRate}%</p>
            </div>
          </div>

          <div className={`${cardClasses} p-6 rounded-3xl shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1`}>
            <div className="p-4 bg-yellow-500/20 rounded-2xl text-yellow-500 shadow-inner">
              <Tag className="w-8 h-8" />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Labeled Cards</p>
              <p className="text-4xl font-black mt-1">{Object.values(labelCounts).reduce((a,b)=>a+b, 0)}</p>
            </div>
          </div>
        </div>

        {/* Charts / Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cards per list */}
          <div className={`${cardClasses} p-8 rounded-3xl shadow-xl`}>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">Cards per List</h3>
            <div className="space-y-6">
              {lists.map(list => {
                const percentage = totalCards === 0 ? 0 : (list.cards.length / totalCards) * 100;
                return (
                  <div key={list.id} className="group">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span className="group-hover:text-blue-500 transition-colors">{list.title}</span>
                      <span className={`${textMuted}`}>{list.cards.length} cards</span>
                    </div>
                    <div className={`h-4 w-full rounded-full overflow-hidden shadow-inner ${isLight ? 'bg-gray-200' : 'bg-black/40'}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {lists.length === 0 && (
                <p className={`text-sm ${textMuted} italic`}>No lists exist on this board.</p>
              )}
            </div>
          </div>

          {/* Label Distribution */}
          <div className={`${cardClasses} p-8 rounded-3xl shadow-xl`}>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">Label Distribution</h3>
            {Object.keys(labelCounts).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center opacity-70">
                <Tag className="w-12 h-12 mb-3 text-gray-400" />
                <p className={`text-sm ${textMuted} italic`}>No labeled cards found on this board.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(labelCounts).map(([color, count]) => {
                  const percentage = (count / Object.values(labelCounts).reduce((a,b)=>a+b, 0)) * 100;
                  return (
                    <div key={color}>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded shadow-sm ${color}`} />
                          <span className="capitalize">{color.split('-')[1]} Label</span>
                        </span>
                        <span className={`${textMuted}`}>{count} cards ({Math.round(percentage)}%)</span>
                      </div>
                      <div className={`h-4 w-full rounded-full overflow-hidden shadow-inner ${isLight ? 'bg-gray-200' : 'bg-black/40'}`}>
                        <div 
                          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out opacity-90`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
