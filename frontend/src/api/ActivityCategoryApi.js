import axios from "axios";
import React from "react";

const baseURL = "https://localhost:5000/activityCategory";

function getActivityCategories() {
  axios.get(`${baseURL}/getActivityCategories`).then((response) => {
    return response.data;
  });
}
