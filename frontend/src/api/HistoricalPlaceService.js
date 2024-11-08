

import { axios } from "./axios";
const path='/historicalPlaces/';
export async function getAllHistoricalPlaces() {
  try {
    const response = await axios.get('/historicalPlaces/');
    return response.data;
  } catch (error) {
    console.error("Can't fetch historical places", error);
    throw error;
  }
}
export async function getAllHistoricalPlacesByTourismGoverner(id) {
  try {
    const response = await axios.get(`/historicalPlaces/tourismGoverner/${id}`);
    return response.data;
  } catch (error) {             
    console.error("Can't fetch historical places", error);
    throw error;
  }
}

export const CreateNewHistoricalPlace=async(data)=>{
  try{
    const result= await axios.post('/historicalPlaces/',data)
   return result;
  }catch(err){
      throw err;
}
 
}
export const updateHistoricalPlace=async(id,data)=>{
  try{
  const result =await axios.put(`/historicalPlaces/${id}`,data)
    return result;
  }
  catch(err){
    throw err;
  }
}

export const getHistoricalPlaceDetails= async (id)=>{
  try{
    const result =await axios.get(`/historicalPlaces/${id}`);
    return result.data;
  }
  catch(err){
    throw err;
  }
}
export const deleteHistoricalPlace=async (id)=>{
try{
  //historicalPlaceRouter.delete("/historicalPlaces/:id", deleteHistoricalPlace);
  const result=await axios.delete(`/historicalPlaces/${id}/`);
  return result.data;
}
catch(e){
  throw e;
}
}
