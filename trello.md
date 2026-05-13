# PRD: Trello Board Clone (Kanban System)

**Technology Stack:** React.js, Tailwind CSS, @hello-pangea/dnd (Drag & Drop), Zustand.
**Key Focus:** Drag and Drop UX, Nested Arrays Management, and Inline Editing.

---

## 1. Project Overview
Membangun papan Kanban fungsional di mana pengguna dapat membuat kolom (Lists), menambahkan kartu (Cards), dan memindahkan kartu antar kolom secara real-time.

---

## 2. Core Features (The Kanban Logic)

### A. Board Workspace
- **Horizontal Scroll:** Layout papan yang bisa di-scroll ke samping jika jumlah kolom banyak.
- **Dynamic Background:** Pilihan untuk mengubah warna background papan atau menggunakan gambar dari Unsplash.

### B. List Management (Columns)
- **Add New List:** Tombol untuk menambah kolom baru di ujung kanan.
- **List Actions:** Menu untuk menghapus atau menyalin kolom.
- **Title Editing:** Klik pada judul kolom untuk langsung mengubah namanya (Inline Rename).

### C. Card Management
- **Add Card:** Area input cepat di bawah setiap kolom untuk menambah tugas baru.
- **Card Details:** Saat kartu diklik, muncul Modal (Pop-up) untuk mengisi deskripsi, label (warna), dan checklist.
- **Drag & Drop:** Memindahkan kartu di dalam satu kolom (reorder) atau antar kolom yang berbeda.

---

## 3. UI/UX Specifications (Slicing Level Up)

### A. Trello Aesthetic
- **Board Background:** Biasanya biru `#0079BF` atau abu-abu netral.
- **List Container:** Background `#EBECF0` dengan sudut melengkung (`rounded-md`).
- **Card Style:** Warna putih solid dengan sedikit bayangan (`shadow-sm`) agar terlihat seperti kertas fisik.

### B. Interaction States
- **Drag Preview:** Saat kartu ditarik, kartu aslinya menjadi transparan atau miring sedikit untuk memberikan feedback visual.
- **Placeholder:** Area tujuan drop harus menunjukkan "ruang kosong" agar user tahu di mana kartu akan mendarat.

---

## 4. Technical Logic (The Hard Part)

### A. Nested State Structure (Zustand)
Kamu harus mengelola array di dalam array. Struktur datanya kira-kira seperti ini:
```javascript
{
  lists: [
    {
      id: "list-1",
      title: "To Do",
      cards: [
        { id: "card-1", content: "Slicing Header" },
        { id: "card-2", content: "Fix Bug API" }
      ]
    },
    {
      id: "list-2",
      title: "Doing",
      cards: []
    }
  ]
}