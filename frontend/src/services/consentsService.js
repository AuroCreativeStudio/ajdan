import { apiService } from './apiService';


export const getConsents = async () => {
  try {
    const response = await apiService.get('/consents');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching consents:', error);
    throw error; 
  }
};
