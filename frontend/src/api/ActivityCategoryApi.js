import axios from "axios";

const baseURL = "http://localhost:5050/api";

const ActivityCategoryApi = {

    getActivityCategories: async () => {
        try {
            const response = await axios.get(`${baseURL}/activityCategories`);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching activity categories:', error);
            throw error;
        }
    },

    deleteActivityCategory: async (id) => {
        try {
            const response = await axios.delete(`${baseURL}/activityCategory/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting activity category with id ${id}:`, error);
            throw error;
        }
    },
    createActivityCategory: async (name) => {
        const requestBody = {
            Name: name
        };
        console.log(`${baseURL}/activityCategory`);
        await axios.post(`${baseURL}/activityCategory`, requestBody)
            .then((response) => {
                console.log('Response:', response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    updateActivityCategory: async (id, name) => {
        try {
            const requestBody = {
                Name: name
            };
            const response = await axios.put(`${baseURL}/activityCategory/${id}`, requestBody);
            return response.data;
        } catch (error) {
            console.error(`Error updating activity category with id ${id}:`, error);
            throw error;
        }
    },
};

export default ActivityCategoryApi;
