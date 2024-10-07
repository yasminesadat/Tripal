import { axios } from "./axios";

// Create a new tag
export const createTag = async (tagData) => {
  return axios.post("/pref-tags", tagData);
};

// Get all tags
export const getTags = async () => {
  return axios.get("/pref-tags");
};

// Update a tag
export const updateTag = async (id, tagData) => {
  return axios.put(`/pref-tags/${id}`, tagData);
};

// Delete a tag
export const deleteTag = async (id) => {
  return axios.delete(`/pref-tags/${id}`);
};
