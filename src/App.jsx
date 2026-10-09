import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, HelpCircle, Settings, ChevronDown,
  LayoutDashboard, Zap, BarChart3, Calendar, Menu, X,
  Plus, LayoutTemplate, Edit2, Trash2, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import Board from './components/Board';
import Statistics from './components/Statistics';
import Workflows from './components/Workflows';
import CalendarView from './components/CalendarView';
import Landing from './components/Landing';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import { useBoardStore } from './store/useBoardStore';

const BG_MAP = {
  'blue':    { css: 'background: #0079BF;', type: 'color' },
  'dark':    { css: 'background: #1D2125;', type: 'color' },
  'green':   { css: 'background: #519839;', type: 'color' },
  'violet':  { css: 'background: #89609E;', type: 'color' },
  'scenic-1':{ css: '', type: 'image', cls: 'bg-scenic-1' },
  'scenic-2':{ css: '', type: 'image', cls: 'bg-scenic-2' },
  'scenic-3':{ css: '', type: 'image', cls: 'bg-scenic-3' },
};

function TrelloLogo() {
  return (
    <svg viewBox="0 0 50 42" className="w-[50px] h-[42px] fill-white">
      <rect rx="5" height="42" width="50" />
      <rect fill="#0079BF" rx="3" height="26" width="13" y="8" x="6" />
      <rect fill="#0079BF" rx="3" height="18" width="13" y="8" x="25" />
    </svg>
  );
}

