import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, setAuthToken, getAuthToken } from '../services/api';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBoardStore = create(
  persist(
    (set, get) => {
      const getActiveLists = (state) => {
        const activeBoard = state.boards.find(b => b.id == state.activeBoardId);
        return activeBoard ? (activeBoard.lists || []) : [];
      };

      const setActiveLists = (state, newLists) => {
        return {
          boards: state.boards.map(b => 
            b.id == state.activeBoardId ? { ...b, lists: newLists } : b
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
          }
        ],
        activeBoardId: 'board-1',
        theme: 'scenic-1',
        skin: 'dark', // 'dark' | 'light'
        appMode: 'landing', // 'landing' | 'login' | 'dashboard'
        currentView: 'board', // 'board' | 'workflows' | 'statistics' | 'calendar'
        searchQuery: '',
        currentUser: { name: 'Kevin P.', email: 'kevin@example.com' },
        isSettingsOpen: false,
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
        setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
        toggleWorkflow: (id) => set(state => ({
          workflows: state.workflows.map(w => w.id === id ? { ...w, active: !w.active } : w)
        })),

        // === 🚀 GO BACKEND INTEGRATION ACTIONS ===

        // 1. Fetch Boards from Go Backend
        fetchBoards: async () => {
          try {
            const res = await api.getBoards();
            if (res?.data && res.data.length > 0) {
              const normalized = res.data.map(board => ({
                ...board,
                lists: (board.lists || []).map(list => ({
                  ...list,
                  cards: (list.cards || []).map(card => ({
                    ...card,
                    checklist: card.checklist || []
                  }))
                }))
              }));
              set(state => ({
                boards: normalized,
                activeBoardId: normalized.some(b => b.id == state.activeBoardId) 
                  ? state.activeBoardId 
                  : normalized[0].id
              }));
            }
          } catch (err) {
            console.warn('Backend fetchBoards fallback:', err.message);
          }
        },

        setActiveBoard: (id) => set({ activeBoardId: id }),

        createBoard: async (title) => {
          const colors = ['from-blue-500 to-indigo-500', 'from-purple-600 to-pink-600', 'from-green-500 to-emerald-500', 'from-orange-500 to-red-500'];
          const color = colors[get().boards.length % colors.length];
          try {
            const res = await api.createBoard(title, color);
            if (res?.data) {
              const newBoard = {
                ...res.data,
                lists: (res.data.lists || []).map(l => ({ ...l, cards: l.cards || [] }))
              };
              set(state => ({
                boards: [...state.boards, newBoard],
                activeBoardId: newBoard.id,
                currentView: 'board'
              }));
              return newBoard;
            }
          } catch (err) {
            console.error('Create board error:', err);
          }
          const localBoard = { id: generateId(), title, color, lists: [] };
          set((state) => ({ boards: [...state.boards, localBoard], activeBoardId: localBoard.id, currentView: 'board' }));
        },

        renameBoard: async (id, newTitle) => {
          set((state) => ({
            boards: state.boards.map(b => b.id == id ? { ...b, title: newTitle } : b)
          }));
          try {
            await api.updateBoard(id, newTitle);
          } catch (err) {
            console.error('Rename board error:', err);
          }
        },

        deleteBoard: async (id) => {
          const newBoards = get().boards.filter(b => b.id != id);
          set({
            boards: newBoards,
            activeBoardId: newBoards[0]?.id || null
          });
          try {
            await api.deleteBoard(id);
          } catch (err) {
            console.error('Delete board error:', err);
          }
        },

        addList: async (title) => {
          const activeBoardId = get().activeBoardId;
          try {
            const res = await api.createList(activeBoardId, title);
            if (res?.data) {
              const newList = { ...res.data, cards: [] };
              set((state) => setActiveLists(state, [...getActiveLists(state), newList]));
              return;
            }
          } catch (err) {
            console.error('Add list error:', err);
          }
          set((state) => setActiveLists(state, [...getActiveLists(state), { id: generateId(), title, cards: [] }]));
        },

        renameList: async (listId, newTitle) => {
          set((state) => setActiveLists(state, getActiveLists(state).map(list => 
            list.id == listId ? { ...list, title: newTitle } : list
          )));
          try {
            await api.updateList(listId, newTitle);
          } catch (err) {
            console.error('Rename list error:', err);
          }
        },

        deleteList: async (listId) => {
          set((state) => setActiveLists(state, getActiveLists(state).filter(list => list.id != listId)));
          try {
            await api.deleteList(listId);
          } catch (err) {
            console.error('Delete list error:', err);
          }
        },

        copyList: (listId) => set((state) => {
          const lists = getActiveLists(state);
          const listToCopy = lists.find(l => l.id == listId);
          if (!listToCopy) return state;
          
          const newList = {
            ...listToCopy,
            id: generateId(),
            title: `${listToCopy.title} (Copy)`,
            cards: (listToCopy.cards || []).map(c => ({ ...c, id: generateId() }))
          };
          
          const listIndex = lists.findIndex(l => l.id == listId);
          const newLists = [...lists];
          newLists.splice(listIndex + 1, 0, newList);
          
          return setActiveLists(state, newLists);
        }),

        addCard: async (listId, content) => {
          try {
            const res = await api.createCard(listId, content);
            if (res?.data) {
              const newCard = { ...res.data, checklist: [] };
              set((state) => setActiveLists(state, getActiveLists(state).map(list => 
                list.id == listId 
                  ? { ...list, cards: [...(list.cards || []), newCard] }
                  : list
              )));
              return;
            }
          } catch (err) {
            console.error('Add card error:', err);
          }
          set((state) => setActiveLists(state, getActiveLists(state).map(list => 
            list.id == listId 
              ? { ...list, cards: [...(list.cards || []), { id: generateId(), content, description: "", label: "", checked: false, coverUrl: null, dueDate: null, checklist: [] }] }
              : list
          )));
        },

        updateCard: async (listId, cardId, newCardData) => {
          set((state) => setActiveLists(state, getActiveLists(state).map(list => 
            list.id == listId
              ? {
                  ...list,
                  cards: (list.cards || []).map(card => 
                    card.id == cardId ? { ...card, ...newCardData } : card
                  )
                }
              : list
          )));
          try {
            await api.updateCard(cardId, newCardData);
          } catch (err) {
            console.error('Update card error:', err);
          }
        },

        deleteCard: async (listId, cardId) => {
          set((state) => setActiveLists(state, getActiveLists(state).map(list => 
            list.id == listId
              ? { ...list, cards: (list.cards || []).filter(c => c.id != cardId) }
              : list
          )));
          try {
            await api.deleteCard(cardId);
          } catch (err) {
            console.error('Delete card error:', err);
          }
        },

        moveList: async (sourceIndex, destinationIndex) => {
          const lists = [...getActiveLists(get())];
          const [removed] = lists.splice(sourceIndex, 1);
          lists.splice(destinationIndex, 0, removed);
          set((state) => setActiveLists(state, lists));
          try {
            await api.moveList(removed.id, destinationIndex + 1);
          } catch (err) {
            console.error('Move list error:', err);
          }
        },

        moveCard: async (sourceListId, destinationListId, sourceIndex, destinationIndex) => {
          const lists = [...getActiveLists(get())];
          const sourceList = lists.find(l => l.id == sourceListId);
          const destList = lists.find(l => l.id == destinationListId);
          if (!sourceList || !destList) return;
          
          const [removedCard] = sourceList.cards.splice(sourceIndex, 1);
          
          // Workflow Automations Check
          const activeWorkflows = get().workflows || [];
          const autoCompleteWf = activeWorkflows.find(w => w.id === 1);
          if (autoCompleteWf && autoCompleteWf.active && destList.title.toLowerCase() === 'done') {
            removedCard.checked = true;
          }

          destList.cards.splice(destinationIndex, 0, removedCard);
          set((state) => setActiveLists(state, lists));

          try {
            await api.moveCard(removedCard.id, destinationListId, destinationIndex + 1);
          } catch (err) {
            console.error('Move card error:', err);
          }
        },

        // Update User Profile
        updateUserProfile: async (data) => {
          try {
            const res = await api.updateProfile(data);
            if (res?.data) {
              set(state => ({
                currentUser: { ...state.currentUser, ...res.data }
              }));
              return res.data;
            }
          } catch (err) {
            console.error('Failed to update profile:', err);
            throw err;
          }
        },

        logout: () => {
          setAuthToken(null);
          set({
            appMode: 'login',
            currentUser: null,
            isSettingsOpen: false,
          });
        }
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
