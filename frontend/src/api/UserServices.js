import { axios } from "./axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function login(username, password) {
  try {
    const response = await axios.post("/api/login", { username, password });
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    console.error("Login failed", error);
  }
}
