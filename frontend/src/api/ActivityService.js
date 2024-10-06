import { useDebugValue } from "react";
import { axios } from "./axios";

export async function getAdvertiserActivities(advertiser) {
  try {
    const response = await axios.get(`/activities/advertiser/${advertiser}`);
    return response;
  } catch (error) {
    console.error("Can't get advertiser's activities", error);
    throw error;
  }
}

export async function createActivity() {}

export async function updateActivity() {}

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
    const response = await axios.get("/activities/view");
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
