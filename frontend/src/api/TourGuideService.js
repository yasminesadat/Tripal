import { axios } from "./axios";

export async function createTourGuide(newUser) {
  try {
   const response= await axios.post("http://localhost:5050/api/tourGuide", newUser);
   return response;
  } catch (error) {
    throw error;
  }
}
export const updateProfile = async (id, Data) => {
  try {
   const response = await axios.put(`http://localhost:5050/api/tourGuide/${id}`, Data);
   return response;
  } catch (error) {
    console.error("Error updating your profile:", error);
    throw error;
  }
};
export const getProfileData = async (id) => {
  try {
    const response=await axios.get(`http://localhost:5050/api/tourGuide/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetch your profile data:", error);
    throw error;
  }
};
