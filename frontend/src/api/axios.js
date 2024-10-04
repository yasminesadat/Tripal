import axiosClient from "axios";

// Set it later in the login
const accessToken = localStorage.getItem("TRIPAL_ACCESS_TOKEN");

export const axios = axiosClient.create({
  baseURL: "http://localhost:5050/api",
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  },
});
