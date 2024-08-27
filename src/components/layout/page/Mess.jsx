import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';

export default function Mess() {
  const [vibor, setVibor] = useState(true)
  const { refreshAccessToken } = getToken()
  const [dataParsin, setDataParsing] = useState([
    {
      name: 'Jackelyn Perra',
      tell: '000 0000 00',
      message: 'Hi. Ashley Found ',
      time: '17:00'
    },
    {
      name: 'Jackelyn Perra',
      tell: '000 0000 00',
      message: 'Hi. Ashley Found ',
      time: '17:00'
    },
    {
      name: 'Jackelyn Perra',
      tell: '000 0000 00',
      message: 'Hi. Ashley Found ',
      time: '17:00'
    }
  ])
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);

  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/email/email-credentials/all?pagination.limit=5&pagination.page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.emailCredentials)) {
          setData((prev) => [...prev, ...response.data.emailCredentials]);
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.emailCredentials);
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

  return (
    <div className='MessBox'>
      <div className="headerMess">
        <h1>Почта</h1>
      </div>
      <div className="mainMess">
        <div>
          <button onClick={() => setVibor(false)} style={{ background: !vibor ? '#2EA0FF' : 'transparent', color: !vibor ? 'white' : 'black' }}>Входящие</button>
          <button onClick={() => setVibor(true)} style={{ background: vibor ? '#2EA0FF' : 'transparent', color: vibor ? 'white' : 'black' }}>Отправленные</button>
        </div>
        <Link to='/write-letter' className='linkMess'>Новое письмо</Link>
      </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>
        {dataParsin.map((el, i) => (
          <div key={i} className='itemsMessContent'>
            <div>
              <div></div>
              <input type="text" onChange={(prev) =>  prev.target.value = el.tell} value={el.tell ?? ''} />
              <input type="text" onChange={(prev) =>  prev.target.value = el.name} value={el.name ?? ''} />
              <input type="text" onChange={(prev) =>  prev.target.value = el.message} value={el.message ?? ''} />
            </div>
            <h1>{el.time}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}
