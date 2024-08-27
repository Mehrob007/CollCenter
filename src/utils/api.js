
import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const apiClient = axios.create({
  baseURL: 'https://localhost:7523', // Укажите ваш базовый URL здесь
});

export default apiClient;