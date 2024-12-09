import { axios } from "./axios";
const tagsPath = '/typetags';
export async function getAllTypeTags() {
  try {
    const response = await axios.get(tagsPath);
    return response.data;
  } catch (error) {
    console.error("Can't fetch type tags", error);
    throw error;
  }
}

export const CreateNewTypeTag = async (data) => {
  try {
    const result = await axios.post(tagsPath, data)
    return result;
  } catch (err) {
    throw err;
  }

}


export const getTypeTagDetails = (id) => {
  axios.get(tagsPath + `/${id}`)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw err;
    })
}