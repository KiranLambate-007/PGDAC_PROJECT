// src/services/ticketService.js

const API_URL = 'https://localhost:7143';

export const loginService = {
  loginUser: async (payload) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Server returned an error');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Server returned an unknown error');
        }
      }

      // Parse response safely if JSON
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};
