import axios from "axios";

const BASEURL = import.meta.env.VITE_API_URL;

// создаём экземпляр axios
const apiClient = axios.create({
  baseURL: BASEURL,
  withCredentials: false,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("error", error.response?.status);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${BASEURL}api/auth/refreshToken?refreshToken=${refreshToken}`
        );

        const newAccessToken = res.data.accessToken;

        // сохраняем новый токен
        localStorage.setItem("accessToken", newAccessToken);

        // обновляем заголовок для повторного запроса
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // повторяем запрос
        return apiClient(originalRequest);
      } catch (err) {
        console.error("Ошибка при обновлении токена:", err);
        // например, разлогиниваем пользователя
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// добавляем токен к каждому запросу
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
