import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import CardModal from './CardModal';

export default function CalendarView() {
  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const skin = useBoardStore((state) => state.skin);
  const isLight = skin === 'light';

  // State untuk tanggal yang sedang dilihat di kalender
  const [currentDate, setCurrentDate] = useState(new Date());
  // State untuk modal kartu yang sedang diklik
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);

  const activeBoard = boards.find(b => b.id == activeBoardId);
  const lists = activeBoard?.lists || [];

  // 1. Kumpulkan semua kartu dan sertakan listId-nya
  const allCardsWithDates = lists.flatMap(list => 
    (list.cards || []).filter(c => c.dueDate).map(card => ({ 
      ...card, 
      listId: list.id,
      listTitle: list.title 
    }))
  );

  // 2. Buat Lookup Map agar pencarian kartu per tanggal instan
  const cardsByDate = {};
  allCardsWithDates.forEach(card => {
    // Ambil format YYYY-MM-DD
    const dateKey = card.dueDate.split('T')[0];
    if (!cardsByDate[dateKey]) {
      cardsByDate[dateKey] = [];
    }
    cardsByDate[dateKey].push(card);
  });

  // 3. Kalkulasi Hari & Grid Kalender Bulan Aktif
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 = Januari, 11 = Desember

  // Nama Bulan dan Tahun (misal: "October 2026")
  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Hari pertama bulan ini (0 = Minggu, 1 = Senin, dst)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total hari dalam bulan ini (28, 29, 30, atau 31)
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Fungsi navigasi bulan
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

   // Mode tampilan: 'month' (grid kalender) atau 'agenda' (daftar urut)
  const [viewMode, setViewMode] = useState('month');

  // Styling helper
  const textMuted = isLight ? 'text-gray-500' : 'text-white/60';
  const headerBg = isLight ? 'bg-gray-100/90 text-gray-700' : 'bg-white/10 text-white/90';
  const cellBg = isLight ? 'bg-white border-gray-200 text-gray-800 hover:border-blue-400' : 'bg-white/5 border-white/10 text-white hover:border-white/30';

  // Cek apakah tanggal hari ini ada di bulan yang sedang ditampilkan
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  // Siapkan sel-sel kalender (7 kolom)
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const calendarCells = [];

  // 1. Sel kosong sebelum tanggal 1
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ day: null, dateKey: null });
  }

  // 2. Sel tanggal 1 sampai akhir bulan
  for (let day = 1; day <= totalDays; day++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateKey = `${year}-${mm}-${dd}`;
    calendarCells.push({ day, dateKey });
  }

  return (
    <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        
        {/* Header Navigasi Kalender */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border backdrop-blur-xl shadow-lg bg-white/10 border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold capitalize ${isLight ? 'text-gray-800' : 'text-white'}`}>
                {monthName}
              </h2>
              <p className={`text-xs ${textMuted}`}>
                {allCardsWithDates.length} tugas memiliki tenggat waktu
              </p>
            </div>
          </div>

          {/* Kontrol Navigasi & Toggle View */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Bulan / Agenda */}
            <div className={`p-1 rounded-xl flex items-center border ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-black/30 border-white/10'}`}>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'month' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isLight ? 'text-gray-600 hover:text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Grid Bulan
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'agenda' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isLight ? 'text-gray-600 hover:text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Agenda
              </button>
            </div>

            {/* Tombol Pindah Bulan */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className={`p-2 rounded-xl border transition-all ${isLight ? 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${isLight ? 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
              >
                Hari Ini
              </button>
              <button
                onClick={handleNextMonth}
                className={`p-2 rounded-xl border transition-all ${isLight ? 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* TAMPILAN 1: GRID BULANAN (Trello Power-Up Style) */}
        {viewMode === 'month' && (
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Header Nama Hari (Min - Sab) */}
            <div className="grid grid-cols-7 border-b border-white/10">
              {dayNames.map((name, idx) => (
                <div
                  key={name}
                  className={`py-3 text-center text-xs font-bold uppercase tracking-wider ${headerBg} ${idx === 0 || idx === 6 ? 'text-amber-500' : ''}`}
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Kotak Sel Kalender */}
            <div className="grid grid-cols-7 gap-[1px] bg-white/10">
              {calendarCells.map((cell, index) => {
                if (!cell.day) {
                  return (
                    <div 
                      key={`empty-${index}`} 
                      className={`min-h-[110px] md:min-h-[130px] p-2 opacity-30 ${isLight ? 'bg-gray-50' : 'bg-black/20'}`} 
                    />
                  );
                }

                const dayCards = cardsByDate[cell.dateKey] || [];
                const isTodayCell = isCurrentMonth && cell.day === todayDate;

                return (
                  <div
                    key={cell.dateKey}
                    className={`min-h-[110px] md:min-h-[130px] p-2 flex flex-col gap-1.5 transition-all border ${cellBg} ${isTodayCell ? 'ring-2 ring-blue-500/80 bg-blue-500/5' : ''}`}
                  >
                    {/* Header Tanggal */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isTodayCell 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : isLight ? 'text-gray-700' : 'text-white/80'
                      }`}>
                        {cell.day}
                      </span>
                      {dayCards.length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/70'
                        }`}>
                          {dayCards.length}
                        </span>
                      )}
                    </div>

                    {/* Daftar Kartu Tugas di Tanggal Ini */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[85px] pr-0.5 custom-scrollbar">
                      {dayCards.map(card => (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCardInfo(card)}
                          className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex items-center gap-1.5 border ${
                            card.checked
                              ? 'opacity-60 line-through bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : isLight ? 'bg-gray-50 hover:bg-white border-gray-200 text-gray-800' : 'bg-black/40 hover:bg-black/60 border-white/15 text-white'
                          }`}
                          title={`${card.content} (${card.listTitle})`}
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 ${card.label || 'bg-blue-500'}`} />
                          <span className="truncate flex-1">{card.content}</span>
                          {card.checked && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAMPILAN 2: DAFTAR AGENDA (Upcoming Deadlines List) */}
        {viewMode === 'agenda' && (
          <div className="space-y-4">
            {allCardsWithDates.length === 0 ? (
              <div className={`p-12 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${isLight ? 'border-gray-300 bg-gray-50/50' : 'border-white/20 bg-white/5'}`}>
                <CalendarIcon className={`w-16 h-16 mb-4 ${textMuted} opacity-50`} />
                <h3 className={`text-xl font-bold ${isLight ? 'text-gray-700' : 'text-white/80'}`}>Tidak Ada Deadline</h3>
                <p className={`mt-2 ${textMuted}`}>Tambahkan tenggat waktu pada kartu tugas Anda agar muncul di kalender ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCardsWithDates.map(card => {
                  const isOverdue = new Date(card.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !card.checked;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCardInfo(card)}
                      className={`p-5 rounded-2xl shadow-xl flex flex-col gap-3 border backdrop-blur-xl cursor-pointer transition-all hover:-translate-y-1 ${
                        isLight ? 'bg-white border-gray-200 text-gray-800' : 'bg-black/20 border-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isOverdue 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {new Date(card.dueDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        {card.label && <div className={`w-3 h-3 rounded-full ${card.label}`} />}
                      </div>

                      <h4 className="font-bold text-base line-clamp-2">{card.content}</h4>
                      <p className={`text-xs ${textMuted}`}>
                        Di kolom: <span className="font-semibold">{card.listTitle}</span>
                      </p>

                      <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/10 text-xs">
                        {card.checked ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                          </span>
                        ) : (
                          <span className={`font-semibold flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
                            <Clock className="w-3.5 h-3.5" /> {isOverdue ? 'Terlambat' : 'Menunggu'}
                          </span>
                        )}
                        <span className="text-blue-400 hover:underline">Detail →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal Detail Kartu (Muncul saat kartu di kalender diklik) */}
        {selectedCardInfo && (
          <CardModal
            listId={selectedCardInfo.listId}
            card={selectedCardInfo}
            onClose={() => setSelectedCardInfo(null)}
          />
        )}

      </div>
    </div>
  );
}
