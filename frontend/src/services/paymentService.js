const API_URL = 'https://localhost:7143';

// paymentService.js
export const paymentService = {
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
    }
};