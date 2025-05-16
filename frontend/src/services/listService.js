import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchApartmentList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/lists?populate=*`);
    return (response.data.data || []).map((item) => ({
      ...item,
      title: item.title?.Property_Title || null,
    }));
  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};

export const updateProjectList = async (documentId, updateFields) => {
  try {
    const payload = {
      data: {
        ...updateFields,
        locale: 'en', // 👈 ADD THIS LINE
      },
    };

    console.log('Payload for update:', payload);

    const response = await axios.put(`${API_URL}/api/lists/${documentId}`, payload);

    return response.data;
  } catch (error) {
    console.error('Error updating project:', error.response?.data || error.message);
    throw error;
  }
};




