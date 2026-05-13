import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { AlignLeft, CheckSquare, Calendar, CheckCircle2 } from 'lucide-react';
import CardModal from './CardModal';
import { useBoardStore } from '../store/useBoardStore';

export default function Card({ card, index, listId, isDragDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useBoardStore(state => state.currentUser);

  const checklistCount = card.checklist?.length || 0;
  const checklistChecked = card.checklist?.filter(c => c.checked).length || 0;

  return (
    <>
      <Draggable draggableId={card.id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-white/40 text-sm group cursor-pointer transition-all flex flex-col overflow-hidden ${
              snapshot.isDragging ? 'rotate-3 opacity-95 ring-2 ring-blue-500 scale-105 shadow-xl' : 'hover:bg-white hover:shadow-md hover:-translate-y-0.5'
            }`}
            onClick={() => setIsModalOpen(true)}
          >
            {card.coverUrl && (
              <img src={card.coverUrl} alt="Cover" className="w-full h-28 object-cover border-b border-gray-100" />
            )}
            
            <div className="p-3.5 flex flex-col flex-1">
              {card.label && (
                <div className={`h-2.5 w-12 rounded-full mb-2.5 shadow-sm ${card.label}`} />
              )}
              
              <p className="break-words mb-2.5 text-gray-800 font-medium leading-snug">{card.content}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-gray-400 mt-auto pt-2">
                {card.dueDate && (
                   <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                   </div>
                )}
                {card.description && <AlignLeft className="w-4 h-4" title="Has description" />}
                {checklistCount > 0 && (
                   <div className={`flex items-center gap-1.5 text-xs font-semibold ${checklistChecked === checklistCount ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded-md' : 'text-gray-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{checklistChecked}/{checklistCount}</span>
                   </div>
                )}
                {card.checked && (
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </div>
                )}
              </div>
              
              {/* Adding subtle user avatar placeholder to simulate a real app */}
              <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                  alt="Assignee" 
                  className="w-6 h-6 rounded-full border border-gray-200 bg-gray-100"
                />
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {isModalOpen && (
        <CardModal 
          listId={listId}
          card={card}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
