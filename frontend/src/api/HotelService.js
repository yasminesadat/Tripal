import { axios } from "./axios";
export const getHotels = async (cityCode) => {
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

  export const getHotelDetails = async (hotelID) => {
    try {
      console.log("Raw cityCode value:", hotelID); // This should print just "CAI"

      const response = await axios.get(`/getHotelDetails`,{
        params: { hotelID }});
      return response.data;
    }
    catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
      console.log("ERRPR MESSAGE", errorMessage)
      throw new Error(errorMessage);
    };
  };

  export const getHotelPrices = async (hotelIds,checkInDate,checkOutDate,adults,boardType) => {
    try {
      console.log(hotelIds,checkInDate,checkOutDate,adults,boardType); // This should print just "CAI"

      const response = await axios.get(`/getHotelPrices`,{
        params: { hotelIds,checkInDate,checkOutDate,adults,boardType }});
      return response.data;
    }
    catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
      console.log("ERRPR MESSAGE", errorMessage)
      throw new Error(errorMessage);
    };
  };

   
  export const getCityCode = async (searchinfo) =>{
    try {
      console.log(" searchinfo is", searchinfo); // This should print just "CAI"

      const response = await axios.get(`/searchCity`,{
        params: {searchinfo }});
      return response.data;
    }
    catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
      console.log("ERRPR MESSAGE", errorMessage)
      throw new Error(errorMessage);
    };
  }


