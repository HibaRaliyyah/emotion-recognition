const API_BASE_URL = 'http://localhost:5000/api/admin';

export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const fetchEmotions = async () => {
  const response = await fetch(`${API_BASE_URL}/emotions`);
  if (!response.ok) throw new Error('Failed to fetch emotions');
  return response.json();
};

export const fetchChats = async () => {
  const response = await fetch(`${API_BASE_URL}/chats`);
  if (!response.ok) throw new Error('Failed to fetch chats');
  return response.json();
};

export const fetchUserDetails = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user details');
  return response.json();
};
