import { axios } from "./axios";

export async function getAdvertiserActivities(advertiser) {
  try {
    console.log("THE URL IS ", `/activities/advertiser/${advertiser}`);
    const response = await axios.get(`/activities/advertiser/${advertiser}`);
    return response;
  } catch (error) {
    console.error("Can't get advertiser's activities", error);
    throw error;
  }
}

export async function getActivityById(id) {
  try {
    const response = await axios.get(`/activity/${id}`);
    return response;
  } catch (error) {
    console.error("Can't get activity details", error);
    throw error;
  }
}

export async function createActivity() { }

export async function updateActivity(id) {
  // try {
  //   debugger
  //   console.log("trying to update")
  //   const response = await axios.put(`activities/${id}`);
  //   console.log("i updated ")
  //   return response.data; 
  // } catch (error) {
  //   console.error('Error updating activity:', error);
  //   throw error; 
  // }
}

export async function deleteActivity(id) {
  try {
    const response = await axios.delete(`/activities/${id}`);
    return response;
  } catch (error) {
    console.error("Can't delete activity", error);
    throw error;
  }
}

export async function searchActivities() {
  try {
    const response = await axios.get("/activities/search");
    return response;
  } catch (error) {
    console.error("Can't search for activities", error);
    throw error;
  }
}

export async function viewUpcomingActivities() {
  try {
    const response = await axios.get("/activities/upcoming");
    return response;
  } catch (error) {
    console.error("Can't view activities", error);
    throw error;
  }
}

export async function viewHistoryActivities() {
  try {
    const response = await axios.get("/activities/history");
    return response;
  } catch (error) {
    console.error("Can't view activities", error);
    throw error;
  }
}

export async function filterUpcomingActivities() {
  try {
    const response = await axios.get("/activities/filter");
    return response;
  } catch (error) {
    console.error("Can't filter activities", error);
    throw error;
  }
}

export async function sortUpcomingActivities() {
  try {
    const response = await axios.get("/activities/sort");
    return response;
  } catch (error) {
    console.error("Can't sort activities", error);
    throw error;
  }
}

export const getRatings = async (id) => {
  try {
    const response = await axios.get(`/activities/${id}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

export const addRating = async (activityID, ratingData) => {
  try {
    const response = await axios.post(`/activities/${activityID}/ratings`, ratingData, {
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