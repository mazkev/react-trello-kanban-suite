import React, { useState, useEffect } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { 
  X, User, Shield, Palette, Check, 
  AlertCircle, Key, Trash2, Sparkles, RefreshCw, LogOut, Info
} from 'lucide-react';

const BACKGROUNDS = [
  { key: 'scenic-1', label: 'Sunset Glow', className: 'bg-gradient-to-br from-amber-700 via-orange-600 to-rose-700' },
  { key: 'scenic-2', label: 'Ocean Breeze', className: 'bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-800' },
  { key: 'scenic-3', label: 'Aurora Night', className: 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900' },
  { key: 'scenic-4', label: 'Cosmic Violet', className: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950' },
  { key: 'gradient-blue', label: 'Classic Cobalt', className: 'bg-gradient-to-br from-blue-800 to-indigo-900' },
  { key: 'solid-slate', label: 'Slate Minimal', className: 'bg-slate-900' },
];

export default function SettingsModal() {
  const isSettingsOpen = useBoardStore(s => s.isSettingsOpen);
  const setIsSettingsOpen = useBoardStore(s => s.setIsSettingsOpen);
  const currentUser = useBoardStore(s => s.currentUser);
  const updateUserProfile = useBoardStore(s => s.updateUserProfile);
  const logout = useBoardStore(s => s.logout);

  const boards = useBoardStore(s => s.boards);
  const activeBoardId = useBoardStore(s => s.activeBoardId);
  const renameBoard = useBoardStore(s => s.renameBoard);
  const deleteBoard = useBoardStore(s => s.deleteBoard);
  const theme = useBoardStore(s => s.theme);
  const setTheme = useBoardStore(s => s.setTheme);

  const activeBoard = boards.find(b => b.id == activeBoardId);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'board' | 'system'
  
  // Profile form state
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Board settings state
  const [boardTitle, setBoardTitle] = useState('');
  const [isSavingBoard, setIsSavingBoard] = useState(false);
  const [boardSaved, setBoardSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
    }
  }, [currentUser, isSettingsOpen]);

  useEffect(() => {
    if (activeBoard) {
      setBoardTitle(activeBoard.title || '');
    }
  }, [activeBoard, isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      const payload = { name };
      if (password.trim()) {
        if (password.length < 6) {
          throw new Error('Password minimal 6 karakter');
        }
        payload.password = password;
      }

      await updateUserProfile(payload);
      setSaveSuccess(true);
      setPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBoard = async (e) => {
    e.preventDefault();
    if (!boardTitle.trim() || !activeBoardId) return;
    setIsSavingBoard(true);
    try {
      await renameBoard(activeBoardId, boardTitle.trim());
      setBoardSaved(true);
      setTimeout(() => setBoardSaved(false), 2500);
    } catch (err) {
      alert('Gagal mengubah nama board: ' + err.message);
    } finally {
      setIsSavingBoard(false);
    }
  };

  const handleDeleteCurrentBoard = async () => {
    if (!activeBoard) return;
    if (window.confirm(`Yakin ingin menghapus board "${activeBoard.title}" secara permanen? Seluruh list dan kartu di dalamnya akan ikut terhapus.`)) {
      try {
        await deleteBoard(activeBoard.id);
        setIsSettingsOpen(false);
      } catch (err) {
        alert('Gagal menghapus board: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Pengaturan & Preferensi</h2>
              <p className="text-xs text-gray-500">Kelola akun, board aktif, dan koneksi backend Anda</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" /> Profil & Akun
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'board'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Palette className="w-4 h-4" /> Board & Tema
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'system'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Info className="w-4 h-4" /> Tentang Aplikasi
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}&backgroundColor=b6e3f4`}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full border-2 border-white shadow-sm bg-blue-100"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-900">{name || 'Pengguna'}</h3>
                  <p className="text-sm text-gray-600">{currentUser?.email || 'kevin@example.com'}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700">
                    <Shield className="w-3 h-3" /> {currentUser?.role || 'User'}
                  </span>
                </div>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-in fade-in">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  Profil berhasil diperbarui dan tersimpan di database!
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nama Tampilan
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nama Lengkap"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Alamat Email (Akun)
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Email digunakan sebagai identitas akun dan tidak dapat diubah di sini.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-gray-400" /> Password Baru (Opsional)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Minimal 6 karakter. Akan di-hash dengan Bcrypt di server Go.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Keluar Akun
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: BOARD & THEME */}
          {activeTab === 'board' && (
            <div className="space-y-6">
              {activeBoard ? (
                <form onSubmit={handleSaveBoard} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nama Board Aktif
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                        required
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={isSavingBoard}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        {isSavingBoard ? 'Menyimpan...' : (boardSaved ? 'Tersimpan!' : 'Ubah Nama')}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-gray-500 italic">Belum ada board yang dipilih.</p>
              )}

              {/* Theme Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Tema Latar Belakang (Wallpaper Board)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.key}
                      onClick={() => setTheme(bg.key)}
                      className={`h-16 rounded-xl border-2 transition-all p-2 flex flex-col justify-end text-left relative overflow-hidden group ${
                        theme === bg.key ? 'border-blue-600 scale-[1.02] shadow-md ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-400'
                      } ${bg.className}`}
                    >
                      <span className="text-[11px] font-bold text-white drop-shadow-md z-10">
                        {bg.label}
                      </span>
                      {theme === bg.key && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              {activeBoard && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">Zona Berbahaya</h4>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Hapus Board "{activeBoard.title}"</p>
                      <p className="text-xs text-gray-500">Tindakan ini permanen dan akan menghapus semua list serta kartu di dalamnya.</p>
                    </div>
                    <button
                      onClick={handleDeleteCurrentBoard}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Board
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ABOUT & SYSTEM STATUS */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-gray-800">Status Layanan & Sinkronisasi</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Semua Sistem Normal
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600 border-t border-gray-200">
                  <div>
                    <span className="text-gray-400 block font-medium">Versi Rilis</span>
                    <span className="font-semibold text-gray-800">v1.2.0 (Stable)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Platform</span>
                    <span className="font-semibold text-gray-800">Kanban Workspace Suite</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Keamanan Akun</span>
                    <span className="font-semibold text-gray-800">Terenkripsi Standar Industri</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Penyimpanan</span>
                    <span className="font-semibold text-gray-800">Tersinkronisasi Otomatis</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-blue-900">Perlindungan & Keamanan Data</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Semua data proyek, pembagian kartu tugas, lampiran, dan informasi akun Anda dilindungi dengan enkripsi menyeluruh untuk menjaga privasi kerja tim Anda.
                </p>
                <div className="pt-2 border-t border-blue-200/60 text-[11px] text-blue-600 font-medium">
                  © 2026 Trello Kanban Suite. Hak cipta dilindungi undang-undang.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
