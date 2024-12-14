import { axios } from "./axios";

export async function createComplaint(newComplaint) {
  try {
    const response = await axios.post(`/complaint`, newComplaint);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while creating the complaint.");
  }
}

export async function getComplaintsByTourist() {
  try {
    const response = await axios.get(`/complaints/tourist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
}

export async function getAllComplaints() {
  try {
    const response = await axios.get(`/complaints`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
}

export async function getComplaintById(id) {
  try {
    const response = await axios.get(`/complaints/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
}

export async function updateComplaintStatus(id, updatedStatus) {
  try {
    const response = await axios.put(`/complaint/status/${id}`, updatedStatus);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function replyToComplaint(id, updatedReply) {
  try {
    const response = await axios.put(`/complaint/reply/${id}`, updatedReply);
    return response.data;
  } catch (error) {
    console.error("Error message:", error.message);
    throw error;
  }
}