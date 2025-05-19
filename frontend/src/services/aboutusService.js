import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchteam= async () => {
  try {
    const response = await axios.get(`${API_URL}/api/aboutus-teams?populate=*`);
    return response.data;
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    throw error;
  }
}

export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_URL}/api/aboutus-teams`, {
      data: {
        ...teamData
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating team member:", error);
    throw error;
  }
};

export const updateTeam = async (documentId, data) => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.put(`${API_URL}/api/aboutus-teams/${documentId}`, {
      data: { ...data }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeam = async (documentId) => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.delete(`${API_URL}/api/aboutus-teams/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};