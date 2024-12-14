import { axios } from "./axios";

export const getCityCode = async (searchinfo) =>{
  try {
    const response = await axios.get(`/searchCity`,{
    params: {searchinfo }});
    return response.data;
  }
  catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
}

export const getHotels = async (cityCode) => {
  try {
    const response = await axios.get(`/searchHotels`,{
    params: { cityCode }});
    return response.data;
  }
  catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
};

export const getHotelDetails = async (hotelID) => {
  try {
    const response = await axios.get(`/getHotelDetails`,{
    params: { hotelID }});
    return response.data;
  }
  catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
};

export const getHotelPrices = async (hotelIds,checkInDate,checkOutDate,adults,boardType) => {
  try {
    const response = await axios.get(`/getHotelPrices`,{
    params: { hotelIds,checkInDate,checkOutDate,adults,boardType }});
    return response.data;
  }
  catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
};

export const saveBooking = async (bookingData) => {
  try {
    const response = await axios.post(`/saveBooking`, bookingData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
}

export async function getHotelHistory() {
  try {
    const response = await axios.get(`/tourist/bookedHotels`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist's hotels':", error);
    throw error;
  }
}

export const createCheckoutHotel = async (bookingDetails) => {
  try {
    const response = await axios.post('/hotelcheckout', bookingDetails);
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
};