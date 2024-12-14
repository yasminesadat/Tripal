import axiosClient from "axios";

export const axios = axiosClient.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});