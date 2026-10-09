const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const getAuthToken = () => localStorage.getItem('trello_auth_token');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('trello_auth_token', token);
  } else {
    localStorage.removeItem('trello_auth_token');
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${response.status}`);
  }

  return data;
};

export const api = {
  // 1. Auth & Session
  register: (name, email, password) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: async (email, password) => {
    const res = await request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  getMe: () => request('/me'),

  // 2. Boards
  getBoards: () => request('/boards'),
  getBoardDetail: (id) => request(`/boards/${id}`),
  createBoard: (title, color) =>
    request('/boards', {
      method: 'POST',
      body: JSON.stringify({ title, color }),
    }),
  updateBoard: (id, title, color) =>
    request(`/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, color }),
    }),
  deleteBoard: (id) =>
    request(`/boards/${id}`, {
      method: 'DELETE',
    }),

  // 3. Lists / Columns
  createList: (boardId, title) =>
    request(`/boards/${boardId}/lists`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  updateList: (id, title) =>
    request(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    }),
  moveList: (id, position) =>
    request(`/lists/${id}/move`, {
      method: 'PUT',
      body: JSON.stringify({ position }),
    }),
  deleteList: (id) =>
    request(`/lists/${id}`, {
      method: 'DELETE',
    }),

  // 4. Cards
  createCard: (listId, content, label = '', description = '') =>
    request(`/lists/${listId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ content, label, description }),
    }),
  updateCard: (id, cardData) =>
    request(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    }),
  moveCard: (id, targetListId, newPosition) =>
    request(`/cards/${id}/move`, {
      method: 'PUT',
      body: JSON.stringify({ targetListId, newPosition }),
    }),
  deleteCard: (id) =>
    request(`/cards/${id}`, {
      method: 'DELETE',
    }),

  // 5. Checklist Items
  createChecklistItem: (cardId, title) =>
    request(`/cards/${cardId}/checklist`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  updateChecklistItem: (id, title, checked) =>
    request(`/checklist/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, checked }),
    }),
  deleteChecklistItem: (id) =>
    request(`/checklist/${id}`, {
      method: 'DELETE',
    }),
};
