import axios from "axios";

export const baseURL =
  process.env.REACT_APP_API_URL ||
  "https://mern-blog-backend-htd8.onrender.com" ||
  "http://localhost:4444/";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
