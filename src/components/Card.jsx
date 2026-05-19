import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { AlignLeft, CheckSquare, Calendar, CheckCircle2, Edit3 } from 'lucide-react';
import CardModal from './CardModal';
import { useBoardStore } from '../store/useBoardStore';

// Label color map from CSS class → actual Trello hex
const LABEL_COLORS = {
  'bg-red-500':    '#F87168',
  'bg-blue-500':   '#579DFF',
  'bg-green-500':  '#4BCE97',
  'bg-yellow-500': '#F5CD47',
  'bg-purple-500': '#9F8FEF',
  'bg-orange-500': '#FEA362',
};

function DueDateBadge({ dueDate }) {
  const d = new Date(dueDate);
  const now = new Date();
  const isOverdue = d < now;
  const isToday = d.toDateString() === now.toDateString();

  const fmt = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (isOverdue) return (
    <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
      <Calendar className="w-3 h-3" /> {fmt}
    </div>
  );
  if (isToday) return (
    <div className="flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-xs font-semibold">
      <Calendar className="w-3 h-3" /> {fmt}
    </div>
  );
  return (
    <div className="flex items-center gap-1 text-gray-500 text-xs">
      <Calendar className="w-3 h-3" /> {fmt}
    </div>
  );
}

export default function Card({ card, index, listId, isDragDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useBoardStore(s => s.currentUser);

  const checklistCount = card.checklist?.length || 0;
  const checklistChecked = card.checklist?.filter(c => c.checked).length || 0;
  const checklistDone = checklistCount > 0 && checklistChecked === checklistCount;

  const labelColor = LABEL_COLORS[card.label];

  return (
    <>
      <Draggable draggableId={card.id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`trello-card group ${snapshot.isDragging ? 'rotate-2 opacity-95 ring-2 ring-blue-400 scale-105 shadow-2xl' : ''}`}
            onClick={() => setIsModalOpen(true)}
            style={{ ...provided.draggableProps.style }}
          >
            {/* Cover image */}
            {card.coverUrl && (
              <div className="w-full h-32 overflow-hidden rounded-t-lg">
                <img src={card.coverUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-2 pb-2">
              {/* Label strip */}
              {labelColor && (
                <div
                  className="h-2.5 w-12 rounded-full mb-2"
                  style={{ background: labelColor }}
                  title={card.label}
                />
              )}

              {/* Title */}
              <p className="text-sm text-[#172B4D] leading-snug font-normal break-words">{card.content}</p>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {card.checked && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </div>
                )}

                {card.dueDate && <DueDateBadge dueDate={card.dueDate} />}

                {card.description && (
                  <AlignLeft className="w-3.5 h-3.5 text-gray-400" title="Has description" />
                )}

                {checklistCount > 0 && (
                  <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium ${checklistDone ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>
                    <CheckSquare className="w-3 h-3" />
                    {checklistChecked}/{checklistCount}
                  </div>
                )}
              </div>

              {/* Member avatars */}
              <div className="flex items-center justify-end mt-1.5 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'user'}&backgroundColor=b6e3f4`}
                  alt="member"
                  className="w-6 h-6 rounded-full border border-gray-200 bg-blue-100"
                  title={currentUser?.name}
                />
              </div>
            </div>

            {/* Edit button overlay */}
            <button
              className="absolute top-1.5 right-1.5 p-1 bg-gray-200/90 hover:bg-gray-300 rounded text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={e => { e.stopPropagation(); setIsModalOpen(true); }}
              title="Quick edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </Draggable>

      {isModalOpen && (
        <CardModal listId={listId} card={card} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
