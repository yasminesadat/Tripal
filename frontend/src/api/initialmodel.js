import { axios } from './axios'

export async function signUp (newUser) {
    try {
        const response = await axios.post('/sellers/seller', newUser);
        console.log('Response:', response);
    } catch (error) {
        console.error("errorrrrrr",error);
        throw error
    }
}
