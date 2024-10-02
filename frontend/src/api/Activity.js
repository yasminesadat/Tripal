import { axios } from './axios'

export async function viewUpcomingActivities () {
    try {
        const response = await axios.post('/activities/list', );
        console.log('Response:', response);
    } catch (error) {
        console.error("errorrrrrr",error);
        throw error
    }
}
