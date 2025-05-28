import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
export const fetchApartmentList = async (locale = 'en') => {
  try {
    const response = await axios.get(`${API_URL}/api/lists?populate=*&locale=${locale}`);

 return (response.data.data || []).map(item => ({
  id: item.id,
  title: item.title?.Property_Title || null,
  place: item.place || null,
  building: item.building || null,
  square_feet: item.square_feet || null,
  description: item.description || null,

  slug: item.slug || null,
 
}));

  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};


export const updateProjectList = async (documentId, updateFields, locale) => {
  const url = `${API_URL}/api/lists/${documentId}?locale=${locale}`;

  try {
    const payload = {
      data: {
        ...updateFields
      },
    };

    console.log('Payload for update:', payload);

    const response = await axios.put(url, payload);

    return response.data;
  } catch (error) {
    console.error('Error updating project:', error.response?.data || error.message);
    throw error;
  }
};

// Example fetch for a single project
export const fetchSingleProject = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/lists/${id}?populate=localizations`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching single project:', error);
    throw error;
  }
};

export const fetchApartmentListCMS = async () => {
  try {
    // Fetch English and Arabic lists
    const [enRes, arRes] = await Promise.all([
      axios.get(`${API_URL}/api/lists?populate=*&locale=en`),
      axios.get(`${API_URL}/api/lists?populate=*&locale=ar`)
    ]);

    const enData = enRes.data.data || [];
    const arData = arRes.data.data || [];

    // Map by documentId for quick lookup, but also attach the full arabic item for localizations
    const arMap = {};
    arData.forEach(item => {
      arMap[item.documentId] = item;
    });

    // Merge English and Arabic titles using documentId
    return enData.map(item => ({
      ...item,
      title: item.title?.Property_Title || null,
      title_ar: arMap[item.documentId]?.title?.Property_Title || null,
      // Optionally, attach the full arabic localization for use in update screens
      localizations: [
        ...(item.localizations || []),
        ...(arMap[item.documentId] ? [arMap[item.documentId]] : [])
      ]
      // ...add other fields as needed...
    }));
  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};


