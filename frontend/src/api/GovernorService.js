import { axios } from "./axios";

export async function changeGovernorPassword(oldPassword, newPassword) {
    // eslint-disable-next-line no-useless-catch
    try {
        const body = {
            "oldPassword": oldPassword,
            "newPassword": newPassword
        }
        console.log(`/governor-change-pass`);
        const response = await axios.put(`/governor-change-pass`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}