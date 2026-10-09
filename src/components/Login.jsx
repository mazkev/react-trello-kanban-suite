import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { api } from '../services/api';

export default function Login() {
  const setAppMode = useBoardStore(s => s.setAppMode);
  const setCurrentUser = useBoardStore(s => s.setCurrentUser);
  const fetchBoards = useBoardStore(s => s.fetchBoards);

  const [email, setEmail] = useState('kevin@example.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'password'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 'email' && email.trim()) {
      setStep('password');
      return;
    }

    if (step === 'password') {
      setLoading(true);
      try {
        let authRes;
        if (isRegisterMode) {
          const namePart = email.split('@')[0];
          const name = namePart.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          await api.register(name || 'User', email, password);
          authRes = await api.login(email, password);
        } else {
          authRes = await api.login(email, password);
        }

        if (authRes?.user) {
          setCurrentUser(authRes.user);
          await fetchBoards();
          setAppMode('dashboard');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Gagal login. Silakan periksa kembali email dan password Anda.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F2F4] flex flex-col items-center justify-center px-4 py-12 font-sans">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-[#0052CC] rounded-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-2.5 h-7 bg-white rounded-sm" />
            <div className="w-2.5 h-5 bg-white rounded-sm" />
          </div>
        </div>
        <span className="text-2xl font-extrabold text-[#172B4D] tracking-tight">Trello</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-[#172B4D] text-center mb-1">
          {isRegisterMode ? 'Buat Akun Trello Baru' : 'Masuk ke Trello'}
        </h1>
        <p className="text-sm text-[#44546F] text-center mb-6">
          {step === 'password' ? `Lanjutkan sebagai ${email}` : 'Kelola proyek dan tugas tim Anda'}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          {/* Email */}
          {step === 'email' && (
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">Email</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kevin@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-all placeholder-gray-400"
              />
            </div>
          )}

          {/* Password */}
          {step === 'password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#172B4D]">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 pr-10 text-sm text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-all placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0052CC] hover:bg-[#0065FF] text-white font-bold py-2.5 rounded-md transition-colors text-sm group shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghubungkan ke Backend Go...</span>
              </>
            ) : step === 'email' ? (
              <>
                <span>Lanjutkan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            ) : (
              <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk (Login)'}</span>
            )}
          </button>
        </form>

        {step === 'password' && (
          <button
            onClick={() => { setStep('email'); setErrorMsg(''); }}
            className="w-full text-center text-sm text-[#0052CC] hover:underline mt-3 font-medium"
          >
            ← Gunakan email lain
          </button>
        )}

        <div className="mt-7 pt-5 border-t border-gray-200 text-center">
          <p className="text-sm text-[#44546F]">
            {isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun di backend?'}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
              }} 
              className="text-[#0052CC] font-bold hover:underline"
            >
              {isRegisterMode ? 'Masuk saja' : 'Daftar (Register)'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
