import { axios } from "./axios";

export async function changeGovernorPassword(id, oldPassword, newPassword) {
    // eslint-disable-next-line no-useless-catch
    try {
        const body = {
            "oldPassword": oldPassword,
            "newPassword": newPassword
        }
        console.log(`/governor-change-pass/${id}`);
        const response = await axios.put(`/governor-change-pass/${id}`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}