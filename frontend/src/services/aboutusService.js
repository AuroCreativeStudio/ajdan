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
  // Use environment variable or fallback to localhost
  const API_URL = import.meta.env.VITE_API_URL || window.ENV.API_URL || 'http://localhost:1337';
  
  // Prepare the payload with locale-specific field names
  const payload = {
    data: {
      member: teamData.member,
      image: teamData.image,
      // Use the correct field name based on locale
      [`role_${locale}`]: teamData.role,
      locale
    }
  };

  // For Arabic version, link to English entry
  if (locale === 'ar' && relatedId) {
    payload.data.localizations = [relatedId];
  }

  try {
    const response = await axios.post(`${API_URL}/api/aboutus-teams`, payload, {
      params: { locale }
    });
    return response;
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || 
                    error.message || 
                    'Failed to create team member';
    console.error('Team creation error:', errorMsg);
    throw new Error(errorMsg);
  }
};




// services/aboutusService.js
export const updateTeam = async (documentId, data, locale) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

  try {
    const response = await axios.put(
      `${API_URL}/api/aboutus-teams/${documentId}`,
      { data: { ...data, locale } },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating team member:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message,
      details: error.response?.data
    });
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