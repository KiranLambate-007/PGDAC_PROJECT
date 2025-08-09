// src/services/ticketService.js

const API_URL = 'https://localhost:7143';

export const ticketService = {
    transferTicket: async (payload) => {
        try {
            const response = await fetch(`${API_URL}/transfer`, {
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
    },

    getAllTickets: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().$values;
                throw new Error(errorData.message || 'Transfer failed.');
            }

            // return await response.json().$values;
            const responseData = (await response.json()).$values;
            return responseData;
        } catch (error) {
            console.error('Ticket transfer error:', error);
            throw error;
        }
    },

    postToEndpoint: async (fullUrl, payload) => {
        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API Error');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error calling ${fullUrl}:`, error);
            throw error;
        }
    },

    patchToEndpoint: async (fullUrl, payload) => {
        try {
            const response = await fetch(fullUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API Error');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error calling ${fullUrl}:`, error);
            throw error;
        }
    }
};