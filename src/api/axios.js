import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.includes("/auth/refresh/")) {
      console.error("Refresh token request failed", error);
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await api.post("/api/auth/refresh/");
          isRefreshing = false;
          onRefreshed();
          return api(originalRequest);
        } catch (err) {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(err);
        }
      }
      return new Promise((resolve) => {
        addRefreshSubscriber(() => {
          resolve(api(originalRequest));
        });
      });
    }

    console.error("API request failed", error);

    return Promise.reject(error);
  }
);

export default api;