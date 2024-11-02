import { axios } from "./axios";

export async function createComplaint(id, newComplaint) {
  try {
    const response = await axios.post(`/complaint/${id}`, newComplaint);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while creating the complaint.");
  }
}

export async function getComplaintsByTourist(id) {
    try {
      const response = await axios.get(`/complaints/tourist/${id}`);
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
      const response = await axios.get(`/complaint/${id}`);
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
      throw error; 
    }
  }

   