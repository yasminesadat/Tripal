import { axios } from './axios'

export async function getAdvertiserActivities () {   
}

export async function createActivity () {
}

export async function updateActivity () {   
}

export async function deleteActivity () {
}

export async function searchActivities () {
    try {
        const response = await axios.get('/api/activities/search');
        return response;
    } catch (error) {
        console.error("Can't search for activities",error);
        throw error
    }
}

export async function viewUpcomingActivities () {
    try {
        const response = await axios.get('/api/activities/view');
        return response;
    } catch (error) {
        console.error("Can't view activities",error);
        throw error
    }
}

export async function filterUpcomingActivities () {
    try{
        const response = await axios.get('/api/activities/filter');
        return response;
    } catch (error) {
        console.error("Can't filter activities",error);
        throw error
    }
}

export async function sortUpcomingActivities () {
    try{
        const response = await axios.get('/api/activities/sort');
        return response;
    } catch (error) {
        console.error("Can't sort activities",error);
        throw error
    }
}