import { axios } from "./axios";

export async function viewUpcomingItineraries() {
  try {
    const response = await axios.get("/itinerary/upcoming/view");
    return response;
  } catch (error) {
    console.error("Can't fetch itineraries", error);
    throw error;
  }
}

export const getItinerariesByTourGuide = async () => {
  try {
    const response = await axios.get("/my-itineraries");
    return response;
  } catch (error) {
    console.error("Error fetching itineraries", error);
    throw error;
  }
};

export const getAllItineraries = async () => {
  try {
    const response = await axios.get("/itinerary");
    return response;
  } catch (error) {
    console.error("Error fetching itineraries", error);
    throw error;
  }
};

export async function getItineraryBookings(id) {
  try {
    const response = await axios.get(`/itinerary-bookings/${id}`);
    return response;
  } catch (error) {
    console.error("Can't get itinerary bookings", error);
    throw error;
  }
}
export async function getTourGuideBookings() {
  try {
    const response = await axios.get(`/my-itineraries-bookings`);
    return response;
  } catch (error) {
    console.error("Can't get tourguide bookings", error);
    throw error;
  }
}

export const createItinerary = async (itinerary) => {
  try {
    const response = await axios.post("/create-itinerary",itinerary);
    return response.data;
  } catch (error) {
    console.error("Error creating itinerary", error);
    throw error;
  }
};

export const updateItinerary = async (id, itinerary) => {
  try {
    const response = await axios.put(`/itinerary/${id}`, itinerary);
    return response.data;
  } catch (error) {
    console.error(`Error updating itinerary with id ${id}`, error);
    throw error;
  }
};

export const deleteItinerary = async (id) => {
  try {
    const response = await axios.delete(`/itinerary/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting itinerary with id ${id}`, error);
    throw error;
  }
};

export const getRatings = async (id) => {
  try {
    const response = await axios.get(`/itinerary/${id}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};
  
export const addRating = async (itineraryID, ratingData) => {
  try {
    const response = await axios.post(`/itinerary/${itineraryID}/ratings`, ratingData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

export const toggleItineraryStatus = async (id) => {
  try {
    const response = await axios.patch(`/itinerary/${id}/status`);
    return response.data;
  } catch (error) {
    console.error("Error toggling itinerary status:", error);
    throw error;
  }
};

export const getItineraryById = async (id) => {
  try {
    const response = await axios.get(`/itinerary/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching itinerary with id ${id}`, error);
    throw error;
  }
};

export async function getRevenue() {
  try {
    const response = await axios.get(`/itineraries/revenue`);
    console.log(response.data)
    return response.data; 
  } catch (error) {
    console.error("Error fetching revenue:", error);
    throw error;
  }
}