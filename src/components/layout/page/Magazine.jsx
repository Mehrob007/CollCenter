import { useState, useEffect } from 'react'
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';
import cloasX from '../../../assets/icon/x.svg'
import { Input, Modal, Select, Space } from 'antd';
import { Link } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';


export default function Magazine() {
  const [vibor, setVibor] = useState('all')
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  // const [totalCount, setTotalCount] = useState(0);

  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    description: '',
    email: '',
    fields: [{ name: '', value: '', id: 1 }],
  });
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [openAddInteractions, setOpenAddInteractions] = useState(false)

  const [formDataUser, setFormDataUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [options, setOptions] = useState([]);

  const [formDataCompany, setFormDataCompany] = useState({});
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [currentPageCompany, setCurrentPageCompany] = useState(1);
  const [fetchingCompany, setFetchingCompany] = useState(true);
  const [optionsCompany, setOptionsCompany] = useState([]);

  const [formDataContacts, setFormDataContacts] = useState({});
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [currentPageContacts, setCurrentPageContacts] = useState(1);
  const [fetchingContacts, setFetchingContacts] = useState(true);
  const [optionsContacts, setOptionsContacts] = useState([]);

  const fetchDataUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/users/all?pagination.limit=25&pagination.page=${currentPageUser}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const newArr = response.data.users.map((el) => ({ label: el.name, value: el.id }));
        console.log(response.data);

        setOptions(newArr);
        // if (Array.isArray(response.data.users)) {
        //   setData((prev) => [...prev, ...response.data.users]);
        // } else {
        //   console.error('Ожидался массив, но получен другой тип данных:', response.data.users);
        // }
        setCurrentPageUser((prev) => prev + 1);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          setFetchingUser(true)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
      toast.error('Ошибка при загрузке данных', {
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
    } finally {
      setLoadingUser(false);
      setFetchingUser(false);
    }
  };
  useEffect(() => {
    fetchDataUser()
  }, [])
  useEffect(() => {
    if (fetchingUser) {
      fetchDataUser();
    }
  }, [fetchingUser])
  // console.log(formDataCompany);
  console.log(formData);



  // console.log(formDataCompany);

  // console.log(formDataContacts);


  const fetchDataCompany = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/companies/all?pagination.limit=25&pagination.page=${currentPageCompany}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const newArr = response.data.companies.map((el) => ({ label: el.name, value: el.id }));
        // console.log(response.data.companies);

        setOptionsCompany(newArr)
        setCurrentPageCompany((prev) => prev + 1);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          setFetchingCompany(true)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
      toast.error('Ошибка при загрузке данных', {
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
    } finally {
      setLoadingCompany(false);
      setFetchingCompany(false);
    }
  };
  useEffect(() => {
    fetchDataCompany()
  }, [])
  useEffect(() => {
    if (fetchingCompany) {
      fetchDataCompany();
    }
  }, [fetchingCompany])


  const fetchDataContacts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/contacts/all?pagination.limit=25&pagination.page=${currentPageContacts}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const newArr = response.data.contacts.map((el) => ({ label: el.name, value: el.id }));
        console.log(response.data.contacts);

        setOptionsContacts(newArr)
        setCurrentPageContacts((prev) => prev + 1);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          setFetchingContacts(true)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
      toast.error('Ошибка при загрузке данных', {
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
    } finally {
      setLoadingContacts(false);
      setFetchingContacts(false);
    }
  };
  useEffect(() => {
    fetchDataContacts()
  }, [])
  useEffect(() => {
    if (fetchingContacts) {
      fetchDataContacts();
    }
  }, [fetchingContacts])


  console.log(formDataCompany);




  const postAddNewInteraction = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log(token);
      
      const localDate = new Date();
      const isoDate = localDate.toISOString();
      if (token) {
        const response = await apiClient.post(`/api/interactions/?description=${formData.description}&fields=${JSON.stringify(formData.fields)}&companyId=${formDataCompany.idCompany}&contactId=${formDataContacts.idContacts}&userId=${formDataUser.idUsers}&interactionDate=${isoDate}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          setFetchingContacts(true)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
      toast.error('Ошибка при отправке данных', {
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
    } finally {
      setLoadingContacts(false);
      setFetchingContacts(false);
    }
  }
  async function fetchData(anotherStatus = false, id) {
    if (anotherStatus) {
      setData([]);
    }
    setVibor(id)
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/interactions/${id !== 'all' ? `call/all?pagination.limit=25&pagination.page=${anotherStatus ? (currentPage == 2 ? 1 : currentPage) : currentPage}&type=${id}` : `all/?pagination.limit=25&pagination.page=${currentPage}`}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.interactions)) {
          setData((prev) => [...prev, ...response.data.interactions]);
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.interactions);
        }
        console.log(response.data);
        if (anotherStatus) {
          setCurrentPage(1);
        }
        else {
          setCurrentPage((el) => el + 1);
        }
        // setTotalCount(response.headers['x-total-count']);
      } else {
        console.error('Access token отсутствует');
      }

    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
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
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 100 && data.length) {
      setFetching(true);
    }
  };
  const OpenModalCreate = (prev) => {
    setOpen(true);
    setDataModal(prev)
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  console.log(formData.fields);

  const handleChangeFields = (el, id) => {
    const { name, value } = el.target;

    const newData = formData.fields.map((prev) => {
      if (prev.id === id) {
        return { ...prev, [name]: value }; // Fix here: Spread prev correctly
      } else {
        return prev;
      }
    });

    setFormData((prevState) => ({
      ...prevState,
      fields: newData,
    }));
  };
  const addFields = (id) => {
    setFormData((prevState) => ({
      ...prevState,
      fields: [...prevState.fields, { name: '', value: '', id }],
    }));
  };
  const removeFields = (id) => {
    setFormData((prevState) => ({
      ...prevState,
      fields: prevState.fields.filter(el => el.id !== id),
    }));
  }


  useEffect(() => {
    if (fetching) {
      fetchData(false, vibor);
    }
  }, [fetching]);
  // console.log(data);


  return (<>
    {open && <Modal
      open={open}
      // title={``}
      footer={() => { }}
    >
      <button className='cloas' onClick={() => setOpen(false)}>
        <img src={cloasX} alt="cloasX" />
      </button>
      <div className='box-modal-create-elements'>
        {dataModal ?
          <>
            <div>
              <div className='bg-ccc' style={{ marginBottom: '10px' }}>
                {dataModal.contact.name[0]}
              </div>
              <h3>
                {dataModal.contact.name}  {dataModal.contact.surname}
              </h3>
              <p>+992 {dataModal.contact.phone}</p>
            </div>
          </> : ''
        }

      </div>
      <div className="infoModalMag">
        <div>
          <label>Продолжительность:</label>
          <p>{dataModal.callDuration}</p>
        </div>
        <div>
          <label>Дата и время:</label>
          <p>{dataModal.interactionDate.split('T')[0]}  {dataModal.interactionDate.split('T')[1].split('.')[0]}</p>
        </div>
        <div>
          <label>Тип звонка:</label>
          <p>{dataModal.type === 0 && 'Входящий' || dataModal.type === 1 && 'Исходящий'}</p>
        </div>
        <nav className='btnCallinBack' style={{ margin: 0 }}>
          <Link to={`/contacts/${dataModal.contact.phone}`} style={{ background: '#2EA0FF', color: '#fff' }} className='callinBackContacts'>
            <span>Контакт</span>
          </Link>
          <Link to={`/create-task/${dataModal.id}`} style={{ background: '#2ea1ff48', color: '#2EA0FF', width: '300px' }} className='callinBackContacts'>
            <span>Создать Задачу</span>
          </Link>
        </nav>

      </div>


    </Modal>}
    {openAddInteractions && <Modal
      open={openAddInteractions}
      // title={``}
      footer={() => (
        <nav className='btnCallinBack' style={{ margin: 0 }}>
          <button style={{ background: '#2EA0FF', color: '#fff' }} onClick={() => postAddNewInteraction()} className='callinBackContacts'>
            <span>Создать</span>
          </button>
          <button onClick={() => setOpenAddInteractions(false)} style={{ background: '#2ea1ff48', color: '#2EA0FF' }} className='callinBackContacts'>
            <span>Отмена</span>
          </button>
        </nav>

      )}
    >
      <button className='cloas' onClick={() => setOpenAddInteractions(false)}>
        <img src={cloasX} alt="cloasX" />
      </button>
      <div className="infoModalMag">
        <div className="box-modal-createing-elements">
          <div>
            <label >companyId</label>
            {!loadingCompany &&

              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Options company"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={(value) => {
                  setFormDataCompany((prev) => ({
                    ...prev,
                    idCompany: value
                  }));
                }}
                options={optionsCompany}
              />
            }
          </div>
          <div>
            <label >contactId</label>
            {!loadingContacts &&

              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Options contacts"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={(value) => {
                  setFormDataContacts((prev) => ({
                    ...prev,
                    idContacts: value
                  }));
                }}
                options={optionsContacts}
              />
            }
          </div>
          <div>
            <label >userId</label>
            {!loadingUser &&

              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Options user"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={(value) => {
                  setFormDataUser((prev) => ({
                    ...prev,
                    idUsers: value
                  }));
                }}
                options={options}
              />}
          </div>
          <div>
            <label >Описание</label>
            <textarea value={formData.description}
              name='description'
              onChange={handleChange}
              placeholder="Описание">

            </textarea>
          </div>
          <div>
            {formData.fields.map((el) => (
              <div key={el.id} className='fields'>
                <div>
                  <label>имя</label>
                  <input
                    value={el.name}
                    name='name'
                    onChange={(event) => handleChangeFields(event, el.id)}
                    type="text"
                  />
                </div>
                <div>
                  <label>значение</label>
                  <input
                    value={el.value}
                    name='value'
                    onChange={(event) => handleChangeFields(event, el.id)}
                    type="text"
                  />

                </div>
                {el.id != formData.fields[0].id && (
                  <nav className='removeFields' onClick={() => removeFields(el.id)}>-</nav>
                )}
              </div>
            ))}
            {formData.fields.length && (
              <nav className='addFields' onClick={() => addFields(formData.fields.length + 1)}>+</nav>
            )}


          </div>

        </div>


      </div>


    </Modal>}
    <div className='MessBox'>
      <div className="headerMess">
        <h1>Взаимодействие</h1>
      </div>
      <div className="mainMagazine">
        <div>
          <button onClick={() => {
            fetchData(true, 'all')
          }} style={{ background: vibor == 'all' ? '#2EA0FF' : 'transparent', color: vibor == 'all' ? 'white' : 'black' }}>все</button>
          <button onClick={() => {
            fetchData(true, 0)
          }} style={{ background: vibor == 0 ? '#2EA0FF' : 'transparent', color: vibor == 0 ? 'white' : 'black' }}>Входящие</button>
          <button onClick={() => {
            fetchData(true, 1)
          }} style={{ background: vibor == 1 ? '#2EA0FF' : 'transparent', color: vibor == 1 ? 'white' : 'black' }}>Исходящие</button>
        </div>
        <button onClick={() => setOpenAddInteractions(true)}>Добавить взаимодействие</button>
      </div>


      <div className="ulLiDataMessHeader" style={{ marginTop: '20px' }}>
        <div className='itemsMessContent'>
          <h1 style={{ width: "180px", textAlign: 'start' }}>ФИО</h1>
          <h1 style={{ width: "180px", textAlign: 'start' }}>Номер</h1>
          <h1 style={{ width: "180px", textAlign: 'start' }}>Продолжительность</h1>
          <h1 style={{ width: "180px", textAlign: 'start' }}>Дата и время:</h1>
        </div>
      </div>

      <div className="ulLiDataMess" onScroll={scrollHandler}>
        {!loading ? data.map((prev, i) => (
          <div key={i} onClick={() => OpenModalCreate(prev)} className='itemsTasksContent' style={{ cursor: 'pointer' }}>
            <input type="text" onChange={() => { }} value={`${prev.contact.name}  ${prev.contact.surname[0]}.`} />
            <input type="text" onChange={() => { }} value={`+992 ${prev.contact.phone}`} />
            <input type="text" onChange={() => { }} value={`${prev.callDuration}`} />
            <h1>{prev.interactionDate.split('T')[0]}  {prev.interactionDate.split('T')[1].split('.')[0]}</h1>
          </div>
        )) : <div>loading...</div>}
      </div>
    </div>
  </>)
}
