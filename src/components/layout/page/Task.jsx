import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';

export default function Task() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken()
  const [dataParsin, setDataParsing] = useState([
    {
      "id": 0,
      "subject": "string",
      "startDate": "string",
      "dueDate": "string",
      "priority": 0,
      "description": "string",
      "status": 0,
      "users": [
        {
          "id": 0,
          "username": "string",
          "role": "Operator",
          "name": "string",
          "surname": "string",
          "extensionNumber": 0,
          "createdAt": "string"
        }
      ],
      "creator": {
        "id": 0,
        "username": "string",
        "role": "Operator",
        "name": "string",
        "surname": "string",
        "extensionNumber": 0,
        "createdAt": "string"
      },
      "interaction": {
        "id": 0,
        "description": "string",
        "fields": [
          {
            "id": 0,
            "name": "string",
            "value": "string"
          }
        ],
        "company": {
          "id": 0,
          "name": "string",
          "sipNumber": "string"
        },
        "contact": {
          "id": 0,
          "name": "string",
          "surname": "string",
          "phone": "string",
          "middleName": "string",
          "email": "string",
          "description": "string",
          "fields": [
            {
              "id": 0,
              "name": "string",
              "value": "string"
            }
          ],
          "creator": {
            "id": 0,
            "username": "string",
            "role": "Operator",
            "name": "string",
            "surname": "string",
            "extensionNumber": 0,
            "createdAt": "string"
          },
          "createdAt": "string"
        },
        "user": {
          "id": 0,
          "username": "string",
          "role": "Operator",
          "name": "string",
          "surname": "string",
          "extensionNumber": 0,
          "createdAt": "string"
        },
        "interactionDate": "string"
      }
    },
    {
      "id": 0,
      "subject": "string",
      "startDate": "string",
      "dueDate": "string",
      "priority": 0,
      "description": "string",
      "status": 0,
      "users": [
        {
          "id": 0,
          "username": "string",
          "role": "Operator",
          "name": "string",
          "surname": "string",
          "extensionNumber": 0,
          "createdAt": "string"
        }
      ],
      "creator": {
        "id": 0,
        "username": "string",
        "role": "Operator",
        "name": "string",
        "surname": "string",
        "extensionNumber": 0,
        "createdAt": "string"
      },
      "interaction": {
        "id": 0,
        "description": "string",
        "fields": [
          {
            "id": 0,
            "name": "string",
            "value": "string"
          }
        ],
        "company": {
          "id": 0,
          "name": "string",
          "sipNumber": "string"
        },
        "contact": {
          "id": 0,
          "name": "string",
          "surname": "string",
          "phone": "string",
          "middleName": "string",
          "email": "string",
          "description": "string",
          "fields": [
            {
              "id": 0,
              "name": "string",
              "value": "string"
            }
          ],
          "creator": {
            "id": 0,
            "username": "string",
            "role": "Operator",
            "name": "string",
            "surname": "string",
            "extensionNumber": 0,
            "createdAt": "string"
          },
          "createdAt": "string"
        },
        "user": {
          "id": 0,
          "username": "string",
          "role": "Operator",
          "name": "string",
          "surname": "string",
          "extensionNumber": 0,
          "createdAt": "string"
        },
        "interactionDate": "string"
      }
    },
    {
      "id": 0,
      "subject": "string",
      "startDate": "string",
      "dueDate": "string",
      "priority": 0,
      "description": "string",
      "status": 0,
      "users": [
        {
          "id": 0,
          "username": "string",
          "role": "Operator",
          "name": "string",
          "surname": "string",
          "extensionNumber": 0,
          "createdAt": "string"
        }
      ],
      "creator": {
        "id": 0,
        "username": "string",
        "role": "Operator",
        "name": "string",
        "surname": "string",
        "extensionNumber": 0,
        "createdAt": "string"
      },
      "interaction": {
        "id": 0,
        "description": "string",
        "fields": [
          {
            "id": 0,
            "name": "string",
            "value": "string"
          }
        ],
        "company": {
          "id": 0,
          "name": "string",
          "sipNumber": "string"
        },
        "contact": {
          "id": 0,
          "name": "string",
          "surname": "string",
          "phone": "string",
          "middleName": "string",
          "email": "string",
          "description": "string",
          "fields": [
            {
              "id": 0,
              "name": "string",
              "value": "string"
            }
          ],
          "creator": {
            "id": 0,
            "username": "string",
            "role": "Operator",
            "name": "string",
            "surname": "string",
            "extensionNumber": 0,
            "createdAt": "string"
          },
          "createdAt": "string"
        },
        "user": {
          "id": 0,
          "username": "string",
          "role": "Operator",
          "name": "string",
          "surname": "string",
          "extensionNumber": 0,
          "createdAt": "string"
        },
        "interactionDate": "string"
      }
    }
  ])

  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/tasks/all?pagination.limit=5&pagination.page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.tasks)) {
          setData((prev) => [...prev, ...response.data.tasks]);
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.tasks);
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
      <div className="mainTask">
        <h1>Задачи</h1>
        <Link to='/create-task' className='linkMess'>Создать задачу</Link>
      </div>
      <div onScroll={scrollHandler} className="ulLiDataMess">
        {loading ? <p>loading...</p> : dataParsin.map((prev, i) => 
           <div key={i} className='itemsMessContent'>
            <div>
              <div></div>
              <input type="text" onChange={(prev) => prev.target.value = prev.subject} value={prev.subject ?? ''} />
              <input type="text" onChange={(prev) => prev.target.value = prev.body} value={prev.creator.name ?? ''} />
              <input type="text" onChange={(prev) => prev.target.value = prev.string} value={prev.startDate ?? ''} />
              <input type="text" onChange={(prev) => prev.target.value = prev.string} value={prev.dueDate ?? ''} />
            </div>
            <h1>{prev.time}</h1>
        </div>)}
      </div>
    </div>
  );
}
