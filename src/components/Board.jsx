import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import List from './List';
import { useBoardStore } from '../store/useBoardStore';

export default function Board() {
  const lists = useBoardStore((state) => {
    const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
    return activeBoard ? activeBoard.lists : [];
  });
  const addList = useBoardStore((state) => state.addList);
  const moveList = useBoardStore((state) => state.moveList);
  const moveCard = useBoardStore((state) => state.moveCard);

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const newListInputRef = useRef(null);

  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);

  const skin = useBoardStore((state) => state.skin);
  const isLight = skin === 'light';

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'list') {
      moveList(source.index, destination.index);
    } else if (type === 'card') {
      moveCard(source.droppableId, destination.droppableId, source.index, destination.index);
    }
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle.trim());
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-[calc(100vh-64px)] overflow-x-auto overflow-y-hidden">
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex items-start gap-5 p-6 h-full min-w-max"
            >
              {lists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}

            {/* Add New List Button */}
            <div className="shrink-0 w-72">
              {isAddingList ? (
                <div className={`${isLight ? 'glass-card-light border-t-gray-200' : 'glass-card-dark border-t-white/20'} rounded-2xl p-3 shadow-xl border-t`}>
                  <input
                    ref={newListInputRef}
                    className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 border mb-3 backdrop-blur-md transition-colors ${isLight ? 'bg-white/80 text-gray-900 border-gray-300 placeholder-gray-500' : 'bg-black/40 text-white border-white/10 placeholder-white/30'}`}
                    placeholder="Enter list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-lg border ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700' : 'bg-blue-600/90 text-white hover:bg-blue-500 border-white/10'}`}
                      onClick={handleAddList}
                    >
                      Add list
                    </button>
                    <button
                      className={`p-1.5 rounded-md transition-colors ${isLight ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-200' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListTitle('');
                      }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={`${isLight ? 'glass-card-light hover:bg-white/90 text-gray-700 hover:text-gray-900 border-t-gray-200' : 'glass-card-dark hover:bg-white/10 text-white/80 hover:text-white border-t-white/20'} rounded-2xl w-full py-3.5 px-4 flex items-center gap-2 font-medium transition-colors shadow-lg border-t`}
                  onClick={() => setIsAddingList(true)}
                >
                  <Plus className="w-5 h-5" /> Add another list
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
