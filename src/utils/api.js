
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.158.193.4:8080',
});

export default apiClient;