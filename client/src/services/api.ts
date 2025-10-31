import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Experience API calls
export const getExperiences = async () => {
  try {
    const response = await axios.get(`${API_URL}/experiences`);
    return response.data;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

export const getExperienceById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/experiences/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching experience ${id}:`, error);
    throw error;
  }
};

// Booking API calls
export const createBooking = async (bookingData: any) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Promo code API calls
export const validatePromoCode = async (code: string) => {
  try {
    const response = await axios.post(`${API_URL}/promo/validate`, { code });
    return response.data;
  } catch (error) {
    console.error('Error validating promo code:', error);
    throw error;
  }
};