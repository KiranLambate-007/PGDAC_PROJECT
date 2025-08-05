// src/services/ticketService.js

const API_URL = 'https://localhost:7143';

export const loginService = {
    loginUser: async (payload) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Transfer failed.');
            }

            return await response.json();
        } catch (error) {
            console.error('Ticket transfer error:', error);
            throw error;
        }
    }
};