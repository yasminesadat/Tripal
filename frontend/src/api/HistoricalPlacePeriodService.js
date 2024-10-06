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

export const CreateNewPeriodTag=(data)=>{
  axios.post(periodTagsPath,data)
  .then((result)=>{
   return result
  }).catch((err)=>{
      throw err;
    })
 
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
