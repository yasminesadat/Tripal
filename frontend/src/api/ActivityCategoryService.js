import { axios } from "./axios";

const ActivityCategoryService = {
  getActivityCategories: async () => {
    try {
      const response = await axios.get(`/activityCategories`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching activity categories:", error);
      throw error;
    }
  },

  deleteActivityCategory: async (id) => {
    try {
      const response = await axios.delete(`/activityCategory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting activity category with id ${id}:`, error);
      throw error;
    }
  },
  createActivityCategory: async (name) => {
    const requestBody = {
      Name: name,
    };
    console.log(`/activityCategory`);
    try {
      const response = await axios.post(`/activityCategory`, requestBody);
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  updateActivityCategory: async (id, name) => {
    try {
      const requestBody = {
        Name: name,
      };
      const response = await axios.put(
        `/activityCategory/${id}`,
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating activity category with id ${id}:`, error);
      throw error;
    }
  },
};

export default ActivityCategoryService;
