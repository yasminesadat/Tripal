import { axios } from "./axios";

export const createTag = async (tagData) => {
  return axios.post("/pref-tags", tagData);
};

export const getTags = async () => {
  return axios.get("/pref-tags");
};

export const updateTag = async (id, tagData) => {
  return axios.put(`/pref-tags/${id}`, tagData);
};

export const deleteTag = async (id) => {
  return axios.delete(`/pref-tags/${id}`);
};