import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';


export default function Magazine() {
  const [vibor, setVibor] = useState(1)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken()

  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/contacts/all?pagination.limit=1&pagination.page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.contacts)) {
          setData((prev) => [...prev, ...response.data.contacts]);
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.contacts);
        }
        console.log(response.data);

        setCurrentPage((el) => el + 1);
        setTotalCount(response.headers['x-total-count']);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }
  axios.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        setFetching(true)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        console.log(newToken);
        return axios(originalRequest);

      }
      return Promise.reject(error);
    }
  );


  const scrollHandler = (e) => {
    console.log('scroll');
    const target = e.target;
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 100 && data.length < totalCount) {
      setFetching(true);
    }
  };

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);
  return (
    <div className='MessBox'>
      <div className="headerMess">
        <h1>История звонков</h1>
      </div>
      <div className="mainMagazine">
        <div>
          <button onClick={() => setVibor(1)} style={{ background: vibor == 1 ? '#2EA0FF' : 'transparent', color: vibor == 1 ? 'white' : 'black' }}>Входящие</button>
          <button onClick={() => setVibor(2)} style={{ background: vibor == 2 ? '#2EA0FF' : 'transparent', color: vibor == 2 ? 'white' : 'black' }}>Исходящие</button>
          <button onClick={() => setVibor(3)} style={{ background: vibor == 3 ? '#2EA0FF' : 'transparent', color: vibor == 3 ? 'white' : 'black' }}>Пропущенные</button>
        </div>
      </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>

      </div>
    </div>
  )
}
