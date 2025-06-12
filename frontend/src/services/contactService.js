import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchContactList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/userdetails`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching Contact list:', error);
    throw error;
  }
};
export const postContactDetails = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/userdetails`, {
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting Contact Form:', error.response?.data || error);
    throw error;
  }
};
export const deleteContactDetail = async (documentId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/userdetails/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting Contact detail:', error.response?.data || error);
    throw error;
  }
};

// contactService.js



