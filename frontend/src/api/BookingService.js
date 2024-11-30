import { axios } from "./axios";

export async function bookResource(resourceType, resourceId,tickets) {
  try {
    const response = await axios.post(`/${resourceType}/${resourceId}/book`, { tickets});
    return response.data;
  } catch (error) {
    console.error(`Error booking ${resourceType}:`, error);
    throw error;
  }
}


export async function cancelResource(resourceType, resourceId) {
  try {
    const response = await axios.post(`/${resourceType}/${resourceId}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling ${resourceType} booking:`, error);
    throw error;
  }
}
