import { axios } from "./axios";
const path='/seller'
export async function createSeller(newUser) {
  try {
    await axios.post(path, newUser);
  } catch (error) {
    throw error;
  }
}
export const updateSeller =(id,data)=>{
   axios.put(`${path}/${id}`,data)
   .then((result)=>{
      return result;
   })
   .catch(err=>{
    throw err;
   })
}

export const getSellerDetails=(id)=>{
  axios.get(`${path}/${id}`)
  .then((result)=>{
    return result;
  })
  .catch(err=>{
    throw err;
  })
}
