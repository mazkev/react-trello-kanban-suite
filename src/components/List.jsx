import { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Copy, Trash2 } from 'lucide-react';
import Card from './Card';
import { useBoardStore } from '../store/useBoardStore';

export default function List({ list, index }) {
  const addCard = useBoardStore((state) => state.addCard);
  const renameList = useBoardStore((state) => state.renameList);
  const deleteList = useBoardStore((state) => state.deleteList);
  const copyList = useBoardStore((state) => state.copyList);

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
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const skin = useBoardStore((state) => state.skin);
  const isLight = skin === 'light';

  const handleTitleSubmit = () => {
    if (listTitle.trim()) {
      renameList(list.id, listTitle.trim());
    } else {
      setListTitle(list.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      addCard(list.id, newCardContent.trim());
      setNewCardContent('');
      newCardInputRef.current?.focus();
    }
  };

  const searchQuery = useBoardStore((state) => state.searchQuery);
  const filteredCards = list.cards.filter(card => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return card.content.toLowerCase().includes(query) || 
           (card.description && card.description.toLowerCase().includes(query));
  });
  const isDragDisabled = !!searchQuery;

  return (
    <Draggable draggableId={list.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${isLight ? 'glass-card-light border-t border-t-gray-200' : 'glass-card-dark border-t border-t-white/20'} rounded-2xl w-72 shrink-0 flex flex-col max-h-full shadow-xl transition-all duration-300 ${
            snapshot.isDragging ? `opacity-90 ring-2 ${isLight ? 'ring-gray-300' : 'ring-white/50'} rotate-2` : ''
          }`}
        >
          {/* List Header */}
          <div className={`flex justify-between items-center px-4 py-3 group cursor-pointer border-b ${isLight ? 'border-gray-200' : 'border-white/5'}`}>
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className={`font-bold px-2 py-1 -ml-2 rounded border outline-none focus:ring-2 focus:ring-blue-400 w-full ${isLight ? 'bg-white text-gray-900 border-gray-300' : 'bg-black/40 text-white border-white/10'}`}
              />
            ) : (
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => setIsEditingTitle(true)}
              >
                <h2 className={`font-semibold text-sm tracking-wide flex-1 truncate ${isLight ? 'text-gray-800' : 'text-white/90'}`}>
                  {list.title}
                </h2>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${isLight ? 'text-gray-600 bg-gray-900/10 border-gray-900/5' : 'text-white/60 bg-black/30 border-white/5'}`}>
                  {filteredCards.length}
                </span>
              </div>
            )}

            <div className="relative ml-2" ref={menuRef}>
              <button 
                className={`p-1.5 rounded-md transition-colors ${isLight ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-900/5' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {isMenuOpen && (
                <div className={`absolute right-0 top-8 w-48 backdrop-blur-xl rounded-xl shadow-2xl py-2 z-20 border ${isLight ? 'bg-white/95 border-gray-200' : 'bg-gray-900/95 border-white/10'}`}>
                  <div className={`px-3 pb-2 mb-2 border-b text-center text-sm font-semibold relative ${isLight ? 'border-gray-200 text-gray-700' : 'border-white/10 text-white/70'}`}>
                    List actions
                    <button 
                      className={`absolute right-3 top-0 ${isLight ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <button 
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isLight ? 'text-gray-700 hover:bg-gray-900/5 hover:text-gray-900' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                    onClick={() => { copyList(list.id); setIsMenuOpen(false); }}
                  >
                    <Copy className="w-4 h-4" /> Copy list
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors`}
                    onClick={() => { deleteList(list.id); setIsMenuOpen(false); }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete list
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards Droppable Area */}
          <Droppable droppableId={list.id} type="card" isDropDisabled={isDragDisabled}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto overflow-x-hidden px-3 flex flex-col gap-3 min-h-[150px] py-3 ${
                  snapshot.isDraggingOver ? (isLight ? 'bg-black/5 rounded-lg ring-2 ring-black/10' : 'bg-white/5 rounded-lg ring-2 ring-white/10') : ''
                }`}
              >
                {filteredCards.map((card, idx) => (
                  <Card key={card.id} card={card} index={idx} listId={list.id} isDragDisabled={isDragDisabled} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Card Footer */}
          <div className="px-3 pt-1 pb-3">
            {isAddingCard ? (
              <div className="flex flex-col gap-2">
                <textarea
                  ref={newCardInputRef}
                  className={`w-full rounded-lg p-2.5 text-sm shadow-inner border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md ${isLight ? 'bg-white text-gray-900 border-gray-300 placeholder-gray-500' : 'bg-black/40 text-white/90 border-white/10 placeholder-white/30'}`}
                  placeholder="Enter a title for this card..."
                  rows={3}
                  value={newCardContent}
                  onChange={(e) => setNewCardContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddCard();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-lg border ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700' : 'bg-blue-600/90 text-white hover:bg-blue-500 border-white/10'}`}
                    onClick={handleAddCard}
                  >
                    Add card
                  </button>
                  <button
                    className={`p-1.5 rounded-md transition-colors ${isLight ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-200' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardContent('');
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors border ${isLight ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-900/5 border-transparent hover:border-gray-200' : 'text-white/60 hover:text-white hover:bg-white/10 border-transparent hover:border-white/5'}`}
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
