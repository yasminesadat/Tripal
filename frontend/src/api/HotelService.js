import { axios } from "./axios";
export const getHotels = async () => {
    return axios.get("/searchHotels");
  };