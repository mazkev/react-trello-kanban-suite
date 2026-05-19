import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, CheckSquare, Tag, AlignLeft, Trash2, Calendar,
  Image as ImageIcon, Plus, CheckCircle2, User, Paperclip,
  Activity, LayoutTemplate, ChevronDown
} from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

const LABEL_OPTIONS = [
  { key: 'bg-green-500',  hex: '#4BCE97', name: 'Green' },
  { key: 'bg-yellow-500', hex: '#F5CD47', name: 'Yellow' },
  { key: 'bg-orange-500', hex: '#FEA362', name: 'Orange' },
  { key: 'bg-red-500',    hex: '#F87168', name: 'Red' },
  { key: 'bg-purple-500', hex: '#9F8FEF', name: 'Purple' },
  { key: 'bg-blue-500',   hex: '#579DFF', name: 'Blue' },
];

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="text-gray-500">{icon}</span>
      <h3 className="text-sm font-semibold text-[#172B4D]">{title}</h3>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#172B4D] bg-[#F1F2F4] hover:bg-[#DFE1E6] rounded-lg transition-colors"
    >
      {icon} {label}
    </button>
  );
}

export default function CardModal({ listId, card, onClose }) {
  const updateCard = useBoardStore(s => s.updateCard);
  const deleteCard = useBoardStore(s => s.deleteCard);
  const boards = useBoardStore(s => s.boards);
  const activeBoardId = useBoardStore(s => s.activeBoardId);
  const currentUser = useBoardStore(s => s.currentUser);

  // Find list title
  const activeBoard = boards.find(b => b.id === activeBoardId);
  const listTitle = activeBoard?.lists.find(l => l.id === listId)?.title || listId;

  const [content, setContent] = useState(card.content);
  const [description, setDescription] = useState(card.description || '');
  const [editingDesc, setEditingDesc] = useState(false);
  const [label, setLabel] = useState(card.label || '');
  const [checked, setChecked] = useState(card.checked || false);
  const [coverUrl, setCoverUrl] = useState(card.coverUrl || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [newItem, setNewItem] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleSave(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [content, description, label, checked, coverUrl, dueDate, checklist]);

  const handleSave = () => {
    updateCard(listId, card.id, { content, description, label, checked, coverUrl, dueDate, checklist });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this card?')) {
      deleteCard(listId, card.id);
      onClose();
    }
  };

  const addChecklistItem = () => {
    if (newItem.trim()) {
      setChecklist(prev => [...prev, { title: newItem.trim(), checked: false }]);
      setNewItem('');
    }
  };
  const toggleItem = (i) => setChecklist(prev => prev.map((item, idx) => idx === i ? { ...item, checked: !item.checked } : item));
  const removeItem = (i) => setChecklist(prev => prev.filter((_, idx) => idx !== i));

  const checklistCount = checklist.length;
  const checklistChecked = checklist.filter(c => c.checked).length;
  const progress = checklistCount === 0 ? 0 : Math.round((checklistChecked / checklistCount) * 100);

  const isDueDateOverdue = dueDate && new Date(dueDate) < new Date();

  const modalContent = (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 backdrop-blur-[2px] py-12 px-4 overflow-y-auto"
      onClick={handleSave}
    >
      <div
        className="w-full max-w-[768px] bg-[#F1F2F4] rounded-xl shadow-2xl relative modal-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover Image */}
        {coverUrl ? (
          <div className="w-full h-48 relative group rounded-t-xl overflow-hidden">
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            <button
              onClick={() => setCoverUrl('')}
              className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 hover:bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove cover
            </button>
          </div>
        ) : (
          <div className="w-full h-2 bg-gradient-to-r from-[#0052CC] to-[#0079BF] rounded-t-xl" />
        )}

        {/* Close Button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Title */}
          <div className="flex gap-3 mb-6 pr-8">
            <LayoutTemplate className="w-5 h-5 text-[#44546F] mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              {editingTitle ? (
                <textarea
                  autoFocus
                  className="w-full text-xl font-semibold text-[#172B4D] bg-white border border-blue-400 rounded-lg px-3 py-2 outline-none ring-2 ring-blue-300 resize-none"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setEditingTitle(false); } }}
                  rows={2}
                />
              ) : (
                <h2
                  className="text-xl font-semibold text-[#172B4D] cursor-pointer hover:bg-gray-200/60 rounded-lg px-2 py-1.5 -ml-2 transition-colors"
                  onClick={() => setEditingTitle(true)}
                >
                  {content}
                </h2>
              )}
              <p className="text-xs text-[#44546F] ml-2 mt-1">
                in list <span className="underline font-semibold">{listTitle}</span>
                {dueDate && (
                  <span className={`ml-3 px-2 py-0.5 rounded text-[11px] font-bold uppercase inline-flex items-center gap-1 ${isDueDateOverdue ? 'bg-red-100 text-red-700' : 'bg-[#E9F2FF] text-[#0052CC]'}`}>
                    <Calendar className="w-2.5 h-2.5" />
                    {new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {isDueDateOverdue && ' – Overdue'}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left Column */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Labels */}
              {label && (
                <div className="flex gap-2 items-center">
                  <div
                    className="h-8 w-16 rounded-md cursor-pointer hover:opacity-80 transition-opacity text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: LABEL_OPTIONS.find(l => l.key === label)?.hex || '#ccc' }}
                    title={LABEL_OPTIONS.find(l => l.key === label)?.name}
                  >
                    {LABEL_OPTIONS.find(l => l.key === label)?.name}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <SectionHeader icon={<AlignLeft className="w-4 h-4" />} title="Description" />
                {editingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      autoFocus
                      className="w-full min-h-[100px] border border-blue-400 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none ring-2 ring-blue-300 resize-none shadow-sm"
                      placeholder="Add a more detailed description..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setEditingDesc(false)} className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0065FF] text-white rounded-lg text-sm font-medium transition-colors">Save</button>
                      <button onClick={() => setEditingDesc(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="min-h-[60px] px-3 py-2.5 rounded-lg bg-gray-200/60 hover:bg-gray-200 cursor-pointer text-sm text-gray-500 transition-colors"
                    onClick={() => setEditingDesc(true)}
                  >
                    {description || 'Add a more detailed description...'}
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SectionHeader icon={<CheckSquare className="w-4 h-4" />} title="Checklist" />
                  {checklistCount > 0 && (
                    <span className="text-xs font-semibold text-[#44546F]">{progress}%</span>
                  )}
                </div>
                {checklistCount > 0 && (
                  <div className="progress-bar mb-3">
                    <div className={`progress-fill ${progress === 100 ? 'complete' : ''}`} style={{ width: `${progress}%` }} />
                  </div>
                )}
                <div className="space-y-1.5 mb-3">
                  {checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 group py-1">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(i)}
                        className="w-4 h-4 rounded border-gray-300 text-[#0052CC] focus:ring-[#0052CC] cursor-pointer shrink-0"
                      />
                      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-[#172B4D]'}`}>
                        {item.title}
                      </span>
                      <button
                        onClick={() => removeItem(i)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add an item..."
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addChecklistItem()}
                    className="flex-1 text-sm border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-blue-400 transition-all"
                  />
                  <button
                    onClick={addChecklistItem}
                    disabled={!newItem.trim()}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Activity (decorative) */}
              <div>
                <SectionHeader icon={<Activity className="w-4 h-4" />} title="Activity" />
                <div className="flex items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}&backgroundColor=b6e3f4`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full bg-blue-100 shrink-0 border border-gray-200"
                  />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 bg-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-44 shrink-0 flex flex-col gap-4">
              {/* Members */}
              <div>
                <p className="text-xs font-bold text-[#44546F] uppercase tracking-wider mb-2">Members</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}&backgroundColor=b6e3f4`}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    alt="member"
                    title={currentUser?.name}
                  />
                </div>
                <ActionButton icon={<User className="w-4 h-4 text-gray-500" />} label="Members" />
              </div>

              {/* Labels */}
              <div>
                <p className="text-xs font-bold text-[#44546F] uppercase tracking-wider mb-2">Labels</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {LABEL_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setLabel(label === opt.key ? '' : opt.key)}
                      title={opt.name}
                      className={`h-6 px-3 rounded text-xs font-bold text-white transition-all hover:opacity-90 ${label === opt.key ? 'ring-2 ring-offset-1 ring-gray-700' : ''}`}
                      style={{ background: opt.hex }}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-xs font-bold text-[#44546F] uppercase tracking-wider mb-2">Due date</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] transition-all"
                />
                {dueDate && (
                  <button onClick={() => setDueDate('')} className="text-xs text-gray-400 hover:text-gray-600 mt-1 transition-colors">Clear</button>
                )}
              </div>

              {/* Add to card */}
              <div>
                <p className="text-xs font-bold text-[#44546F] uppercase tracking-wider mb-2">Add to card</p>
                <div className="flex flex-col gap-1.5">
                  <ActionButton
                    icon={<CheckSquare className="w-4 h-4 text-gray-500" />}
                    label="Checklist"
                    onClick={() => {}}
                  />
                  <ActionButton
                    icon={<ImageIcon className="w-4 h-4 text-gray-500" />}
                    label="Cover"
                    onClick={() => {
                      const url = prompt('Enter image URL for cover:');
                      if (url) setCoverUrl(url);
                    }}
                  />
                  <ActionButton
                    icon={<Paperclip className="w-4 h-4 text-gray-500" />}
                    label="Attachment"
                    onClick={() => {}}
                  />
                </div>
              </div>

              {/* Actions */}
              <div>
                <p className="text-xs font-bold text-[#44546F] uppercase tracking-wider mb-2">Actions</p>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#172B4D] bg-[#F1F2F4] hover:bg-[#DFE1E6] rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={checked}
                      onChange={e => setChecked(e.target.checked)}
                    />
                    Mark complete
                  </label>
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-[#0052CC] hover:bg-[#0065FF] rounded-lg transition-colors shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
