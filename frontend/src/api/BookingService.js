import { axios } from "./axios";

export async function bookResource(resourceType, resourceId, touristId, selectedDate, selectedTime) {
  try {
    const response = await axios.post(`/${resourceType}/${resourceId}/book`, { 
      touristId,
      selectedDate,
      selectedTime 
    });
    return response.data;
  } catch (error) {
    console.error(`Error booking ${resourceType}:`, error);
    throw error;
  }
}


export async function cancelResource(resourceType, resourceId, touristId) {
  try {
    const response = await axios.post(`/${resourceType}/${resourceId}/cancel`, { touristId });
    return response.data;
  } catch (error) {
    console.error(`Error canceling ${resourceType} booking:`, error);
    throw error;
  }
}
