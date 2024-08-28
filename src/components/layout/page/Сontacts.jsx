import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../assets/icon/SearchIcon.svg'
import { Button, Input, Modal } from 'antd'
import iconDelete from '../../../assets/icon/iconDelete.svg'
import miniCall from '../../../assets/icon/miniCall.svg'
import cloasX from '../../../assets/icon/x.svg'
import axios from 'axios'
import { getToken } from '../../store/StoreGetToken'
import apiClient from '../../../utils/api'
import { error } from 'jquery'
import { useNavigate } from 'react-router-dom'

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
  const [dataPars, setdataPars] = useState([
    {
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
    {
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
    }
  ]);
  const [dataModal, setDataModal] = useState({});
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);

  const createContacts = () => {
    let token = localStorage.getItem('accessToken')
    console.log(formData);

    try {
      const res = apiClient.post(`api/contacts/link`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })
      console.log(res);

    } catch (e) {
      console.error(e);
    }
  }

  const getModalDataContact = async (dataModalID) => {
    let token = localStorage.getItem('accessToken')
    try {
      const res = apiClient.get(`api/contacts/?id=${dataModalID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })
      // setDataModal(res)
    } catch (e) {
      console.error(e);
    }
  }

  const calling = (tellNumber) => {
    console.log('calling');
    navigate(`/${tellNumber}`)
  }
  const noCalling = async (iDDelete) => {
    let token = localStorage.getItem('accessToken')
    try {
      const res = await apiClient.delete(`api/contacts/?id=${iDDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }


  async function fetchData() {
    try {
      let token = localStorage.getItem('accessToken');
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
  const OpneModalInfo = (id) => {
    setOpen(true)
    getModalDataContact(id)
  }
  // console.log(data);
  return (<>
    <Modal
      open={open}
      title=''
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <div className='btnCallinBack'>

            <Button onClick={() => calling({/*dataModal.phone */ } || '000000')} style={{ background: '#0CD939', color: '#fff' }} className='callinBackContacts'>
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
        <div className='bg-ccc'>
          {false || 'A'} {/*dataModal.name[0] */}
        </div>
        <h2>{false || 'Name'}</h2>{/*dataModal.name */}
        <p>{false || '+992 000-0000-00'}</p>{/*dataModal.phone */}
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
            <Button onClick={() => createContacts()} style={{ background: '#2EA0FF', color: '#fff' }} className='callinBackContacts'>
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
          value={formData.firstName ?? ''}
          onChange={handleChange}
          placeholder="Имя" />
        <Input
          value={formData.lastName ?? ''}
          onChange={handleChange}
          placeholder="Фамилия" />
        <Input
          value={formData.middleName ?? ''}
          onChange={handleChange}
          placeholder="Отчества" />
        <Input
          value={formData.phone ?? ''}
          onChange={handleChange}
          placeholder="Телефон" />
        <Input
          value={formData.email ?? ''}
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
        {loading ? (<p>Loading...</p>) : data.map((prev, i) => (
          <div key={i} className="liMess" >
            <div>
              <input type="text" value={prev.name} onChange={() => { }} />
            </div>
            <div>
              <input type="text" value={prev.phone} onChange={() => { }} />
            </div>
            <svg style={{ cursor: 'pointer' }} onClick={() => OpneModalInfo(prev.id)} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="15" fill="#279DFF" />
              <circle cx="8" cy="15" r="2.5" fill="#F5F5F5" />
              <circle cx="15" cy="15" r="2.5" fill="#F5F5F5" />
              <circle cx="22" cy="15" r="2.5" fill="#F5F5F5" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  </>)
}
