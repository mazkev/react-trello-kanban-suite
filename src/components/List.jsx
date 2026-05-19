import { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Copy, Trash2, X, Edit2 } from 'lucide-react';
import Card from './Card';
import { useBoardStore } from '../store/useBoardStore';

export default function List({ list, index }) {
  const addCard = useBoardStore(s => s.addCard);
  const renameList = useBoardStore(s => s.renameList);
  const deleteList = useBoardStore(s => s.deleteList);
  const copyList = useBoardStore(s => s.copyList);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const titleInputRef = useRef(null);
  const newCardInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isAddingCard && newCardInputRef.current) {
      newCardInputRef.current.focus();
    }
  }, [isAddingCard]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchQuery = useBoardStore(s => s.searchQuery);
  const filteredCards = list.cards.filter(card => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return card.content.toLowerCase().includes(q) || (card.description?.toLowerCase().includes(q));
  });
  const isDragDisabled = !!searchQuery;

  const handleTitleSubmit = () => {
    if (listTitle.trim()) renameList(list.id, listTitle.trim());
    else setListTitle(list.title);
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      addCard(list.id, newCardContent.trim());
      setNewCardContent('');
      newCardInputRef.current?.focus();
    }
  };

  const handleCancelCard = () => {
    setIsAddingCard(false);
    setNewCardContent('');
  };

  return (
    <Draggable draggableId={list.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`trello-list shrink-0 transition-all duration-150 ${snapshot.isDragging ? 'rotate-2 opacity-90 shadow-2xl' : ''}`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* List Header */}
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-between px-3 pt-2.5 pb-1 cursor-grab active:cursor-grabbing"
          >
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={listTitle}
                onChange={e => setListTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') { setListTitle(list.title); setIsEditingTitle(false); }
                }}
                className="flex-1 text-sm font-semibold text-gray-800 bg-white border border-blue-400 rounded px-2 py-1 outline-none ring-2 ring-blue-300 min-w-0"
              />
            ) : (
              <h2
                className="flex-1 text-sm font-semibold text-[#172B4D] cursor-pointer px-1 py-0.5 rounded hover:bg-gray-200/60 transition-colors truncate"
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename"
              >
                {list.title}
                <span className="ml-2 text-xs font-normal text-gray-500">{filteredCards.length}</span>
              </h2>
            )}

            {/* Menu */}
            <div className="relative ml-1" ref={menuRef}>
              <button
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200/80 transition-colors"
                onClick={() => setIsMenuOpen(o => !o)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-9 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-30 fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">List actions</span>
                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    onClick={() => { setIsAddingCard(true); setIsMenuOpen(false); }}
                  >
                    <Plus className="w-4 h-4 text-gray-400" /> Add card
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    onClick={() => { copyList(list.id); setIsMenuOpen(false); }}
                  >
                    <Copy className="w-4 h-4 text-gray-400" /> Copy list
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    onClick={() => { setIsEditingTitle(true); setIsMenuOpen(false); }}
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" /> Rename list
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                      onClick={() => { deleteList(list.id); setIsMenuOpen(false); }}
                    >
                      <Trash2 className="w-4 h-4" /> Delete this list
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <Droppable droppableId={list.id} type="card" isDropDisabled={isDragDisabled}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto px-2 pb-1 min-h-[8px] transition-colors rounded-lg ${
                  snapshot.isDraggingOver ? 'bg-blue-100/60' : ''
                }`}
                style={{ maxHeight: 'calc(100vh - 220px)' }}
              >
                {filteredCards.map((card, idx) => (
                  <Card key={card.id} card={card} index={idx} listId={list.id} isDragDisabled={isDragDisabled} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Card Footer */}
          <div className="px-2 pb-2 pt-1">
            {isAddingCard ? (
              <div className="flex flex-col gap-2">
                <textarea
                  ref={newCardInputRef}
                  className="w-full rounded-lg p-2.5 text-sm border border-blue-400 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none ring-2 ring-blue-300 shadow-sm"
                  placeholder="Enter a title for this card..."
                  rows={3}
                  value={newCardContent}
                  onChange={e => setNewCardContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(); }
                    if (e.key === 'Escape') handleCancelCard();
                  }}
                />
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0065FF] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    onClick={handleAddCard}
                  >
                    Add card
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
                    onClick={handleCancelCard}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-[#44546F] hover:text-[#172B4D] hover:bg-gray-200/70 rounded-lg transition-colors"
                onClick={() => setIsAddingCard(true)}
              >
                <Plus className="w-4 h-4" /> Add a card
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
