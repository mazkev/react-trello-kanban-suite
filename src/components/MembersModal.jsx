import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Shield, User, Eye, Trash2, Crown } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { api } from '../services/api';

const ROLE_BADGES = {
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Shield },
  member: { label: 'Member', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: User },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Eye },
};

export default function MembersModal({ isOpen, onClose, board }) {
  const currentUser = useBoardStore(s => s.currentUser);
  const inviteMember = useBoardStore(s => s.inviteMember);
  const updateMemberRole = useBoardStore(s => s.updateMemberRole);
  const removeMember = useBoardStore(s => s.removeMember);

  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cek apakah user saat ini adalah admin atau pemilik
  const isOwner = board?.userId == currentUser?.id;
  const currentMember = members.find(m => m.userId == currentUser?.id);
  const isAdmin = isOwner || currentMember?.role === 'admin';

  // Fetch members dari API saat modal dibuka
  const loadMembers = async () => {
    if (!board?.id || isNaN(Number(board.id))) {
      setMembers(board?.members || []);
      return;
    }
    try {
      const res = await api.getBoardMembers(board.id);
      if (res?.data) {
        setMembers(res.data);
      }
    } catch (err) {
      console.warn('Gagal memuat anggota:', err.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMembers();
      setErrorMsg('');
      setEmail('');
    }
  }, [isOpen, board?.id]);

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!board?.id || isNaN(Number(board.id))) {
      setErrorMsg('Papan ini adalah papan demo lokal. Silakan pilih atau buat papan baru dari backend untuk mengundang anggota.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const newMember = await inviteMember(board.id, email.trim(), role);
      if (newMember) {
        setMembers(prev => [...prev, newMember]);
        setEmail('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengundang anggota');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateMemberRole(board.id, userId, newRole);
      setMembers(prev => prev.map(m => m.userId == userId ? { ...m, role: newRole } : m));
    } catch (err) {
      alert('Gagal mengubah role: ' + err.message);
    }
  };

  const handleRemove = async (userId, userName) => {
    if (!window.confirm(`Keluarkan ${userName} dari board ini?`)) return;
    try {
      await removeMember(board.id, userId);
      setMembers(prev => prev.filter(m => m.userId != userId));
    } catch (err) {
      alert('Gagal mengeluarkan anggota: ' + err.message);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Dialog Box */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Anggota Papan (Board Members)</h3>
              <p className="text-xs text-gray-500">Kelola kolaborasi tim & hak akses (RBAC)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Invite Member (Hanya untuk Admin/Owner) */}
        {isAdmin && (
          <div className="p-6 border-b border-gray-100 bg-white">
            <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Undang Anggota Baru</p>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Email pengguna (misal: budi@example.com)"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="flex gap-2">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="text-xs font-semibold border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="member">Member (Bisa Edit)</option>
                  <option value="admin">Admin (Full Control)</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                </select>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? 'Mengundang...' : 'Undang'}
                </button>
              </div>
            </form>
            {errorMsg && <p className="text-xs text-red-500 mt-2 font-medium">{errorMsg}</p>}
          </div>
        )}

        {/* List Anggota */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Daftar Anggota ({members.length})
          </p>

          <div className="space-y-2">
            {members.map((m) => {
              const isBoardOwner = m.userId == board?.userId || m.id === 0;
              const badge = ROLE_BADGES[m.role] || ROLE_BADGES.member;
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={m.userId}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar & User Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.userName || 'user'}&backgroundColor=b6e3f4`}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border border-gray-200 bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-900 truncate">{m.userName || 'Pengguna'}</p>
                        {isBoardOwner && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            <Crown className="w-3 h-3 text-amber-500" /> Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{m.userEmail || '-'}</p>
                    </div>
                  </div>

                  {/* Role Selector & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isBoardOwner ? (
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        Admin Utama
                      </span>
                    ) : isAdmin ? (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.color}`}
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3" /> {badge.label}
                      </span>
                    )}

                    {/* Tombol Hapus / Keluarkan Anggota */}
                    {!isBoardOwner && (isAdmin || m.userId == currentUser?.id) && (
                      <button
                        onClick={() => handleRemove(m.userId, m.userName)}
                        title={m.userId == currentUser?.id ? 'Keluar dari board' : 'Keluarkan anggota'}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Role: <b>Admin</b> (Penuh), <b>Member</b> (Edit), <b>Viewer</b> (Pantau)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
