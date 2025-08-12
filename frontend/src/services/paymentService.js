import { SERVER } from "../environment/configuration";

const API_URL = SERVER.URL;

// paymentService.js
export const paymentService = {
    postToEndpoint: async (fullUrl, payload) => {
        try {
            const response = await fetch(`${API_URL}${fullUrl}`, {
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