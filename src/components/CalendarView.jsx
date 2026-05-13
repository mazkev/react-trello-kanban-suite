import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

export default function CalendarView() {
  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const skin = useBoardStore((state) => state.skin);
  const isLight = skin === 'light';

  const activeBoard = boards.find(b => b.id === activeBoardId);
  const lists = activeBoard?.lists || [];

  // Flatten all cards that have a dueDate
  const cardsWithDates = lists.flatMap(list => 
    list.cards.filter(c => c.dueDate).map(card => ({ ...card, listTitle: list.title }))
  ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const textMuted = isLight ? 'text-gray-500' : 'text-white/60';
  const cardClasses = isLight ? 'bg-white text-gray-800 border-gray-200' : 'bg-black/20 text-white border-white/10';

  return (
    <div className="h-full w-full p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10 pb-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-bold flex items-center gap-3 ${isLight ? 'text-gray-800' : 'text-white'}`}>
              <div className="p-2.5 bg-blue-500/20 rounded-xl shadow-inner">
                <CalendarIcon className="w-8 h-8 text-blue-500 fill-blue-500/20" />
              </div>
              Calendar & Deadlines
            </h2>
            <p className={`mt-3 text-lg flex items-center gap-2 ${textMuted}`}>
              Track upcoming due dates across your board.
            </p>
          </div>
        </div>

        {cardsWithDates.length === 0 ? (
          <div className={`p-12 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${isLight ? 'border-gray-300 bg-gray-50/50' : 'border-white/20 bg-white/5'}`}>
             <CalendarIcon className={`w-16 h-16 mb-4 ${textMuted} opacity-50`} />
             <h3 className={`text-xl font-bold ${isLight ? 'text-gray-700' : 'text-white/80'}`}>No Upcoming Deadlines</h3>
             <p className={`mt-2 ${textMuted}`}>Add due dates to your cards to see them appear here in your calendar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardsWithDates.map(card => {
              const isOverdue = new Date(card.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !card.checked;
              
              return (
                <div key={card.id} className={`${cardClasses} p-6 rounded-2xl shadow-xl flex flex-col gap-4 border backdrop-blur-xl transition-transform hover:-translate-y-1`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isOverdue ? 'bg-red-100 text-red-700' : isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/20 text-blue-300'}`}>
                         {new Date(card.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                       </span>
                       {isOverdue && <span className="text-xs font-bold text-red-500">OVERDUE</span>}
                    </div>
                    {card.label && <div className={`w-3 h-3 rounded-full shadow-sm shrink-0 ${card.label}`} />}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg leading-tight mb-1.5">{card.content}</h4>
                    <p className={`text-xs font-medium flex items-center gap-1.5 ${textMuted}`}>
                      in <span className={`px-1.5 py-0.5 rounded font-bold ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white/80'}`}>{card.listTitle}</span>
                    </p>
                  </div>
                  
                  {card.checked ? (
                    <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> Completed
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-yellow-500">
                      <Clock className="w-4 h-4" /> Pending
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
