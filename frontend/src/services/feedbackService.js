import axios from 'axios';

const API_URL = 'https://localhost:7094/api/Feedback';

export const submitFeedback = async (feedback) => {
  return await axios.post(API_URL, feedback);
};

export const getAllFeedbacks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};


