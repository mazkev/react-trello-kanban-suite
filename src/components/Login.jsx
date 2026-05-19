import { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

export default function Login() {
  const setAppMode = useBoardStore(s => s.setAppMode);
  const setCurrentUser = useBoardStore(s => s.setCurrentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'password'

  const handleContinue = (e) => {
    e.preventDefault();
    if (step === 'email' && email.trim()) {
      setStep('password');
    } else if (step === 'password') {
      const namePart = email.split('@')[0];
      const name = namePart.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      setCurrentUser({ name: name || 'User', email });
      setAppMode('dashboard');
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
        <h1 className="text-xl font-bold text-[#172B4D] text-center mb-1">Log in to Trello</h1>
        <p className="text-sm text-[#44546F] text-center mb-7">
          {step === 'password' ? `Logging in as ${email}` : 'Continue to your workspace'}
        </p>

        <form onSubmit={handleContinue} className="space-y-4">
          {/* Google / Microsoft SSO (decorative) */}
          {step === 'email' && (
            <>
              <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-[#172B4D] hover:bg-gray-50 transition-colors">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Continue with Google
              </button>
              <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-[#172B4D] hover:bg-gray-50 transition-colors">
                <img src="https://www.microsoft.com/favicon.ico" className="w-4 h-4" alt="Microsoft" />
                Continue with Microsoft
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">Or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

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
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-all placeholder-gray-400"
              />
            </div>
          )}

          {/* Password */}
          {step === 'password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#172B4D]">Password</label>
                <button type="button" className="text-xs text-[#0052CC] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
            className="w-full flex items-center justify-center gap-2 bg-[#0052CC] hover:bg-[#0065FF] text-white font-bold py-2.5 rounded-md transition-colors text-sm group shadow-sm"
          >
            {step === 'email' ? 'Continue' : 'Log in'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {step === 'password' && (
          <button
            onClick={() => setStep('email')}
            className="w-full text-center text-sm text-[#0052CC] hover:underline mt-3 font-medium"
          >
            ← Use a different email
          </button>
        )}

        <div className="mt-7 pt-5 border-t border-gray-200 text-center">
          <p className="text-sm text-[#44546F]">
            Don't have an account?{' '}
            <button onClick={() => setAppMode('landing')} className="text-[#0052CC] font-bold hover:underline">
              Sign up for free
            </button>
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
        By signing in, you agree to our{' '}
        <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
        <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
      </p>
    </div>
  );
}
