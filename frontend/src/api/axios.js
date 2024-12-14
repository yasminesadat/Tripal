import axiosClient from "axios";


/// vercel changes
export const axios = axiosClient.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
  credentials: 'include'
});
