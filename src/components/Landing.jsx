import { useState } from 'react';
import { ArrowRight, CheckCircle, Layers, Zap, Users, Lock } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

const FEATURES = [
  { icon: <Layers className="w-6 h-6" />, title: 'Boards, Lists & Cards', desc: 'Organize anything — from team projects to personal to-dos.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Powerful Automations', desc: 'Let Butler do the work. Automate tasks without writing a line of code.' },
  { icon: <Users className="w-6 h-6" />, title: 'Built for Teams', desc: 'Collaborate in real time with your whole team, wherever they are.' },
  { icon: <Lock className="w-6 h-6" />, title: 'Secure & Reliable', desc: 'Enterprise-grade security with 99.9% uptime. Your data, always safe.' },
];

export default function Landing() {
  const setAppMode = useBoardStore(s => s.setAppMode);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-white font-sans text-[#172B4D]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0052CC] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 flex gap-0.5">
                <div className="w-2 h-5 bg-[#0052CC] rounded-sm" />
                <div className="w-2 h-3.5 bg-[#0052CC] rounded-sm" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Trello</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Solutions', 'Plans', 'Resources'].map(item => (
              <button key={item} className="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-1">
                {item} <span className="text-[10px] opacity-70">▼</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAppMode('login')}
              className="text-white text-sm font-semibold hover:underline hidden sm:block"
            >
              Log in
            </button>
            <button
              onClick={() => setAppMode('login')}
              className="bg-white text-[#0052CC] text-sm font-bold px-4 py-2 rounded hover:bg-blue-50 transition-colors shadow-sm"
            >
              Get Trello for free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#E9F2FF] to-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#172B4D] leading-tight mb-6">
            Trello brings all your tasks, teammates, and tools together
          </h1>
          <p className="text-xl text-[#44546F] mb-10 max-w-2xl mx-auto leading-relaxed">
            Keep everything in the same place—even if your team isn't. Trello's boards, lists, and cards enable you to organize and prioritize your projects in a fun, flexible, and rewarding way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:border-[#0052CC] transition-colors"
            />
            <button
              onClick={() => setAppMode('login')}
              className="flex items-center justify-center gap-2 bg-[#0052CC] hover:bg-[#0065FF] text-white font-bold px-6 py-3 rounded-md transition-colors shadow-lg text-base whitespace-nowrap"
            >
              Sign up – it's free! <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-[#44546F] mt-4">
            <CheckCircle className="w-4 h-4 text-green-500 inline mr-1" />
            No credit card required. Free forever for your whole team.
          </p>
        </div>
      </section>

      {/* Board Mockup */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0079BF] rounded-2xl p-6 shadow-2xl overflow-hidden">
            {/* Fake board header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-white font-bold text-lg">Project Roadmap</h2>
              <button className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded hover:bg-white/30 transition-colors">⭐ Star</button>
            </div>
            {/* Fake lists */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { title: 'To Do', cards: ['Research competitors', 'Define MVP scope', 'Set up design system'] },
                { title: 'In Progress', cards: ['Build authentication', 'Design landing page'], active: true },
                { title: 'Review', cards: ['API documentation'] },
                { title: 'Done', cards: ['Project kickoff', 'Tech stack selection', 'Repo setup'] },
              ].map((list, i) => (
                <div key={i} className="bg-[#F1F2F4] rounded-xl p-3 min-w-[220px] shrink-0">
                  <p className="text-sm font-semibold text-[#172B4D] mb-3 px-1">{list.title}</p>
                  <div className="space-y-2">
                    {list.cards.map((card, j) => (
                      <div key={j} className={`bg-white rounded-lg p-3 shadow-sm text-xs font-medium text-[#172B4D] ${list.active && j === 0 ? 'border-l-4 border-blue-500' : ''}`}>
                        {card}
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 w-full text-left text-xs text-[#44546F] hover:text-[#172B4D] px-1 py-1.5 flex items-center gap-1 transition-colors">
                    + Add a card
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#172B4D] mb-12">
            A productivity powerhouse
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-[#E9F2FF] text-[#0052CC] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#172B4D] mb-2">{f.title}</h3>
                <p className="text-sm text-[#44546F] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0052CC] text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">Sign up — it's free!</h2>
        <p className="text-blue-200 mb-8 text-lg">Join millions of teams using Trello to get more done.</p>
        <button
          onClick={() => setAppMode('login')}
          className="bg-white text-[#0052CC] font-bold text-lg px-8 py-4 rounded-md hover:bg-blue-50 transition-colors shadow-xl"
        >
          Start for free →
        </button>
      </section>
    </div>
  );
}
