import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});
//interceptor for auto refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        await axios.post("/refresh", {}, { withCredentials: true });
        return api(err.config);
      } catch (refreshError) {
        console.log("Session expired !");
      }
      return Promise.reject(err);
    }
  },
);
export default api;
