import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all users from the API
export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users. Please try again.');
  }
};

// Generate a unique ID for local users
export const generateUserId = () => {
  return Date.now() + Math.random();
};

// Create a new user object with default structure
export const createNewUser = (userData) => {
  return {
    id: generateUserId(),
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    company: {
      name: userData.companyName || '',
      title: userData.role || '',
    },
    address: {
      country: userData.country || '',
    },
    isLocal: true, // Flag to identify locally added users
    ...userData,
  };
};
