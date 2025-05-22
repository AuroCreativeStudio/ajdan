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

export const createTeam = async (teamData, locale = 'en', relatedId = null) => {
  let url = `${API_URL}/api/aboutus-teams?locale=${locale}`;
  // For Arabic, link to English entry
  if (locale === 'ar' && relatedId) {
    url += `&localization=${relatedId}`;
  }
  try {
    const response = await axios.post(url, {
      data: { ...teamData }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating team member:", error);
    throw error;
  }
};

export const updateTeam = async (id, data, locale) => {
  const url = locale
    ? `${API_URL}/api/aboutus-teams/${id}?locale=${locale}`
    : `${API_URL}/api/aboutus-teams/${id}`;
  try {
    const response = await axios.put(url, {
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