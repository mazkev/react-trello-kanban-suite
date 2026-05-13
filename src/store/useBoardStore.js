import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBoardStore = create(
  persist(
    (set, get) => {
      const getActiveLists = (state) => {
        const activeBoard = state.boards.find(b => b.id === state.activeBoardId);
        return activeBoard ? activeBoard.lists : [];
      };

      const setActiveLists = (state, newLists) => {
        return {
          boards: state.boards.map(b => 
            b.id === state.activeBoardId ? { ...b, lists: newLists } : b
          )
        };
      };

      return {
        boards: [
          {
            id: 'board-1',
            title: 'Main Project',
            color: 'from-blue-500 to-indigo-500',
            lists: [
              {
                id: 'list-1',
                title: 'To Do',
                cards: [
                  { id: 'card-1', content: 'Design new landing page', label: 'bg-blue-500', description: 'Create high fidelity mockups for the new landing page.', checked: false, coverUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80', dueDate: '2026-05-20', checklist: [{ title: 'Wireframes', checked: true }, { title: 'High-fidelity mockup', checked: false }] },
                  { id: 'card-2', content: 'Implement Authentication', label: 'bg-red-500', description: '', checked: false, coverUrl: null, dueDate: null, checklist: [] },
                ],
              },
              {
                id: 'list-2',
                title: 'In Progress',
                cards: [
                  { id: 'card-3', content: 'Database migration', label: 'bg-yellow-500', description: '', checked: false, coverUrl: null, dueDate: '2026-05-15', checklist: [] },
                ],
              },
              {
                id: 'list-3',
                title: 'Done',
                cards: [
                  { id: 'card-4', content: 'Project setup', label: 'bg-green-500', description: '', checked: true, coverUrl: null, dueDate: null, checklist: [] },
                ],
              },
            ]
          },
          {
            id: 'board-2',
            title: 'Marketing Q3',
            color: 'from-purple-500 to-pink-500',
            lists: []
          }
        ],
        activeBoardId: 'board-1',
        theme: 'scenic-1',
        skin: 'dark', // 'dark' | 'light'
        appMode: 'landing', // 'landing' | 'login' | 'dashboard'
        currentView: 'board', // 'board' | 'workflows' | 'statistics' | 'calendar'
        searchQuery: '',
        currentUser: { name: 'Kevin P.', email: 'kevin@example.com' },
        workflows: [
          { id: 1, title: 'Auto-Complete Tasks', trigger: 'When a card is moved to "Done" list', action: 'Mark task status as completed', active: true, color: 'bg-green-500' },
          { id: 2, title: 'Stale Card Alert', trigger: 'When a card sits in "In Progress" for 3 days', action: 'Add red label & notify members', active: false, color: 'bg-red-500' },
          { id: 3, title: 'Assign Reviewer', trigger: 'When a card is moved to "Review"', action: 'Assign to Engineering Lead', active: true, color: 'bg-blue-500' },
          { id: 4, title: 'Clear Done Items', trigger: 'Every Friday at 5:00 PM', action: 'Archive all cards in "Done" list', active: true, color: 'bg-purple-500' },
        ],

        setTheme: (theme) => set({ theme }),
        setSkin: (skin) => set({ skin }),
        setAppMode: (appMode) => set({ appMode }),
        setCurrentView: (currentView) => set({ currentView }),
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        setCurrentUser: (user) => set({ currentUser: user }),
        toggleWorkflow: (id) => set(state => ({
          workflows: state.workflows.map(w => w.id === id ? { ...w, active: !w.active } : w)
        })),

        setActiveBoard: (id) => set({ activeBoardId: id }),
        createBoard: (title) => set((state) => {
          const colors = ['from-green-500 to-emerald-500', 'from-orange-500 to-red-500', 'from-cyan-500 to-blue-500', 'from-yellow-400 to-orange-500'];
          const color = colors[state.boards.length % colors.length];
          const newBoard = { id: generateId(), title, color, lists: [] };
          return { boards: [...state.boards, newBoard], activeBoardId: newBoard.id, currentView: 'board' };
        }),

        renameBoard: (id, newTitle) => set((state) => ({
          boards: state.boards.map(b => 
            b.id === id ? { ...b, title: newTitle } : b
          )
        })),

        deleteBoard: (id) => set((state) => {
          const newBoards = state.boards.filter(b => b.id !== id);
          if (newBoards.length === 0) {
            const newBoard = { id: generateId(), title: 'Main Project', color: 'from-blue-500 to-indigo-500', lists: [] };
            return { boards: [newBoard], activeBoardId: newBoard.id };
          }
          return { 
            boards: newBoards, 
            activeBoardId: state.activeBoardId === id ? newBoards[0].id : state.activeBoardId 
          };
        }),

        addList: (title) => set((state) => setActiveLists(state, [...getActiveLists(state), { id: generateId(), title, cards: [] }])),

        renameList: (listId, newTitle) => set((state) => setActiveLists(state, getActiveLists(state).map(list => 
          list.id === listId ? { ...list, title: newTitle } : list
        ))),

        deleteList: (listId) => set((state) => setActiveLists(state, getActiveLists(state).filter(list => list.id !== listId))),

        copyList: (listId) => set((state) => {
          const lists = getActiveLists(state);
          const listToCopy = lists.find(l => l.id === listId);
          if (!listToCopy) return state;
          
          const newList = {
            ...listToCopy,
            id: generateId(),
            title: `${listToCopy.title} (Copy)`,
            cards: listToCopy.cards.map(c => ({ ...c, id: generateId() }))
          };
          
          const listIndex = lists.findIndex(l => l.id === listId);
          const newLists = [...lists];
          newLists.splice(listIndex + 1, 0, newList);
          
          return setActiveLists(state, newLists);
        }),

        addCard: (listId, content) => set((state) => setActiveLists(state, getActiveLists(state).map(list => 
          list.id === listId 
            ? { ...list, cards: [...list.cards, { id: generateId(), content, description: "", label: "", checked: false, coverUrl: null, dueDate: null, checklist: [] }] }
            : list
        ))),

        updateCard: (listId, cardId, newCardData) => set((state) => setActiveLists(state, getActiveLists(state).map(list => 
          list.id === listId
            ? {
                ...list,
                cards: list.cards.map(card => 
                  card.id === cardId ? { ...card, ...newCardData } : card
                )
              }
            : list
        ))),

        deleteCard: (listId, cardId) => set((state) => setActiveLists(state, getActiveLists(state).map(list => 
          list.id === listId
            ? { ...list, cards: list.cards.filter(c => c.id !== cardId) }
            : list
        ))),

        moveList: (sourceIndex, destinationIndex) => set((state) => {
          const newLists = [...getActiveLists(state)];
          const [removed] = newLists.splice(sourceIndex, 1);
          newLists.splice(destinationIndex, 0, removed);
          return setActiveLists(state, newLists);
        }),

        moveCard: (sourceListId, destinationListId, sourceIndex, destinationIndex) => set((state) => {
          const newLists = [...getActiveLists(state)];
          
          const sourceList = newLists.find(l => l.id === sourceListId);
          const destList = newLists.find(l => l.id === destinationListId);
          
          const [removedCard] = sourceList.cards.splice(sourceIndex, 1);
          
          // Workflow Automations Check
          const activeWorkflows = state.workflows || [];
          
          // Automation 1: Auto-complete when moved to "Done" list
          const autoCompleteWf = activeWorkflows.find(w => w.id === 1);
          if (autoCompleteWf && autoCompleteWf.active && destList.title.toLowerCase() === 'done') {
            removedCard.checked = true;
          }

          destList.cards.splice(destinationIndex, 0, removedCard);
          
          return setActiveLists(state, newLists);
        }),
      };
    },
    {
      name: 'glass-elite-storage',
      partialize: (state) => ({
        boards: state.boards,
        theme: state.theme,
        skin: state.skin,
        currentUser: state.currentUser,
        workflows: state.workflows
      })
    }
  )
);
