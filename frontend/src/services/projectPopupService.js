import axios from 'axios';

// services/projectPopupService.js
export const fetchProjectPopups = async () => {
  const response = await fetch(`http://localhost:1337/api/project-contact-forms`);
  if (!response.ok) throw new Error('Failed to fetch popups');
  return await response.json();
};


export const deleteProjectPopup = async (documentId) => {
  try {
    const response = await axios.delete(`http://localhost:1337/api/project-contact-forms/${documentId}`);
    // Return consistent response structure
    return { 
      success: true,
      data: response.data,
      deleted: true // Add this for backward compatibility
    };
  } catch (error) {
    console.error('Error deleting Project Enquire detail:', error.response?.data || error);
    // Return consistent error structure
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};