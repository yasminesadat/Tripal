import { axios } from "./axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebaseInstance } from '../firebase';

export async function createRequest(Body, documentFileObject) {
    try {
        const response = await axios.post("/request", Body);
        if (documentFileObject) {
            const storage = getStorage(firebaseInstance);
            const fileName = documentFileObject.name;
            const storageRef = ref(storage, fileName);
            await uploadBytesResumable(storageRef, documentFileObject);
            const url = await getDownloadURL(storageRef);
            await updateRequest(response.data._id, { "document": url });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
        console.log(error);
        throw new Error(errorMessage);
    }
}

export async function updateRequest(id, urlObject) {
    try {
        const response = await axios.put(`/requestDocument/${id}`, urlObject);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while updating the request.";
        throw new Error(errorMessage);
    }
}

export async function SetRequestStatus(id, statusValue) {
    try {
        const response = await axios.put(`/request/${id}`, { "status": statusValue });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while accepting the request.";
        throw new Error(errorMessage);
    }
}

export async function getRequest(id) {
    try {
        const response = await axios.get(`/request/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while retrieving the request.";
        console.log("ERROR MESSAGE", errorMessage);
        throw new Error(errorMessage);
    }
}

export async function getRequests() {
    try {
        const response = await axios.get(`/request`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while retrieving the request.";
        console.log("ERROR MESSAGE", errorMessage);
        throw new Error(errorMessage);
    }
}

export async function requestAccountDeletion() {
    try {
      const response = await axios.delete(`/request-deletion`);
      return response.data;
    } catch (error) {
      console.error(`Error requesting account deletion0 `, error);
      throw error;
    }
}