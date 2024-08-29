import { useEffect, useState } from 'react'
import SearchIcon from '../../../assets/icon/SearchIcon.svg'
import { Button, Input, Modal } from 'antd'
import iconDelete from '../../../assets/icon/iconDelete.svg'
import miniCall from '../../../assets/icon/miniCall.svg'
import cloasX from '../../../assets/icon/x.svg'
import { getToken } from '../../store/StoreGetToken'
import apiClient from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import { Bounce, toast, ToastContainer } from 'react-toastify'

export default function Сontacts() {
  const [dataModalG, setDataModalG] = useState();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
  });
  const [open, setOpen] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const { refreshAccessToken } = getToken()
  const [dataModal, setDataModal] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [IDModal, setIDModal] = useState('');


  const [poisk, setPoisk] = useState('');
  const [poiskSurNeme, setPoiskSurNeme] = useState('');
  const [poiskMiaddleName, setPoiskMiaddleName] = useState('');
  const [poiskPhone, setPoiskPhone] = useState('');

  const [restart, setRestart] = useState(false)
  const navigate = useNavigate()


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({
      ...formData,
      [name]: value,
    })
  }




  const createContacts = async () => {
    let token = localStorage.getItem('accessToken');

    // Проверка на наличие всех обязательных полей
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.middleName) {
      toast.error('Заполните необходимые поля', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return; // Остановка выполнения функции, если валидация не пройдена
    }

    if (IDModal && token) {
      try {
        const res = await apiClient.put(`api/contacts/?id=${IDModal}&name=${formData.firstName}&surname=${formData.lastName}&phone=${formData.phone}&middleName=${formData.middleName}`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(res);
        setOpenCreate(false);
        navigate(0)
        // setFetching(true)ъ
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          let accessToken = await refreshAccessToken();
          let booleanRes = Boolean(accessToken);
          if (booleanRes) {
            setRestart(true);
          }
          console.log(error.response.status);
          console.log(`Аксес токен обновлен: ${accessToken}`);
        }
      }
    } else {
      // Дополнительная обработка, если IDModal или token отсутствуют
      console.log('Не удалось выполнить действие: отсутствуют необходимые данные.');
    }
  }

  const getModalDataContact = async (dataModalID) => {
    let token = localStorage.getItem('accessToken')
    try {
      const res = await apiClient.get(`api/contacts/?id=${dataModalID.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data);

      setDataModal(res.data)
      setIDModal(dataModalID.id)
      // console.log(`modalData: ${dataModalID}`);

      setFormData({
        firstName: res.data.name,
        lastName: res.data.surname,
        middleName: res.data.middleName,
        phone: res.data.phone
      })
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);

      }
    }
  }

  const calling = (tellNumber) => {
    console.log('calling');
    navigate(`/${tellNumber}`)
  }
  const noCalling = async () => {
    let token = localStorage.getItem('accessToken')
    try {
      const res = await apiClient.delete(`api/contacts/?id=${IDModal}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(res);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        let accessToken = refreshAccessToken()
        let booleanRes = Boolean(accessToken);
        if (booleanRes) {
          navigate(0)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
    } finally {
      navigate(0)
      setOpenCreate(false)
    }
  }

  async function fetchData(el) {
    try {
      let token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        if (el) {
          setCurrentPage(0);
        }
        const response = await apiClient.get(`/api/contacts/all?${poisk != '' ? `name=${poisk}&` : ''}${poiskSurNeme != '' ? `surname=${poiskSurNeme}&` : ''}${poiskMiaddleName != '' ? `middleName=${poiskMiaddleName}&` : ''}${poiskPhone != '' ? `phone=${poiskPhone}&` : ''}pagination.limit=25&pagination.page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.contacts)) {
          if (el) {
            setData(response.data.contacts)
          } else {
            setData((prev) => [...prev, ...response.data.contacts])
          }
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.contacts);
        }
        console.log(response.data);
        if (el) {
          setCurrentPage((el) => el + 1);
        } else {
          setCurrentPage(1);
        }
        poisk.length > 0 && poiskSurNeme.length > 0 && poiskMiaddleName.length > 0 && poiskPhone.length > 0 && setCurrentPage(1)
        setTotalCount(response.headers['x-total-count']);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken();
        let booleanRes = Boolean(accessToken);
        if (booleanRes) {
          setFetching(true)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
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
  const OpneModalInfo = (id) => {
    setOpen(true)
    getModalDataContact(id)
    setDataModalG(id)
  }
  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);
  return (<>
    {/* <ToastContainer /> */}
    <Modal
      open={open}
      title=''
      footer={() => (
        <>
          <div className='btnCallinBack'>
            <Button onClick={() => calling(dataModalG.phone)} style={{ background: '#0CD939', color: '#fff' }} className='callinBackContacts'>
              <img src={miniCall} alt="iconCollBtn" />
              <span>Позвонить</span>
            </Button>
            <Button onClick={() => noCalling()} style={{ background: '#D90C0C', color: '#fff' }} className='callinBackContacts'>
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
        {dataModalG ?
          <>
            <div className='bg-ccc'>
              {dataModalG.name[0]}
            </div>
            <h2>{dataModalG.name}</h2>
            <p>{dataModalG.phone}</p>
          </> : ''
        }
        <h1 onClick={() => {
          setOpen(false)
          setOpenCreate(true)
        }}>Изменить контакт</h1>
      </div>
    </Modal>
    <Modal
      open={openCreate}
      title='Изменить контакт'
      footer={() => (
        <>
          <div className='btnCallinBack'>
            <Button onClick={createContacts} style={{ background: '#2EA0FF', color: '#fff' }} className='callinBackContacts'>
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

      {dataModalG &&
        <div className="box-modal-createing-elements">
          <Input
            value={formData.firstName}
            name='firstName'
            onChange={handleChange}
            placeholder="Имя" />
          <Input
            value={formData.lastName}
            name='lastName'
            onChange={handleChange}
            placeholder="Фамилия" />
          <Input
            value={formData.middleName}
            name='middleName'
            onChange={handleChange}
            placeholder="Отчества" />
          <Input
            value={formData.phone}
            name='phone'
            onChange={handleChange}
            placeholder="Телефон" />
        </div>
      }

    </Modal>
    <div className='MessBox'>
      <div className="headerMess">
        <h1>Контакты</h1>
      </div>
      <div className="mainMess">
        <nav style={{ maxWidth: '350px', widows: '100%', display: "flex", justifyContent: 'center' }}>
          <input style={{ width: '100%' }} className='inputContentSearch' onChange={(el) => setPoisk(el.target.value)} placeholder='Поиск по имени' type="text" />
        </nav>
        <nav style={{ maxWidth: '350px', widows: '100%', display: "flex", justifyContent: 'center' }}>
          <input style={{ width: '100%' }} className='inputContentSearch' onChange={(el) => setPoiskSurNeme(el.target.value)} placeholder='Поиск по фамилии' type="text" />
        </nav>
        <nav style={{ maxWidth: '350px', widows: '100%', display: "flex", justifyContent: 'center' }}>
          <input style={{ width: '100%' }} className='inputContentSearch' onChange={(el) => setPoiskMiaddleName(el.target.value)} placeholder='Поиск по очества' type="text" />
        </nav>
        <nav style={{ maxWidth: '350px', widows: '100%', display: "flex", justifyContent: 'center' }}>
          <input style={{ width: '100%' }} className='inputContentSearch' onChange={(el) => setPoiskPhone(el.target.value)} placeholder='Поиск по номеру' type="text" />
          <button className='btnPoisk' style={{ marginLeft: '10px' }} onClick={() => fetchData('p')}>
            <img src={SearchIcon} className='SearchIcon' alt="SearchIcon" />
          </button>
        </nav>

      </div>
        <div className="ulLiDataMessHeader" >
          <div className="liMess" style={{ height: '15px', borderColor: '#229AFF' }}>
            <div>
              <input type="text" value='Имя' onChange={() => { }} />
            </div>
            <div>
              <input type="text" value='Фамилия' onChange={() => { }} />
            </div>
            <div>
              <input type="text" value='Отчества' onChange={() => { }} />
            </div>
            <div>
              <input type="text" value='Телефон' onChange={() => { }} />
            </div>
            <svg style={{ opacity: 0 }} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="15" fill="#279DFF" />
              <circle cx="8" cy="15" r="2.5" fill="#F5F5F5" />
              <circle cx="15" cy="15" r="2.5" fill="#F5F5F5" />
              <circle cx="22" cy="15" r="2.5" fill="#F5F5F5" />
            </svg>
          </div>
        </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>
        {loading ? (<p>Loading...</p>) : data.map((prev, i) => (
          <div key={i} className="liMess">
            <div>
              <input type="text" value={prev.name} onChange={() => { }} />
            </div>
            <div>
              <input type="text" value={prev.surname} onChange={() => { }} />
            </div>
            <div>
              <input type="text" value={prev.middleName} onChange={() => { }} />
            </div>
            <div>
              <input type="text" value={prev.phone} onChange={() => { }} />
            </div>
            <svg style={{ cursor: 'pointer' }} onClick={() => OpneModalInfo(prev)} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
