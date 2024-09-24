
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://10.158.193.4:8080',
});

export default apiClient;