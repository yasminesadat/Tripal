import { axios } from "./axios";

// for tourist
export async function viewUpcomingItineraries() {
  try {
    const response = await axios.get("/itinerary/upcoming/view");
    return response.data;
  } catch (error) {
    console.error("Can't fetch itineraries", error);
    throw error;
  }
}

export async function viewPaidItineraries() {
  try {
    const response = await axios.get("/itinerary/paid/view");
    return response.data;
  } catch (error) {
    console.error("Can't fetch itineraries", error);
    throw error;
  }
}

// for tourguide return all itineraries created by a tourguide 
export const getItineraries = async (tourGuideId) => {
  try {
    const response = await axios.get(`/itinerary?tourGuideId=${tourGuideId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching itineraries", error);
    throw error;
  }
};

export const createItinerary = async (itinerary) => {
  try {
    const response = await axios.post("/itinerary",itinerary);
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
