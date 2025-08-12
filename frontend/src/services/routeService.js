import {SERVER} from "../environment/configuration";

const API_URL = SERVER.URL;

export const routeService = {
    getAllRoutes: async () => {
        try {
            const response = await fetch(`${API_URL}/routes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch routes.');
            }

            return await response.json();
        } catch (error) {
            console.error('Get all routes error:', error);
            throw error;
        }
    },

    fetchBusesForRoute: async (routeId) => {
        try {
            const response = await fetch(`${API_URL}/${routeId}/buses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch routes.');
            }

            return await response.json();
        } catch (error) {
            console.error('Get all routes error:', error);
            throw error;
        }
    }
};