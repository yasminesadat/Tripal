import { axios } from "./axios";

export async function bookResource(resourceType, resourceId, tickets, myPromoCode, paymentMethod) {
  try {
    const response = await axios.post(`/${resourceType}/${resourceId}/book`, {
      tickets,
      myPromoCode,  // Include it in the request body
      paymentMethod
    });
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

export async function completeBooking(sessionId, touristId, resourceType, tickets, resourceId) {
  try {
    console.log ("Completing booking");
    const response = await axios.post(`/${resourceType}/${resourceId}/complete-booking`, {
      sessionId,
      touristId,
      resourceType,
      tickets,
      resourceId,
    });
    return response.data;
  } catch (error) {
    console.error("Error completing booking:", error);
    throw error;
  }
}
