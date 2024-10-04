import axios from "axios";

const baseURL = `http://localhost:5050/api/itinerary`;

export const getItineraries = async () => {
    try {
        const response = await axios.get(baseURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching itineraries", error);
        throw error;
    }
};

export const createItinerary = async (itinerary) => {
    try {
        const response = await axios.post(baseURL,itinerary);
        return response.data;
    } catch (error) {
        console.error("Error creating itinerary", error);
        throw error;
    }
};

export const updateItinerary = async (id, itinerary) => {
    try {
        const response = await axios.put(`${baseURL}/${id}`, itinerary);
        return response.data;
    } catch (error) {
        console.error(`Error updating itinerary with id ${id}`, error);
        throw error;
    }
};

export const deleteItinerary = async (id) => {
    try {
        const response = await axios.delete(`${baseURL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting itinerary with id ${id}`, error);
        throw error;
    }
};
