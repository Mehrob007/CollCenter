import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';
import { Modal, Select, Space, Spin } from 'antd';
import cloasX from '../../../assets/icon/x.svg'
import CreateTask from './CreateTask';
import { Option } from 'antd/es/mentions';
import { Bounce, toast } from 'react-toastify';

export default function Task() {

  const { status } = useParams()
  const [vibor, setVibor] = useState(0)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))
  const [openCreate, setOpenCreate] = useState();
  const [formData, setFormData] = useState();
  const [dataState, setDataSatae] = useState({})
  const [fetching2, setFetching2] = useState(false);
  const [fetching3, setFetching3] = useState(false);
  const [options, setOptions] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [dataSearch, setDataSearch] = useState([]);
  const [fetchingSearch, setFetchingSearch] = useState(false);
  const ApplicationTaskPriority = [
    { label: 'Низкий', value: 0 },
    { label: 'Средний', value: 1 },
    { label: 'Высокий', value: 2 }
  ];
  const [arrObjactInteractionId, setArrObjactInteractionId] = useState([
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ]);

  const ApplicationTaskStatus = [
    { label: 'Отложено', value: 0 },
    { label: 'Ожидает ввода', value: 1 },
    { label: 'Завершено', value: 2 },
    { label: 'В процессе', value: 3 },
    { label: 'Не начато', value: 4 },
  ];
  console.log(status);

  const [dataSearchUsers, setDataSearchUsers] = useState([])
  const [fetchingSearchUsers, setFetchingSearchUsers] = useState([])


  async function fetchData(anotherStatus = false, id) {
    setVibor(id)
    try {
      // console.log(`/api/tasks/all?pagination.limit=25&pagination.page=${currentPage}&status=${status}`);
      console.log(`THIS STATUS IS ${status}`);

      if (anotherStatus) {
        setData([]);
      }
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/tasks/all?pagination.limit=25&pagination.page=${currentPage}&status=${id}`, {
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
        let accessToken = refreshAccessToken()
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
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 50 && data.length) {
      setFetching(true);
    }
  };
  const seveDataItemTask = async (el) => {
    el.preventDefault()
    
    console.log(formData);
    const token = localStorage.getItem('accessToken')
    try {

      const res = await apiClient.put(`api/tasks/?id=${formData.id}&subject=${formData.subject}}&startDate=${formData.startDate}&dueDate=${formData.dueDate}&priority=${formData.priority}&description=${formData.description}&status=${formData.status}&usersId=${formData.creator.id}&interactionId=${formData.interaction.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data);
      toast.success('Контакт успешно добавлен!');
      navigate(0)
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
    }
  }
  const OpenModalCreate = (dataItem) => {
    setOpenCreate(true)
    setFormData(dataItem)
    setDataSatae(dataItem)
    console.log(dataItem.id);

  }
  const handleChange = (el) => {
    const { name, value } = el.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log(formData);
  const navigate = useNavigate()

  const getDataSelectLine = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await apiClient.get(
        `api/interactions/all?pagination.limit=25&pagination.page=${currentPage2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData2((prevState) => [...prevState, ...response.data.interactions]);
      setCurrentPage2((el) => el + 1);
      console.log(response.data.interactions);

      const arr = response.data.interactions.map(el => [
        { value: el.id, label: `${el.contact.surname} ${el.contact.name[0]}.   Дата: ${el.interactionDate.split('T')[0]} ` }
      ])

      setArrObjactInteractionId(...arr)
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setFetching2(false);
    }
  }
  const scrollHandler2 = (e) => {
    const target = e.target;
    if (target && target.scrollHeight && target.scrollTop && target.clientHeight) {
      if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 1) {
        console.log('scroll');
        setFetching2(true);
      }
    }
  };

  const getUserSelectLine = async () => {
    const token = localStorage.getItem('accessToken');
    // console.log(token);

    try {
      const response = await apiClient.get(
        `api/users/all?pagination.limit=25&pagination.page=${currentPage3}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData3((prevState) => [...prevState, ...response.data.users]);
      setCurrentPage3((el) => el + 1);
      console.log(response.data.users);

      const arr = response.data.users.map(el => {
        return { value: el.id, label: el.username }
      }
      )
      console.log(arr)

      setOptions(arr)
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setFetching3(false);
    }
  }
  const scrollHandler3 = (e) => {
    const target = e.target;
    if (target && target.scrollHeight && target.scrollTop && target.clientHeight) {
      if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 1) {
        console.log('scroll');
        setFetching3(true)
      }
    }
  };

  const fetchOptionsUsers = async (searchValue) => {
    const token = localStorage.getItem('accessToken');
    setFetchingSearchUsers(false)
    try {
      const res = await apiClient.get(`/api/users/all?pagination.limit=15&pagination.page=1&search=${searchValue}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setDataSearchUsers(res.data.users)
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          navigate(0)
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
      setFetchingSearchUsers(false);
    }
  }

  const handleSearchUsers = (value) => {
    if (value) {
      fetchOptionsUsers(value)
    } else {
      setDataSearchUsers([])
    }
  }


  const fetchOptions = async (searchValue) => {
    setFetchingSearch(true)
    const token = localStorage.getItem('accessToken');
    try {
      const res = await apiClient.get(`api/interactions/all?pagination.limit=15&pagination.page=1&search=${searchValue}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setDataSearch(res.data.interactions);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          navigate(0)
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
      setFetchingSearch(false);
    }
  }


  const handleSearch = (value) => {
    if (value) {
      fetchOptions(value);
    } else {
      setDataSearch([])
    }
  }

  // useEffect(() => {
  //   // getUserSelectLine();
  //   fetchData(true, 0)
  // }, []);

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);
  useEffect(() => {
    getDataSelectLine();
  }, []);

  useEffect(() => {
    if (fetching2) {
      getDataSelectLine();
    }
  }, [fetching2]);


  useEffect(() => {
    if (fetching3) {
      getUserSelectLine();
    }
  }, [fetching3]);


  return (
    <div className='MessBox'>

      <Modal
        open={openCreate}
        title='Изменить Задачу'
        footer={() => { }}
      >
        <button className='cloas' onClick={() => setOpenCreate(false)}>
          <img src={cloasX} alt="cloasX" />
        </button>
        <button className='cloas' onClick={() => setOpenCreate(false)}>
          <img src={cloasX} alt="cloasX" />
        </button>

        {openCreate &&
          <form className="box-modal-createing-elements" onSubmit={(el) => seveDataItemTask(el, dataState)}>
            <div>
              <label>Взаимодействие</label>
              <Select
                showSearch
                allowClear
                placeholder="Взаимодействие"
                notFoundContent={fetchingSearch ? <Spin size="small" /> : null}
                filterOption={false}
                labelInValue // Позволяет Select работать с объектами { label, value }
                // value={getDataTaskState &&
                // {
                //   value: getDataTaskState.contact.id,
                //   label: `${getDataTaskState.contact.name} ${getDataTaskState.contact.surname[0]}. ${getDataTaskState.contact.middleName[0]}. ${getDataTaskState.interactionDate.split('T')[0]}`
                // }
                // }
                optionFilterProp="label"
                defaultValue={() =>
                  [{ value: formData.interaction.id, label: `${formData.interaction.contact.surname} ${formData.interaction.contact.name[0]}.   Дата: ${formData.interaction.interactionDate.split('T')[0]} ` }]
                }
                onSearch={handleSearch}
                style={{ width: '100%', height: '40px' }}
                onChange={(selected) => {
                  console.log(selected);

                  setFormData((prev) => ({
                    ...prev,
                    interactionId: selected.value
                  }));
                }}
              >
                {dataSearch?.map((item) => (
                  <Option
                    key={item.id}
                    value={item.contact.id}
                    label={`${item.contact.name} ${item.contact.surname[0]}. ${item.contact.middleName[0]}. ${item.interactionDate.split('T')[0]}`}
                  >
                    {item.contact.name} {item.contact.surname[0]}. {item.contact.middleName[0]}. {item.interactionDate.split('T')[0]}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label>Название задачи</label>
              <input
                name="subject"
                placeholder='Название задачи'
                type="text"
                value={formData.subject}
                onChange={handleChange}
                style={{ width: '480px' }}
              />
            </div>
            <div>
              <label>Исполнитель</label>
              {/* <Space onScroll={scrollHandler3} style={{ width: '100%' }} direction="vertical">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%', height: '50px' }}
                  placeholder="Исполнитель"
                  // defaultValue={formData.users.map(user => ({value:user.id, label: user.name}))}
                  onChange={(value) => {
                    setFormData((prev) => {
                      let newValue = options.filter(el => value.includes(el.value))
                      console.log(newValue);

                      return {
                        ...prev,
                        users: newValue
                      }
                    });
                  }}
                  options={!loading && options}
                />
              </Space> */}
              <Select
                mode="multiple"
                showSearch
                defaultValue={formData.users.map(user => ({value:user.id, label: user.name}))}
                allowClear
                placeholder="Исполнитель"
                notFoundContent={fetchingSearchUsers ? <Spin size="small" /> : null}
                filterOption={false}
                style={{ width: '100%', height: '40px' }}
                onSearch={handleSearchUsers}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    idUsers: value
                  }));
                }}
              >
                {dataSearchUsers?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.username}
                  </Option>
                ))}
              </Select>
            </div>

            <nav className='StatusPrioritet'>
              <div>
                <label>Приоритет</label>
                <Select
                  showSearch
                  style={{ width: 220 }}
                  placeholder="Приоритет"
                  defaultValue={formData.priority}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      idPreoritet: value
                    }));
                  }}
                  options={ApplicationTaskPriority}
                />
              </div>
              <div>
                <label>Статус</label>

                <Select
                  showSearch
                  style={{ width: 220 }}
                  placeholder="Статус"
                  optionFilterProp="label"
                  defaultValue={formData.status}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      idStatus: value
                    }));
                  }}
                  options={ApplicationTaskStatus}
                />
              </div>
            </nav>
            <div className='textareaformCreate'>
              <label>Описание</label>
              <textarea
                name="description"
                placeholder='Описание'
                value={formData.description}
                onChange={handleChange}
                style={{ border: '1px  solid #ccc', borderRadius: '10px', minHeight: '50px', padding: '10px' }}
              ></textarea>
            </div>
            <div className='inputData'>
              <label htmlFor="startDate">Начало</label>
              <input
                name="startDate"
                type="date"
                className='dateCreateTask'
                value={formData.startDate.split('T')[0]}
                onChange={handleChange}
                style={{ width: '500px' }}
              />
            </div>
            <div className='inputData'>
              <label htmlFor="deadline">Дедлайн</label>
              <input
                name="dueDate"
                type="date"
                id='deadline'
                className='dateCreateTask'
                value={formData.dueDate.split('T')[0]}
                onChange={handleChange}
                style={{ width: '500px' }}
              />
            </div>
            <div>
              {formData.interaction.fields.map((el, i) => {
                <div key={i}>
                  <div>
                    <label>имя</label>
                    <input value={el.name} type="text" />
                  </div>
                  <div>
                    <label>значение</label>
                    <input value={el.value} type="text" />
                  </div>
                </div>
              })}
            </div>
            <nav className='btnCallinBack'>
              <button type="submit" style={{ background: '#2EA0FF', color: '#fff' }} className='callinBackContacts'>
                <span>Сохранить</span>
              </button>
              <button onClick={() => setOpenCreate(false)} style={{ background: '#2ea1ff48', color: '#2EA0FF' }} className='callinBackContacts'>
                <span>Отмена</span>
              </button>
            </nav>
          </form>
        }


      </Modal>
      <div className="mainTask">
        <h1>Задачи</h1>
        <Link to='/create-task' className='linkMess'>Создать задачу</Link>
      </div>
      <div className='mainMess' style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <button onClick={() => {
            // navigate('/task/0')
            fetchData(true, 0)
          }} style={{ background: vibor == 0 ? '#2EA0FF' : 'transparent', color: vibor == 0 ? 'white' : 'black' }}>Отложеный</button>
          <button onClick={() => {
            // navigate('/task/1')
            fetchData(true, 1)
          }} style={{ background: vibor == 1 ? '#2EA0FF' : 'transparent', color: vibor == 1 ? 'white' : 'black' }}>Требует ввода</button>
          <button onClick={() => {
            // navigate('/task/2')
            fetchData(true, 2)
          }} style={{ background: vibor == 2 ? '#2EA0FF' : 'transparent', color: vibor == 2 ? 'white' : 'black' }}>Завершенные</button>
          <button onClick={() => {
            // navigate('/task/3')
            fetchData(true, 3)
          }} style={{ background: vibor == 3 ? '#2EA0FF' : 'transparent', color: vibor == 3 ? 'white' : 'black' }}>В прогрессе</button>
          <button onClick={() => {
            // navigate('/task/4')
            fetchData(true, 4)
          }} style={{ background: vibor == 4 ? '#2EA0FF' : 'transparent', color: vibor == 4 ? 'white' : 'black' }}>Не начатые</button>
        </div>
      </div>
      <div className="ulLiDataMessHeader">
        <div className='itemsMessContent'>
          <input type="text" onChange={() => { }} value={'Название'} />
          <input type="text" onChange={() => { }} value={'Создано'} />
          <input type="text" onChange={() => { }} value={'Исполнители'} />
          <input type="text" style={{ display: 'none' }} />
          {/* <p>Приоритет</p>
          <p>--Статус--</p>
          <h1>-----Даты-----</h1> */}
          <h1>Дедлайн</h1>
          <h1>Дата создание </h1>
        </div>
      </div>
      <div className="ulLiDataMessHeader">
        {data?.map((prev, i) => (
          <div key={i} onClick={() => OpenModalCreate(prev)} className='itemsTasksContent' style={{ cursor: 'pointer' }}>
            <input type="text" onChange={(el) => el.target.value = prev.subject} value={prev.subject ?? ''} />
            <input type="text" onChange={(el) => el.target.value = prev.creator.name} value={prev.creator.name ?? ''} />
            <input type="text" onChange={() => { }} value={prev.users.map((el) => el.username) ?? ''} />
            <h1>{prev.dueDate.split('T')[0]}</h1>
            <h1>{prev.startDate.split('T')[0]}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
