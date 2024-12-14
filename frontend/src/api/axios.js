import axiosClient from "axios";

export const axios = axiosClient.create({
  baseURL: "https://tripal-production.up.railway.app/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});