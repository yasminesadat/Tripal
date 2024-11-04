import { axios } from "./axios";
export const getHotels = async (cityCode) => {
    //const requestBody= {  cityCode: code } ;
    try {
      console.log("Raw cityCode value:", cityCode); // This should print just "CAI"

      const response = await axios.get(`/searchHotels`,{
        params: { cityCode }});
      return response.data;
    }
    catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
      console.log("ERRPR MESSAGE", errorMessage)
      throw new Error(errorMessage);
    };
  };

// import { axios } from "./axios";
// export const getHotels = async () => {
//     return axios.get("/searchHotels");
// }