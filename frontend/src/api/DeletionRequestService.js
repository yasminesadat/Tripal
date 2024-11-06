import { axios } from "./axios";

export async function requestAccountDeletion(role, userId) {
    try {
      const response = await axios.post(`/request-deletion/${role}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error requesting account deletion for ${role}:`, error);
      throw error;
    }
}
  