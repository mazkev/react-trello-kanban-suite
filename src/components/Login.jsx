import { LayoutTemplate, ArrowRight } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { useState } from 'react';

export default function Login() {
  const setAppMode = useBoardStore(state => state.setAppMode);
  const setCurrentUser = useBoardStore(state => state.setCurrentUser);
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      // Derive name from email (e.g. "john.doe@email.com" -> "John Doe")
      const namePart = email.split('@')[0];
      const formattedName = namePart.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      setCurrentUser({ name: formattedName || 'User', email });
    }
    setAppMode('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden bg-[#0f172a] font-sans py-12">
      {/* Background with abstract shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 text-3xl font-bold tracking-tight mb-8">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <LayoutTemplate className="w-8 h-8 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Glass Elite</span>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
           
           <h2 className="text-2xl font-bold text-white mb-8 text-center">Log in to continue</h2>
           
           <form 
            className="space-y-5"
            onSubmit={handleLogin}
           >
             <div>
               <label className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Email address</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter your email" 
                 className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-black/30 transition-all text-sm"
               />
             </div>
             <div>
               <div className="flex justify-between items-center mb-2">
                 <label className="block text-[11px] font-bold uppercase tracking-widest text-white/50">Password</label>
                 <a href="#" className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
               </div>
               <input 
                 type="password" 
                 required
                 placeholder="Enter password" 
                 className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-black/30 transition-all text-sm"
               />
             </div>
             
             <button 
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-4 font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] mt-6 flex items-center justify-center gap-2 group"
             >
               Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </form>
           
           <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
             <span>Don't have an account? </span>
             <button onClick={() => setAppMode('landing')} className="font-semibold text-white hover:text-blue-400 transition-colors">
               Sign up
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
