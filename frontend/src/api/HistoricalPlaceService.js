import { axios } from "./axios";
const path='/historicalPlaces/';
export async function getAllHistoricalPlaces() {
  try {
    const response = await axios.get(path);
    return response.data;
  } catch (error) {
    console.error("Can't fetch historical places", error);
    throw error;
  }
}

export const CreateNewHistoricalPlace=async(data)=>{
  try{
    const result= await axios.post(path,data)
   return result;
  }catch(err){
      throw err;
}
 
}
export const updateHistoricalPlace=(id,data)=>{
  try{
  const result =axios.put(path+`/${id}`,data)
    return result;
  }
  catch(err){
    throw err;
  }
}

export const getHistoricalPlaceDetails=(id)=>{
  try{
    const result =axios.get(path+`/${id}`)
    return result;
  }
  catch(err){
    throw err;
  }
}
