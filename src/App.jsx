import { useState } from 'react';
import { LayoutTemplate, Search, Bell, Palette, Moon, Sun, LayoutDashboard, Zap, BarChart3, Menu, Calendar } from 'lucide-react';
import Board from './components/Board';
import Statistics from './components/Statistics';
import Workflows from './components/Workflows';
import CalendarView from './components/CalendarView';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Login from './components/Login';
import { useBoardStore } from './store/useBoardStore';

const BACKGROUNDS = {
  'dark': { type: 'color', value: '#0f172a' },
  'black': { type: 'color', value: '#000000' },
  'light': { type: 'color', value: '#f1f5f9' },
  'scenic-1': { type: 'image', value: 'url("https://images.unsplash.com/photo-1506744626753-dba7d41543fc?auto=format&fit=crop&q=80&w=2560&ixlib=rb-4.0.3")' },
  'scenic-2': { type: 'image', value: 'url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=2560&ixlib=rb-4.0.3")' },
  'scenic-3': { type: 'image', value: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2560&ixlib=rb-4.0.3")' },
};

function Dashboard() {
  const theme = useBoardStore(state => state.theme);
  const setTheme = useBoardStore(state => state.setTheme);
  const skin = useBoardStore(state => state.skin);
  const setSkin = useBoardStore(state => state.setSkin);
  const view = useBoardStore(state => state.currentView);
  const setView = useBoardStore(state => state.setCurrentView);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentBg = BACKGROUNDS[theme] || BACKGROUNDS['dark'];
  const isLight = skin === 'light';

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'light') setSkin('light');
    if (newTheme === 'dark' || newTheme === 'black') setSkin('dark');
    setShowThemeMenu(false);
  };

  return (
    <div 
      className={`h-screen flex font-sans relative overflow-hidden transition-colors duration-500`}
      style={{
        background: currentBg.value,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for better readability on images */}
      {currentBg.type === 'image' && (
        <div className={`absolute inset-0 ${isLight ? 'bg-white/20' : 'bg-black/40'} pointer-events-none transition-colors duration-500`} />
      )}

      {/* Main Layout containing Sidebar and Content */}
      <div className="absolute inset-0 flex">
        {/* Desktop Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
          {/* Header */}
          <header className={`h-[64px] ${isLight ? 'glass-panel-light text-gray-800' : 'glass-panel-dark text-white'} flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-lg relative z-50 transition-colors duration-300`}>
            
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle Button */}
              {!sidebarOpen && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-xl transition-colors group ${isLight ? 'hover:bg-gray-900/5' : 'hover:bg-white/10'}`}
                >
                  <Menu className={`w-5 h-5 ${isLight ? 'text-gray-600 group-hover:text-gray-900' : 'text-white/80 group-hover:text-white'}`} />
                </button>
              )}
              
              {/* Logo */}
              <div className={`flex items-center gap-3 text-xl font-bold tracking-tight ${sidebarOpen ? 'md:hidden' : ''}`}>
                <div className="bg-blue-600/80 p-1.5 rounded-lg shadow-inner">
                  <LayoutTemplate className="w-5 h-5 text-white" />
                </div>
                <h1 className={`bg-clip-text text-transparent bg-gradient-to-r ${isLight ? 'from-gray-900 to-gray-600' : 'from-white to-white/70'} hidden sm:block`}>Glass Elite</h1>
              </div>
            </div>

            {/* In Desktop mode, we can just push right side items to the end if we want, or add search on left */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
              <div className={`flex flex-1 items-center rounded-full px-4 py-1.5 backdrop-blur-md transition-colors ${isLight ? 'bg-gray-900/5 focus-within:bg-gray-900/10 border border-gray-900/10' : 'bg-white/10 focus-within:bg-white/20 border border-white/10'}`}>
                <Search className={`w-4 h-4 mr-2 ${isLight ? 'text-gray-500' : 'text-white/70'}`} />
                <input 
                  type="text" 
                  value={useBoardStore(state => state.searchQuery)}
                  onChange={(e) => useBoardStore.getState().setSearchQuery(e.target.value)}
                  placeholder="Search cards, boards, or members..." 
                  className={`bg-transparent border-none outline-none text-sm w-full ${isLight ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-white/50'}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              {/* Mobile Search Icon */}
              <button className={`md:hidden p-2 rounded-full transition-colors relative group ${isLight ? 'hover:bg-gray-900/5' : 'hover:bg-white/10'}`}>
                <Search className={`w-5 h-5 ${isLight ? 'text-gray-600 group-hover:text-gray-900' : 'text-white/80 group-hover:text-white'}`} />
              </button>

              <button className={`p-2 rounded-full transition-colors relative group ${isLight ? 'hover:bg-gray-900/5' : 'hover:bg-white/10'}`}>
                <Bell className={`w-5 h-5 ${isLight ? 'text-gray-600 group-hover:text-gray-900' : 'text-white/80 group-hover:text-white'}`} />
                <span className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border ${isLight ? 'border-white' : 'border-gray-900'} shadow-sm`}></span>
              </button>

              {/* Theme Picker */}
              <div className="relative">
                <button 
                  className={`p-2 rounded-full transition-colors group ${isLight ? 'hover:bg-gray-900/5' : 'hover:bg-white/10'}`}
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                >
                  <Palette className={`w-5 h-5 ${isLight ? 'text-gray-600 group-hover:text-gray-900' : 'text-white/80 group-hover:text-white'}`} />
                </button>
                
                {showThemeMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowThemeMenu(false)} 
                    />
                    <div className={`absolute right-0 top-12 w-64 ${isLight ? 'bg-white/95 border-gray-200 text-gray-800' : 'bg-gray-900/95 border-white/10 text-white/80'} backdrop-blur-xl rounded-xl shadow-2xl py-3 z-50 border`}>
                      <div className={`px-4 pb-2 mb-2 border-b ${isLight ? 'border-gray-200' : 'border-white/10'} text-sm font-semibold`}>
                        Theme & Background
                      </div>

                      <div className="px-4 mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-70">Glass Skin</span>
                        <div className={`flex items-center p-0.5 rounded-lg ${isLight ? 'bg-gray-200' : 'bg-black/50'}`}>
                          <button 
                            className={`p-1 rounded-md transition-colors ${!isLight ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                            onClick={() => setSkin('dark')}
                          >
                            <Moon className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            className={`p-1 rounded-md transition-colors ${isLight ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setSkin('light')}
                          >
                            <Sun className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="px-2 grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => handleSetTheme('dark')}
                          className={`h-12 rounded-lg border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-transparent'} bg-slate-900 hover:opacity-80 transition-opacity`}
                          title="Slate Dark"
                        />
                        <button 
                          onClick={() => handleSetTheme('black')}
                          className={`h-12 rounded-lg border-2 ${theme === 'black' ? 'border-blue-500' : 'border-transparent'} bg-black hover:opacity-80 transition-opacity`}
                          title="Pure Black"
                        />
                        <button 
                          onClick={() => handleSetTheme('light')}
                          className={`h-12 rounded-lg border-2 ${theme === 'light' ? 'border-blue-500' : 'border-gray-200'} bg-slate-100 hover:opacity-80 transition-opacity`}
                          title="Light Mode"
                        />
                        <button 
                          onClick={() => handleSetTheme('scenic-1')}
                          className={`h-12 rounded-lg border-2 ${theme === 'scenic-1' ? 'border-blue-500' : 'border-transparent'} bg-cover bg-center`}
                          style={{ backgroundImage: BACKGROUNDS['scenic-1'].value }}
                          title="Mountains"
                        />
                        <button 
                          onClick={() => handleSetTheme('scenic-2')}
                          className={`h-12 rounded-lg border-2 ${theme === 'scenic-2' ? 'border-blue-500' : 'border-transparent'} bg-cover bg-center`}
                          style={{ backgroundImage: BACKGROUNDS['scenic-2'].value }}
                          title="Forest"
                        />
                        <button 
                          onClick={() => handleSetTheme('scenic-3')}
                          className={`h-12 rounded-lg border-2 ${theme === 'scenic-3' ? 'border-blue-500' : 'border-transparent'} bg-cover bg-center`}
                          style={{ backgroundImage: BACKGROUNDS['scenic-3'].value }}
                          title="Beach"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Area */}
          <main className="flex-1 overflow-hidden relative z-0">
            {view === 'board' && <Board />}
            {view === 'statistics' && <Statistics />}
            {view === 'workflows' && <Workflows />}
            {view === 'calendar' && <CalendarView />}
          </main>
          
          {/* Mobile Navigation Bar */}
          <div className={`md:hidden h-[60px] shrink-0 border-t flex items-center justify-around z-50 ${isLight ? 'bg-white/80 border-gray-200' : 'bg-gray-900/80 border-white/10'} backdrop-blur-lg`}>
            <button 
              onClick={() => setView('board')}
              className={`flex flex-col items-center gap-1 ${view === 'board' ? 'text-blue-500' : isLight ? 'text-gray-500' : 'text-white/50'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-medium">Board</span>
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`flex flex-col items-center gap-1 ${view === 'calendar' ? 'text-blue-500' : isLight ? 'text-gray-500' : 'text-white/50'}`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-medium">Calendar</span>
            </button>
            <button 
              onClick={() => setView('workflows')}
              className={`flex flex-col items-center gap-1 ${view === 'workflows' ? 'text-blue-500' : isLight ? 'text-gray-500' : 'text-white/50'}`}
            >
              <Zap className="w-5 h-5" />
              <span className="text-[10px] font-medium">Workflows</span>
            </button>
            <button 
              onClick={() => setView('statistics')}
              className={`flex flex-col items-center gap-1 ${view === 'statistics' ? 'text-blue-500' : isLight ? 'text-gray-500' : 'text-white/50'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px] font-medium">Stats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const appMode = useBoardStore(state => state.appMode);
  
  if (appMode === 'landing') return <Landing />;
  if (appMode === 'login') return <Login />;
  return <Dashboard />;
}
