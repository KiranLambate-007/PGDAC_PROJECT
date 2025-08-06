const API_URL = 'https://localhost:7143';

export const busService = {
    getAllBuses: async () => {
        try {
            const response = await fetch(`${API_URL}/GetAllBus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch buses.');
            }

            return await response.json();
        } catch (error) {
            console.error('Get all buses error:', error);
            throw error;
        }
    },

    getBusesByRouteId: async (id) => {
        try {
           const response = await fetch(`${API_URL}/route/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch buses.');
            }

            return await response.json();
        } catch (error) {
            console.error('Get all buses error:', error);
            throw error;
        }
    }
};