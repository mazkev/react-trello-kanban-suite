import { LayoutDashboard, Zap, BarChart3, Plus, Settings, X, Edit2, Trash2, Check, Calendar } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { useState } from 'react';

export default function Sidebar({ isOpen, onClose }) {
  const currentView = useBoardStore(state => state.currentView);
  const setCurrentView = useBoardStore(state => state.setCurrentView);
  const boards = useBoardStore(state => state.boards);
  const activeBoardId = useBoardStore(state => state.activeBoardId);
  const setActiveBoard = useBoardStore(state => state.setActiveBoard);
  const createBoard = useBoardStore(state => state.createBoard);
  const renameBoard = useBoardStore(state => state.renameBoard);
  const deleteBoard = useBoardStore(state => state.deleteBoard);
  const skin = useBoardStore(state => state.skin);
  const currentUser = useBoardStore(state => state.currentUser);
  const isLight = skin === 'light';

  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editBoardTitle, setEditBoardTitle] = useState('');

  const handleCreateBoard = () => {
    createBoard(`New Board ${boards.length + 1}`);
  };

  const handleStartEdit = (e, board) => {
    e.stopPropagation();
    setEditingBoardId(board.id);
    setEditBoardTitle(board.title);
  };

  const handleSaveEdit = (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();
    if (editBoardTitle.trim()) {
      renameBoard(boardId, editBoardTitle.trim());
    }
    setEditingBoardId(null);
  };

  const handleDelete = (e, boardId) => {
    e.stopPropagation();
    deleteBoard(boardId);
  };

  if (!isOpen) return null;

  return (
    <aside className={`w-64 h-full shrink-0 flex flex-col transition-all border-r ${isLight ? 'bg-white/80 border-gray-200 shadow-xl' : 'bg-gray-900/80 border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]'} backdrop-blur-2xl z-50 absolute md:relative`}>
      {/* Profile Section */}
      <div className={`p-5 flex items-center justify-between border-b ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'User'}`} 
            alt="User avatar" 
            className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-colors ${isLight ? 'border-gray-300 bg-gray-100' : 'border-white/20 bg-white/10'}`}
          />
          <div className="flex-1 min-w-0 pr-2">
            <p className={`text-sm font-bold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>{currentUser?.name || 'User'}</p>
            <p className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-white/50'}`}>{currentUser?.email || ''}</p>
          </div>
        </div>
        <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-white/10 text-white/50'}`} title="Collapse sidebar">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {/* Views */}
        <div className="space-y-1 mt-6">
          <p className={`px-3 text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>Views</p>
          <button 
            onClick={() => setCurrentView('board')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'board' 
                ? 'bg-blue-600/20 text-blue-500' 
                : isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Board
          </button>
          <button 
            onClick={() => setCurrentView('calendar')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'calendar' 
                ? 'bg-blue-600/20 text-blue-500' 
                : isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" /> Calendar
          </button>
          <button 
            onClick={() => setCurrentView('workflows')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'workflows' 
                ? 'bg-blue-600/20 text-blue-500' 
                : isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" /> Workflows
          </button>
          <button 
            onClick={() => setCurrentView('statistics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'statistics' 
                ? 'bg-blue-600/20 text-blue-500' 
                : isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Statistics
          </button>
        </div>

        {/* Boards Menu */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <p className={`text-[10px] uppercase font-bold tracking-widest ${isLight ? 'text-gray-400' : 'text-white/40'}`}>Your Boards</p>
            <button onClick={handleCreateBoard} className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-white/10 text-white/50'}`}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {boards.map(board => (
              <div 
                key={board.id}
                onClick={() => setActiveBoard(board.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer group ${activeBoardId == board.id ? (isLight ? 'bg-gray-100/80 text-gray-900 border border-gray-200 shadow-sm' : 'bg-white/10 text-white border border-white/10 shadow-sm') : (isLight ? 'text-gray-600 hover:bg-gray-50' : 'text-white/70 hover:bg-white/5')}`}
              >
                <span className={`w-6 h-4 rounded bg-gradient-to-r ${board.color} shrink-0 shadow-sm`} />
                
                {editingBoardId == board.id ? (
                  <form onSubmit={(e) => handleSaveEdit(e, board.id)} className="flex-1 flex items-center gap-1">
                    <input 
                      autoFocus
                      type="text"
                      value={editBoardTitle}
                      onChange={(e) => setEditBoardTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => handleSaveEdit(e, board.id)}
                      className={`flex-1 min-w-0 bg-transparent border-b ${isLight ? 'border-blue-500 text-gray-900' : 'border-blue-400 text-white'} outline-none px-1 py-0.5 text-sm`}
                    />
                  </form>
                ) : (
                  <>
                    <span className="truncate flex-1 text-left">{board.title}</span>
                    <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button 
                        onClick={(e) => handleStartEdit(e, board)}
                        className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-white text-gray-500 hover:text-blue-600 shadow-sm' : 'hover:bg-black/40 text-white/70 hover:text-blue-400'}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, board.id)}
                        className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-white text-gray-500 hover:text-red-600 shadow-sm' : 'hover:bg-black/40 text-white/70 hover:text-red-400'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            <button 
              onClick={handleCreateBoard}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent border-dashed ${isLight ? 'text-gray-500 hover:bg-gray-50 hover:border-gray-300' : 'text-white/50 hover:bg-white/5 hover:border-white/20 mt-2'}`}
            >
              <div className={`w-6 h-4 rounded flex items-center justify-center shrink-0 ${isLight ? 'bg-gray-200' : 'bg-white/10'}`}>
                <Plus className="w-3 h-3" />
              </div>
              <span className="truncate">Create new board</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`p-4 border-t ${isLight ? 'border-gray-200' : 'border-white/10'} space-y-1`}>
        <button 
          onClick={() => useBoardStore.getState().setIsSettingsOpen(true)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'}`}
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button 
          onClick={() => useBoardStore.getState().logout()}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'}`}
        >
          <span className="w-4 h-4 flex items-center justify-center font-bold">↳</span> Log out
        </button>
      </div>
    </aside>
  );
}
