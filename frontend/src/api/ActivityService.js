import { axios } from "./axios";


export async function createActivity(body) {
  try {
    const response =  await axios.post('/activities', body)
    return response;
  } catch (error) {
    console.error("Can't create activity", error);
    throw error;
  }
}
export async function updateActivity(id,body) {
  try {
    const response =  await axios.put(`/activities/${id}`, body)
    return response;
  } catch (error) {
    console.error("Can't update activity", error);
    throw error;
  }
}

export async function getAdvertiserActivities() {
  try {
    const response = await axios.get(`/activities/advertiser`);
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

export const getRatings = async (id) => {
  try {
    const response = await axios.get(`/activities/${id}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
}

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
}

export async function getAllActivities() {
  try {
    const response = await axios.get("/all-activities");
    return response;
  } catch (error) {
    console.error("Can't get all activities", error);
    throw error;
  }
}