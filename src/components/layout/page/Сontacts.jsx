import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../assets/icon/SearchIcon.svg'
import { Button, Input, Modal } from 'antd'
import iconDelete from '../../../assets/icon/iconDelete.svg'
import miniCall from '../../../assets/icon/miniCall.svg'
import cloasX from '../../../assets/icon/x.svg'
import axios from 'axios'
import { getToken } from '../../store/StoreGetToken'
import apiClient from '../../../utils/api'

export default function Сontacts() {
  const [open, setOpen] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const { refreshAccessToken } = getToken()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: '',
    district: 'И. Сомони',
    school: 'СОУ 8',
    role: 'Родитель',
  });

  const calling = () => {
    console.log('calling');
  }
  const noCalling = () => {
    console.log('noCalling');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

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
        const response = await apiClient.get(`/api/contacts/all?pagination.limit=5&pagination.page=${currentPage}`, {
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
  // console.log(data);
  return (<>
    <Modal
      open={open}
      title=''
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <div className='btnCallinBack'>

            <Button onClick={calling} style={{ background: '#0CD939', color: '#fff' }} className='callinBackContacts'>
              <img src={miniCall} alt="iconCollBtn" />
              <span>Позвонить</span>
            </Button>
            <Button onClick={noCalling} style={{ background: '#D90C0C', color: '#fff' }} className='callinBackContacts'>
              <img src={iconDelete} alt="iconCollBtn" />
              <span>Удалить</span>
            </Button>
          </div>
        </>
      )}
    >
      <button className='cloas' onClick={() => setOpen(false)}>
        <img src={cloasX} alt="cloasX" />
      </button>
      <div className='box-modal-create-elements'>
        <div className='bg-ccc'></div>
        <h1 onClick={() => {
          setOpen(false)
          setOpenCreate(true)
        }}>Изменить контакт</h1>
      </div>
    </Modal>
    <Modal
      open={openCreate}
      title='Изменить контакт'
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <div className='btnCallinBack'>
            <Button onClick={calling} style={{ background: '#2EA0FF', color: '#fff' }} className='callinBackContacts'>
              <span>Сохранить</span>
            </Button>
            <Button onClick={() => setOpenCreate(false)} style={{ background: '#2ea1ff48', color: '#2EA0FF' }} className='callinBackContacts'>
              <span>Отмена</span>
            </Button>
          </div>
        </>
      )}
    >
      <button className='cloas' onClick={() => setOpenCreate(false)}>
        <img src={cloasX} alt="cloasX" />
      </button>

      <div className="box-modal-createing-elements">
        <Input
          value={ formData.firstName ?? ''}
          onChange={handleChange}
          placeholder="Имя" />
        <Input
          value={ formData.lastName ?? ''}
          onChange={handleChange}
          placeholder="Фамилия" />
        <Input
          value={ formData.middleName ?? ''}
          onChange={handleChange}
          placeholder="Отчества" />
        <Input
          value={ formData.phone ?? ''}
          onChange={handleChange}
          placeholder="Телефон" />
        <Input
          value={ formData.email ?? ''}
          onChange={handleChange}
          placeholder="E-mail" />
        <select value={formData.district ?? ''} onChange={handleChange}>
          <option value="*">И. Сомони</option>
        </select>
        <select value={formData.school ?? ''} onChange={handleChange}>
          <option value="*">СОУ 8</option>
        </select>
        <select value={formData.role ?? ''} onChange={handleChange}>
          <option value="*">Родитель</option>
        </select>
      </div>

    </Modal>
    <div className='MessBox'>
      <div className="headerMess">
        <h1>Контакты</h1>
      </div>
      <div className="mainMess">
        <img src={SearchIcon} className='SearchIcon' alt="SearchIcon" />
        <input className='inputContentSearch' placeholder='Поиск' type="text" />
      </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>
          {loading ? (<p>Loading...</p>) : ''}
      </div>
    </div>
  </>)
}
