import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, X } from 'lucide-react';
import List from './List';
import { useBoardStore } from '../store/useBoardStore';

export default function Board() {
  const lists = useBoardStore((state) => {
    const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
    return activeBoard ? activeBoard.lists : [];
  });
  const addList = useBoardStore(s => s.addList);
  const moveList = useBoardStore(s => s.moveList);
  const moveCard = useBoardStore(s => s.moveCard);

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const newListInputRef = useRef(null);

  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);

  const onDragEnd = ({ source, destination, type }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (type === 'list') moveList(source.index, destination.index);
    else if (type === 'card') moveCard(source.droppableId, destination.droppableId, source.index, destination.index);
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle.trim());
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleCancel = () => {
    setIsAddingList(false);
    setNewListTitle('');
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex items-start gap-3 p-3 h-full w-max min-w-full"
            >
              {lists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}

              {/* Add List */}
              <div className="w-[272px] shrink-0">
                {isAddingList ? (
                  <div className="bg-[#F1F2F4] rounded-xl p-2 shadow-sm">
                    <input
                      ref={newListInputRef}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300 bg-white text-gray-800 placeholder-gray-400 mb-2"
                      placeholder="Enter list title..."
                      value={newListTitle}
                      onChange={e => setNewListTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddList();
                        if (e.key === 'Escape') handleCancel();
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0065FF] text-white rounded-lg text-sm font-medium transition-colors"
                        onClick={handleAddList}
                      >
                        Add list
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-xl transition-colors backdrop-blur-sm"
                    onClick={() => setIsAddingList(true)}
                  >
                    <Plus className="w-4 h-4" /> Add another list
                  </button>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
