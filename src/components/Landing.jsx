import { LayoutTemplate, ArrowRight } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

export default function Landing() {
  const setAppMode = useBoardStore(state => state.setAppMode);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white font-sans">
      {/* Decorative blurred background orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <LayoutTemplate className="w-6 h-6 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Glass Elite</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setAppMode('login')}
            className="text-white/80 hover:text-white font-medium transition-colors hidden sm:block"
          >
            Log in
          </button>
          <button 
            onClick={() => setAppMode('login')}
            className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Get Glass Elite for free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-12 md:mt-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Bring all your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">tasks, teammates,</span><br className="hidden md:block" />
          and tools together.
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mb-12 leading-relaxed font-light">
          Keep everything in the same place—even if your team isn't. Glass Elite is the premium, transparent way to manage projects and reach new productivity heights.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 backdrop-blur-md transition-all text-lg"
          />
          <button 
            onClick={() => setAppMode('login')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold whitespace-nowrap transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 text-lg"
          >
            Sign up - it's free! <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mockup Preview Area */}
        <div className="mt-24 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent z-10 rounded-t-3xl" />
          <div className="bg-white/5 border border-white/10 rounded-t-3xl backdrop-blur-3xl p-8 overflow-hidden shadow-2xl relative h-80 sm:h-96 w-full flex justify-center">
             <div className="flex gap-6 opacity-60 w-[900px] absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="w-72 h-96 bg-white/5 rounded-2xl border border-white/5 p-4 space-y-4">
                   <div className="w-1/2 h-4 bg-white/20 rounded-full mb-6" />
                   <div className="w-full h-16 bg-white/10 rounded-xl" />
                   <div className="w-full h-24 bg-white/10 rounded-xl" />
                   <div className="w-full h-12 bg-white/10 rounded-xl" />
                </div>
                <div className="w-72 h-96 bg-white/5 rounded-2xl border border-white/5 p-4 space-y-4">
                   <div className="w-1/2 h-4 bg-white/20 rounded-full mb-6" />
                   <div className="w-full h-20 bg-white/10 rounded-xl" />
                   <div className="w-full h-16 bg-white/10 rounded-xl" />
                   <div className="w-full h-32 bg-white/10 rounded-xl" />
                </div>
                <div className="w-72 h-96 bg-white/5 rounded-2xl border border-white/5 p-4 space-y-4">
                   <div className="w-1/2 h-4 bg-white/20 rounded-full mb-6" />
                   <div className="w-full h-20 bg-white/10 rounded-xl" />
                   <div className="w-full h-24 bg-white/10 rounded-xl" />
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
