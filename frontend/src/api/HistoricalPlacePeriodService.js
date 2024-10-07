import { axios } from "./axios";
const periodTagsPath='/periodtags';
export async function getAllPeriodTags() {
  try {
    const response = await axios.get(periodTagsPath);
    return response.data;
  } catch (error) {
    console.error("Can't fetch period tags", error);
    throw error;
  }
}

export const CreateNewPeriodTag=async(data)=>{
  try{
  const result= await axios.post(periodTagsPath,data);
   return result;
  }catch(err){
      throw err;
    }
 
}


export const getPeriodTagDetails=(id)=>{
  axios.get(periodTagsPath+`/${id}`)
  .then((result)=>{
    return result;
  })
  .catch((err)=>{
    throw err;
  })
}
