import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, HelpCircle, Settings, ChevronDown,
  LayoutDashboard, Zap, BarChart3, Calendar, Menu, X,
  Plus, LayoutTemplate, Edit2, Trash2, LogOut, ChevronLeft, ChevronRight,
  Star, BookOpen
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

const BOARD_TEMPLATES = [
  {
    id: 'agile',
    title: 'Agile Sprint Kanban',
    desc: 'Sprint software engineering dengan alur backlog hingga deployment.',
    color: 'from-blue-600 to-indigo-600',
    lists: ['Backlog', 'In Progress', 'Code Review', 'Done'],
  },
  {
    id: 'design',
    title: 'Design & Creative Roadmap',
    desc: 'Pipeline desain UI/UX, eksplorasi visual, dan handoff developer.',
    color: 'from-purple-600 to-pink-600',
    lists: ['Ideas & Research', 'Wireframes', 'Review Desain', 'Final & Published'],
  },
  {
    id: 'project',
    title: 'Project Management',
    desc: 'Manajemen tugas lintas departemen dengan status bertahap.',
    color: 'from-emerald-600 to-teal-600',
    lists: ['To Do', 'In Progress', 'Under Review', 'Completed'],
  },
  {
    id: 'weekly',
    title: 'Weekly Task Planner',
    desc: 'Perencana jadwal mingguan kerja dan produktivitas harian.',
    color: 'from-amber-600 to-orange-600',
    lists: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
  },
];

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
  const boards = useBoardStore(s => s.boards);
  const activeBoardId = useBoardStore(s => s.activeBoardId);
  const setActiveBoard = useBoardStore(s => s.setActiveBoard);
  const createBoard = useBoardStore(s => s.createBoard);
  const starredBoardIds = useBoardStore(s => s.starredBoardIds || []);
  const toggleStarredBoard = useBoardStore(s => s.toggleStarredBoard);
  const setCurrentView = useBoardStore(s => s.setCurrentView);
  const setIsSettingsOpen = useBoardStore(s => s.setIsSettingsOpen);
  const logout = useBoardStore(s => s.logout);

  const [searchVal, setSearchVal] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'workspace' | 'recent' | 'starred' | 'templates' | 'create' | 'notif' | 'help' | 'profile'
  const searchRef = useRef(null);

  // New Board form state inside Create dropdown
  const [newTitle, setNewTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('from-blue-500 to-indigo-500');
  const [isCreating, setIsCreating] = useState(false);

  const notifications = [
    { id: 1, text: 'Kevin moved "Design landing page" to Done', time: '2m ago', read: false },
    { id: 2, text: 'You have a card due today: Database migration', time: '1h ago', read: false },
    { id: 3, text: 'New comment on "Implement Auth"', time: '3h ago', read: true },
  ];
  const unread = notifications.filter(n => !n.read).length;

  const toggleMenu = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleCreateNewBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      await createBoard(newTitle.trim(), selectedColor);
      setNewTitle('');
      setActiveDropdown(null);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <header className="h-12 bg-[#026AA7] flex items-center gap-2 px-3 shrink-0 z-50 relative">
      {/* Backdrop for closing open dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
        title="Toggle sidebar menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <button 
        onClick={() => { setCurrentView('board'); }}
        className="p-1 rounded hover:bg-white/20 transition-colors flex items-center cursor-pointer"
      >
        <TrelloLogo />
      </button>

      {/* Left Navigation Menus */}
      <div className="hidden md:flex items-center gap-1 relative z-50">
        
        {/* 1. WORKSPACE MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('workspace')}
            className={`flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeDropdown === 'workspace' ? 'bg-white/30' : 'hover:bg-white/20'
            }`}
          >
            Workspace <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>
          
          {activeDropdown === 'workspace' && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ruang Kerja Aktif</p>
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {currentUser?.name?.charAt(0) || 'W'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 leading-tight truncate">{currentUser?.name}'s Workspace</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Free Workspace</p>
                  </div>
                </div>
              </div>

              <div className="p-2 max-h-60 overflow-y-auto">
                <p className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Board Anda ({boards.length})</p>
                {boards.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setActiveBoard(b.id); setCurrentView('board'); setActiveDropdown(null); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                      b.id == activeBoardId ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-3.5 h-3.5 rounded shrink-0 bg-gradient-to-r ${b.color || 'from-blue-500 to-indigo-500'}`} />
                      <span className="truncate">{b.title}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">{(b.lists || []).length} list</span>
                  </button>
                ))}
              </div>

              <div className="p-2 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-1">
                <button
                  onClick={() => toggleMenu('create')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Board Baru
                </button>
                <button
                  onClick={() => { setIsSettingsOpen(true); setActiveDropdown(null); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" /> Pengaturan Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. RECENT MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('recent')}
            className={`flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeDropdown === 'recent' ? 'bg-white/30' : 'hover:bg-white/20'
            }`}
          >
            Recent <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          {activeDropdown === 'recent' && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Board Terbaru</h3>
                <span className="text-[11px] text-gray-400">{boards.length} board</span>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {boards.slice().reverse().map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setActiveBoard(b.id); setCurrentView('board'); setActiveDropdown(null); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                      b.id == activeBoardId ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-3.5 h-3.5 rounded shrink-0 bg-gradient-to-r ${b.color || 'from-blue-500 to-indigo-500'}`} />
                      <span className="truncate">{b.title}</span>
                    </div>
                    {b.id == activeBoardId && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Aktif</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. STARRED MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('starred')}
            className={`flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeDropdown === 'starred' ? 'bg-white/30' : 'hover:bg-white/20'
            }`}
          >
            Starred <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          {activeDropdown === 'starred' && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" /> Board Berbintang
                </h3>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {boards.filter(b => (starredBoardIds || []).some(id => id == b.id)).length > 0 ? (
                  boards.filter(b => (starredBoardIds || []).some(id => id == b.id)).map(b => (
                    <button
                      key={b.id}
                      onClick={() => { setActiveBoard(b.id); setCurrentView('board'); setActiveDropdown(null); }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm text-left hover:bg-gray-100 transition-colors text-gray-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className={`w-3.5 h-3.5 rounded shrink-0 bg-gradient-to-r ${b.color || 'from-blue-500 to-indigo-500'}`} />
                        <span className="truncate">{b.title}</span>
                      </div>
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500 shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold text-gray-700">Belum ada board berbintang</p>
                    <p className="text-[11px] text-gray-400 mt-1">Klik tanda bintang di header board untuk pin ke menu ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. TEMPLATES MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('templates')}
            className={`flex items-center gap-1 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeDropdown === 'templates' ? 'bg-white/30' : 'hover:bg-white/20'
            }`}
          >
            Templates <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          {activeDropdown === 'templates' && (
            <div className="absolute left-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" /> Template Siap Pakai
                </h3>
              </div>
              <div className="p-2 space-y-1.5 max-h-80 overflow-y-auto">
                {BOARD_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={async () => {
                      await createBoard(tpl.title, tpl.color, tpl.lists);
                      setActiveDropdown(null);
                    }}
                    className="w-full p-2.5 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded shrink-0 bg-gradient-to-r ${tpl.color}`} />
                      <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-700">{tpl.title}</h4>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">{tpl.desc}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-medium truncate">
                      <span>Kolom:</span>
                      <span className="text-gray-600 truncate">{tpl.lists.join(' → ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 5. CREATE BUTTON */}
      <div className="relative z-50">
        <button
          onClick={() => toggleMenu('create')}
          className={`flex items-center gap-1.5 bg-white text-[#0052CC] text-sm font-bold px-3 py-1.5 rounded transition-colors ml-1 cursor-pointer ${
            activeDropdown === 'create' ? 'bg-[#E9F2FF] ring-2 ring-white/60' : 'hover:bg-[#E9F2FF]'
          }`}
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create</span>
        </button>

        {activeDropdown === 'create' && (
          <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Buat Board Baru</h3>
            <form onSubmit={handleCreateNewBoard} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Judul Board</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Contoh: Sprint Mobile App"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Warna Tema</label>
                <div className="flex gap-2">
                  {[
                    'from-blue-500 to-indigo-500',
                    'from-purple-600 to-pink-600',
                    'from-green-500 to-emerald-500',
                    'from-orange-500 to-red-500',
                    'from-slate-700 to-slate-900',
                  ].map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-md bg-gradient-to-r ${c} transition-transform cursor-pointer ${
                        selectedColor === c ? 'scale-110 ring-2 ring-blue-600 ring-offset-1' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {isCreating ? 'Membuat...' : 'Buat Board'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 focus-within:bg-white text-white focus-within:text-gray-800 rounded-md px-3 py-1.5 transition-all w-44 focus-within:w-64 lg:focus-within:w-80">
          <Search className="w-4 h-4 shrink-0 opacity-80" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search cards..."
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); useBoardStore.getState().setSearchQuery(e.target.value); }}
            className="bg-transparent outline-none text-sm w-full placeholder-white/70 focus:placeholder-gray-400"
          />
          {searchVal && (
            <button onClick={() => { setSearchVal(''); useBoardStore.getState().setSearchQuery(''); }} className="shrink-0 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-0.5 relative z-50">
        
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('notif')}
            className={`relative p-2 rounded text-white transition-colors cursor-pointer ${activeDropdown === 'notif' ? 'bg-white/30' : 'hover:bg-white/20'}`}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#026AA7]">
                {unread}
              </span>
            )}
          </button>

          {activeDropdown === 'notif' && (
            <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                <span className="text-xs text-blue-600 font-medium">Tandai sudah dibaca</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. HELP MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('help')}
            title="Bantuan & Panduan"
            className={`p-2 rounded text-white transition-colors cursor-pointer ${activeDropdown === 'help' ? 'bg-white/30' : 'hover:bg-white/20'}`}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {activeDropdown === 'help' && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> Panduan & Pintasan Fitur
              </h3>
              <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                <div className="flex gap-2">
                  <span className="font-bold text-gray-800 shrink-0">🖱️ Drag & Drop:</span>
                  <span>Geser kartu antar kolom untuk memindahkan tahapan status tugas.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-800 shrink-0">📋 Sub-tugas:</span>
                  <span>Buka kartu tugas untuk mengelola checklist dan mencentang progres.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-800 shrink-0">⭐ Starred:</span>
                  <span>Tandai board favorit agar selalu tampil di menu Starred atas.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-800 shrink-0">⚙️ Pengaturan:</span>
                  <span>Ganti nama, password, dan wallpaper board di menu Settings.</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Versi Aplikasi</span>
                <span className="text-gray-700 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> v1.2.0 Stable
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Settings Shortcut Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          title="Pengaturan & Preferensi"
          className="p-2 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 7. AVATAR / PROFILE MENU */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('profile')}
            title="Profil Pengguna & Akun"
            className={`ml-1 w-8 h-8 rounded-full overflow-hidden border-2 transition-colors cursor-pointer ${
              activeDropdown === 'profile' ? 'border-white ring-2 ring-white/50' : 'border-white/40 hover:border-white'
            }`}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'user'}&backgroundColor=b6e3f4`}
              alt="Avatar"
              className="w-full h-full object-cover bg-blue-200"
            />
          </button>

          {activeDropdown === 'profile' && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'user'}&backgroundColor=b6e3f4`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-gray-200 bg-blue-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser?.email || 'kevin@example.com'}</p>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => { setIsSettingsOpen(true); setActiveDropdown(null); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-gray-500" /> Pengaturan & Profil
                </button>
                <button
                  onClick={() => { logout(); setActiveDropdown(null); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" /> Keluar Akun
                </button>
              </div>
            </div>
          )}
        </div>

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
  const starredBoardIds = useBoardStore(s => s.starredBoardIds || []);
  const toggleStarredBoard = useBoardStore(s => s.toggleStarredBoard);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingHeaderTitle, setEditingHeaderTitle] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');

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
                  onClick={() => activeBoard && toggleStarredBoard(activeBoard.id)}
                  className={`trello-btn text-sm flex items-center gap-1.5 h-8 px-3 transition-colors ${
                    (starredBoardIds || []).some(id => id == activeBoardId) ? 'bg-yellow-400/40 text-yellow-200' : ''
                  }`}
                >
                  <span>{(starredBoardIds || []).some(id => id == activeBoardId) ? '⭐' : '☆'}</span> {(starredBoardIds || []).some(id => id == activeBoardId) ? 'Starred' : 'Star'}
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
