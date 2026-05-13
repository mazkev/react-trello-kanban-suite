import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckSquare, Tag, AlignLeft, Trash2, Calendar, Image as ImageIcon, Plus, CheckCircle2, LayoutTemplate } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';

export default function CardModal({ listId, card, onClose }) {
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const [content, setContent] = useState(card.content);
  const [description, setDescription] = useState(card.description || '');
  const [label, setLabel] = useState(card.label || '');
  const [checked, setChecked] = useState(card.checked || false);
  const [coverUrl, setCoverUrl] = useState(card.coverUrl || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    setContent(card.content);
    setDescription(card.description || '');
    setLabel(card.label || '');
    setChecked(card.checked || false);
    setCoverUrl(card.coverUrl || '');
    setDueDate(card.dueDate || '');
    setChecklist(card.checklist || []);
  }, [card]);

  const handleSave = () => {
    updateCard(listId, card.id, { content, description, label, checked, coverUrl, dueDate, checklist });
    onClose();
  };

  const handleDelete = () => {
    deleteCard(listId, card.id);
    onClose();
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([...checklist, { title: newChecklistItem.trim(), checked: false }]);
      setNewChecklistItem('');
    }
  };

  const toggleChecklistItem = (index) => {
    const newList = [...checklist];
    newList[index].checked = !newList[index].checked;
    setChecklist(newList);
  };
  
  const removeChecklistItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const checklistCount = checklist.length;
  const checklistChecked = checklist.filter(c => c.checked).length;
  const checklistProgress = checklistCount === 0 ? 0 : Math.round((checklistChecked / checklistCount) * 100);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden relative flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {coverUrl ? (
          <div className="w-full h-40 relative group">
             <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
             <button 
               onClick={() => setCoverUrl('')}
               className="absolute top-4 left-4 p-1.5 bg-black/50 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold flex items-center gap-1 hover:bg-red-500"
             >
               <Trash2 className="w-3.5 h-3.5" /> Remove Cover
             </button>
          </div>
        ) : (
          <div className="h-2 shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        )}
        
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors z-10 ${coverUrl ? 'bg-black/50 text-white hover:bg-black/70' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col mb-6 pr-8">
            <input 
              type="text"
              className="text-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 -ml-1 text-gray-800 w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-gray-500 px-0.5 mt-1 flex items-center gap-2">
              in list <span className="font-semibold underline decoration-gray-300 underline-offset-2">{listId}</span>
              {dueDate && (
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase flex items-center gap-1 ${new Date(dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  <Calendar className="w-3 h-3" /> Due {new Date(dueDate).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-8">
              
              {/* Labels & Dates Row */}
              <div className="flex flex-wrap gap-6">
                {/* Label Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 tracking-wide uppercase">
                    <Tag className="w-3.5 h-3.5 text-blue-500" /> Labels
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'].map(color => (
                      <button 
                        key={color}
                        className={`w-8 h-6 rounded shadow-sm transition-transform hover:scale-105 ${color} ${label === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-105 shadow-md' : 'opacity-80 hover:opacity-100'}`}
                        onClick={() => setLabel(label === color ? '' : color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Due Date Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 tracking-wide uppercase">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Due Date
                  </h3>
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-1 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 tracking-wide uppercase">
                  <AlignLeft className="w-3.5 h-3.5 text-blue-500" /> Description
                </h3>
                <textarea 
                  className="w-full min-h-[90px] border border-gray-200 rounded-lg bg-gray-50 p-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner text-gray-700"
                  placeholder="Add a more detailed description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Checklist Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 tracking-wide uppercase">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> Checklist
                  </h3>
                  {checklistCount > 0 && (
                    <span className="text-xs font-semibold text-gray-500">{checklistProgress}%</span>
                  )}
                </div>
                
                {checklistCount > 0 && (
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${checklistProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${checklistProgress}%` }}
                    />
                  </div>
                )}

                <div className="space-y-2 mt-2">
                  {checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <input 
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(index)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {item.title}
                      </span>
                      <button 
                        onClick={() => removeChecklistItem(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="text"
                      placeholder="Add an item..."
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                      className="flex-1 text-sm border border-gray-200 rounded bg-gray-50 px-3 py-1.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button 
                      onClick={addChecklistItem}
                      disabled={!newChecklistItem.trim()}
                      className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="w-full sm:w-40 flex flex-col gap-6 shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-6 sm:pt-0 sm:pl-6">
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Actions</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleSave}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                  <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    Mark as Done
                  </label>
                  <button 
                    onClick={handleDelete}
                    className="w-full py-2 mt-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Card
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Add to card</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      const url = prompt("Enter image URL for cover:");
                      if (url) setCoverUrl(url);
                    }}
                    className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" /> Cover
                  </button>
                  <button 
                    className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <LayoutTemplate className="w-4 h-4" /> Make Template
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
