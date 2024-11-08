import { axios } from "./axios";

axios.defaults.withCredentials = true;

export async function login(username, password) {
  try {
    return await axios.post("/api/login", { username, password });
  } catch (error) {
    console.error("Login failed", error);
  }
}
