import axios from 'axios'
import react from 'react'

const baseURL = 'http://localhost:5050/prefTags'

// Create a new tag
export const createTag = async (tagData) => {
  return axios.post(`${baseURL}/createPrefTags`, tagData);
};

// Get all tags
export const getTags = async () => {
  return axios.get(`${baseURL}/getPrefTags`);
};

// Update a tag
export const updateTag = async (id, tagData) => {
  return axios.put(`${baseURL}/updatePrefTags/${id}`, tagData);
};

// Delete a tag
export const deleteTag = async (id) => {
  return axios.delete(`${baseURL}/deletePrefTags/${id}`);
};