function GlobalNav({ onToggleSidebar, sidebarOpen }) {
  const currentUser = useBoardStore(s => s.currentUser);
  const [searchVal, setSearchVal] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const searchRef = useRef(null);

  const notifications = [
    { id: 1, text: 'Kevin moved "Design landing page" to Done', time: '2m ago', read: false },
    { id: 2, text: 'You have a card due today: Database migration', time: '1h ago', read: false },
    { id: 3, text: 'New comment on "Implement Auth"', time: '3h ago', read: true },
  ];
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-12 bg-[#026AA7] flex items-center gap-2 px-3 shrink-0 z-50 relative">
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded hover:bg-white/20 text-white transition-colors"
        title="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <button className="p-1 rounded hover:bg-white/20 transition-colors flex items-center">
        <TrelloLogo />
      </button>

      {/* Workspace Dropdown */}
      <div className="hidden md:flex">
        <button className="flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
          Workspace <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
        <button className="flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
          Recent <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
        <button className="flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
          Starred <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
        <button className="flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
          Templates <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
      </div>

      {/* Create Button */}
      <button
        onClick={() => setCreateOpen(!createOpen)}
        className="flex items-center gap-1.5 bg-white text-[#0052CC] text-sm font-bold px-3 py-1.5 rounded hover:bg-[#E9F2FF] transition-colors ml-1"
      >
        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 focus-within:bg-white text-white focus-within:text-gray-800 rounded-md px-3 py-1.5 transition-all w-44 focus-within:w-64 lg:focus-within:w-80">
          <Search className="w-4 h-4 shrink-0 opacity-80" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); useBoardStore.getState().setSearchQuery(e.target.value); }}
            className="bg-transparent outline-none text-sm w-full placeholder-white/70 focus:placeholder-gray-400"
          />
          {searchVal && (
            <button onClick={() => { setSearchVal(''); useBoardStore.getState().setSearchQuery(''); }} className="shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-0.5">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded hover:bg-white/20 text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#026AA7]">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-10 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 fade-in overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-base">Notifications</h3>
                  <button className="text-xs text-blue-600 hover:underline font-medium">Mark all read</button>
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-5 py-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-gray-100 text-center">
                  <button className="text-sm text-blue-600 hover:underline font-medium">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        <button className="p-2 rounded hover:bg-white/20 text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button 
          onClick={() => useBoardStore.getState().setIsSettingsOpen(true)}
          title="Pengaturan & Preferensi"
          className="p-2 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <button 
          onClick={() => useBoardStore.getState().setIsSettingsOpen(true)}
          title="Profil Pengguna & Akun"
          className="ml-1 w-8 h-8 rounded-full overflow-hidden border-2 border-white/40 hover:border-white transition-colors cursor-pointer"
        >
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'user'}&backgroundColor=b6e3f4`}
            alt="Avatar"
            className="w-full h-full object-cover bg-blue-200"
          />
        </button>
      </div>
    </header>
  );
}

function WorkspaceSidebar({ isOpen, onClose }) {
  const currentView = useBoardStore(s => s.currentView);
  const setCurrentView = useBoardStore(s => s.setCurrentView);
  const boards = useBoardStore(s => s.boards);
  const activeBoardId = useBoardStore(s => s.activeBoardId);
  const setActiveBoard = useBoardStore(s => s.setActiveBoard);
  const createBoard = useBoardStore(s => s.createBoard);
  const renameBoard = useBoardStore(s => s.renameBoard);
  const deleteBoard = useBoardStore(s => s.deleteBoard);
  const currentUser = useBoardStore(s => s.currentUser);
  const theme = useBoardStore(s => s.theme);
  const setTheme = useBoardStore(s => s.setTheme);

  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editBoardTitle, setEditBoardTitle] = useState('');

  const navItems = [
    { id: 'board', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Boards' },
    { id: 'calendar', icon: <Calendar className="w-4 h-4" />, label: 'Calendar' },
    { id: 'workflows', icon: <Zap className="w-4 h-4" />, label: 'Automation' },
    { id: 'statistics', icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics' },
  ];

  const bgOptions = [
    { key: 'blue', label: 'Ocean', style: { background: '#0079BF' } },
    { key: 'dark', label: 'Slate', style: { background: '#1D2125' } },
    { key: 'green', label: 'Forest', style: { background: '#519839' } },
    { key: 'violet', label: 'Violet', style: { background: '#89609E' } },
    { key: 'scenic-1', label: 'Mountains', className: 'bg-scenic-1' },
    { key: 'scenic-2', label: 'Nature', className: 'bg-scenic-2' },
    { key: 'scenic-3', label: 'Beach', className: 'bg-scenic-3' },
  ];

  return (
    <>
      {/* Mobile overlay with smooth fade */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />

      <aside 
        className={`shrink-0 bg-white border-r border-gray-200 flex flex-col h-full z-40 fixed md:relative shadow-xl md:shadow-none transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen 
            ? 'w-[260px] translate-x-0 opacity-100 pointer-events-auto' 
            : 'w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 pointer-events-none border-r-0'
        }`}
      >
        <div className="w-[260px] min-w-[260px] flex flex-col h-full">
          {/* Workspace Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {currentUser?.name?.charAt(0) || 'W'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{currentUser?.name}'s Workspace</p>
              <p className="text-xs text-gray-500">Free</p>
            </div>
            <button 
              onClick={onClose} 
              title="Tutup sidebar"
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 hidden md:block" />
              <X className="w-4 h-4 md:hidden" />
            </button>
          </div>

        <div className="flex-1 overflow-y-auto py-3 px-2">
          {/* Views */}
          <div className="mb-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  currentView === item.id
                    ? 'bg-[#E9F2FF] text-[#0052CC]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={currentView === item.id ? 'text-[#0052CC]' : 'text-gray-500'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Boards */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 py-1.5 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your boards</span>
              <button
                onClick={() => createBoard(`Board ${boards.length + 1}`)}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                title="Create board"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {boards.map(board => (
              <div
                key={board.id}
                onClick={() => { setActiveBoard(board.id); setCurrentView('board'); }}
                className={`group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 cursor-pointer ${
                  activeBoardId == board.id && currentView === 'board'
                    ? 'bg-[#E9F2FF] text-[#0052CC]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`w-6 h-5 rounded bg-gradient-to-br ${board.color} shrink-0 shadow-sm`} />
                  {editingBoardId == board.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editBoardTitle}
                      onChange={e => setEditBoardTitle(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      onBlur={() => {
                        if (editBoardTitle.trim()) renameBoard(board.id, editBoardTitle.trim());
                        setEditingBoardId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (editBoardTitle.trim()) renameBoard(board.id, editBoardTitle.trim());
                          setEditingBoardId(null);
                        }
                        if (e.key === 'Escape') setEditingBoardId(null);
                      }}
                      className="flex-1 bg-white border border-[#0052CC] rounded px-1.5 py-0.5 text-xs text-gray-800 outline-none"
                    />
                  ) : (
                    <span className="truncate">{board.title}</span>
                  )}
                </div>

                {editingBoardId != board.id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoardId(board.id);
                        setEditBoardTitle(board.title);
                      }}
                      title="Rename board"
                      className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus board "${board.title}" beserta seluruh kolom dan kartunya?`)) {
                          deleteBoard(board.id);
                        }
                      }}
                      title="Hapus board ini"
                      className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => createBoard(`Board ${boards.length + 1}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <span className="w-6 h-5 rounded bg-gray-200 flex items-center justify-center shrink-0">
                <Plus className="w-3 h-3 text-gray-500" />
              </span>
              Create new board
            </button>
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Background picker */}
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Board Background</p>
            <div className="grid grid-cols-4 gap-1.5">
              {bgOptions.map(bg => (
                <button
                  key={bg.key}
                  onClick={() => setTheme(bg.key)}
                  title={bg.label}
                  className={`h-8 rounded-md border-2 transition-all ${theme === bg.key ? 'border-[#0052CC] scale-105' : 'border-transparent hover:border-gray-300'} ${bg.className || ''}`}
                  style={bg.style || {}}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 p-3 space-y-0.5">
          <button 
            onClick={() => useBoardStore.getState().setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-gray-500" /> Settings
          </button>
          <button
            onClick={() => useBoardStore.getState().logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">↳</span> Log out
          </button>
        </div>
        </div>
      </aside>
    </>
  );
}

function Dashboard() {
  const theme = useBoardStore(s => s.theme);
  const view = useBoardStore(s => s.currentView);
  const boards = useBoardStore(s => s.boards);
  const activeBoardId = useBoardStore(s => s.activeBoardId);
  const fetchBoards = useBoardStore(s => s.fetchBoards);
  const renameBoard = useBoardStore(s => s.renameBoard);
  const deleteBoard = useBoardStore(s => s.deleteBoard);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingHeaderTitle, setEditingHeaderTitle] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const activeBoard = boards.find(b => b.id == activeBoardId);
  const bg = BG_MAP[theme] || BG_MAP['blue'];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Global Nav */}
      <GlobalNav onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />

      {/* Below Nav */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <WorkspaceSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Floating toggle button when sidebar is collapsed on desktop */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            title="Buka sidebar"
            className="hidden md:flex absolute top-3 left-3 z-30 p-2 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur border border-gray-200/80 transition-all hover:scale-105 items-center justify-center cursor-pointer group"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        )}

        {/* Main */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${bg.cls || ''}`}
          style={bg.type === 'color' ? { background: bg.css.replace('background: ', '').replace(';','') } : {}}
        >
          {/* Board Sub-header */}
          {view === 'board' && (
            <div className="board-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                {editingHeaderTitle ? (
                  <input
                    autoFocus
                    type="text"
                    value={headerTitle}
                    onChange={e => setHeaderTitle(e.target.value)}
                    onBlur={() => {
                      if (headerTitle.trim() && activeBoard) {
                        renameBoard(activeBoard.id, headerTitle.trim());
                      }
                      setEditingHeaderTitle(false);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        if (headerTitle.trim() && activeBoard) {
                          renameBoard(activeBoard.id, headerTitle.trim());
                        }
                        setEditingHeaderTitle(false);
                      }
                      if (e.key === 'Escape') setEditingHeaderTitle(false);
                    }}
                    className="bg-white/20 text-white font-bold text-base px-2 py-0.5 rounded outline-none border border-white/50"
                  />
                ) : (
                  <h1
                    onClick={() => {
                      if (activeBoard) {
                        setHeaderTitle(activeBoard.title);
                        setEditingHeaderTitle(true);
                      }
                    }}
                    title="Klik untuk rename judul board"
                    className="text-white font-bold text-base cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-colors"
                  >
                    {activeBoard?.title || 'Board'}
                  </h1>
                )}
                <div className="w-px h-5 bg-white/30 mx-1" />
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className={`trello-btn text-sm flex items-center gap-1.5 h-8 px-3 ${isStarred ? 'bg-yellow-400/40 text-yellow-200' : ''}`}
                >
                  <span>{isStarred ? '⭐' : '☆'}</span> {isStarred ? 'Starred' : 'Star'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="trello-btn text-sm flex items-center gap-1.5 h-8 px-3">
                  <LayoutTemplate className="w-4 h-4" /> Power-Ups
                </button>
                <button className="trello-btn text-sm flex items-center gap-1.5 h-8 px-3">
                  <Zap className="w-4 h-4" /> Automation
                </button>
                <div className="w-px h-5 bg-white/30 mx-1" />
                <button
                  onClick={() => {
                    if (activeBoard && window.confirm(`Hapus board "${activeBoard.title}" beserta seluruh kolom dan kartunya?`)) {
                      deleteBoard(activeBoard.id);
                    }
                  }}
                  title="Hapus board ini"
                  className="trello-btn text-sm flex items-center gap-1.5 h-8 px-3 text-red-200 hover:text-white hover:bg-red-600/80 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Board
                </button>
              </div>
            </div>
          )}

          {/* View Content */}
          <div className="flex-1 overflow-hidden">
            {view === 'board' && <Board />}
            {view === 'statistics' && <Statistics />}
            {view === 'workflows' && <Workflows />}
            {view === 'calendar' && <CalendarView />}
          </div>
        </main>
      </div>

      {/* Global Settings & Preferences Modal */}
      <SettingsModal />
    </div>
  );
}

export default function App() {
  const appMode = useBoardStore(s => s.appMode);
  if (appMode === 'landing') return <Landing />;
  if (appMode === 'login') return <Login />;
  return <Dashboard />;
}
