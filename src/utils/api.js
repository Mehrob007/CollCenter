
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7523',
});

export default apiClient;