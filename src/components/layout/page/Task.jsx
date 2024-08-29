import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';
import { Button, Input, Modal } from 'antd';
import cloasX from '../../../assets/icon/x.svg'

export default function Task() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))
  const [openCreate, setOpenCreate] = useState();
  const [formData, setFormData] = useState();


  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/tasks/all?pagination.limit=25&pagination.page=${currentPage}`, {
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
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 100 && data.length < totalCount) {
      setFetching(true);
    }
  };
  const seveDataItemTask = async (dataItem) => {
    const token = localStorage.getItem('accessToken')
    try{
      const res = await apiClient.put(`api/tasks/?id=${dataItem.id}&subject=${dataItem.subject}}&startDate=${dataItem.startDate}&dueDate=${dataItem.dueDate}&priority=${dataItem.priority}&description=${dataItem.description}&status=${dataItem.status}&usersId=${dataItem.creator.id}&interactionId=${dataItem.interaction.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data);
      
    }catch(error){
      console.error(error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);

      }
    }
  }
  const OpenModalCreate = ( dataItem ) => {
    setOpenCreate(true)
    seveDataItemTask( dataItem )
  }
  const handleChange = (el) => {
    const { name, value } = el.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);

  return (
    <div className='MessBox'>
      <Modal
        open={openCreate}
        title='Изменить Задачу'
        footer={() => (
          <>
            <div className='btnCallinBack'>
              {/* <Button onClick={createContacts} style={{ background: '#2EA0FF', color: '#fff' }} className='callinBackContacts'>
                <span>Сохранить</span>
              </Button> */}
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

        {false &&
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
      <div className="mainTask">
        <h1>Задачи</h1>
        <Link to='/create-task' className='linkMess'>Создать задачу</Link>
      </div>
      <div className="ulLiDataMessHeader" >
        <div className='itemsMessContent'>
          <div>
            <div style={{ background: 'transparent' }}></div>
            <input type="text" onChange={() => { }} value={'Имя задачи'} />
            <input type="text" onChange={() => { }} value={'Суть задачи'} />
            <input type="text" onChange={() => { }} value={'Работаюшие '} />
            <input type="text" style={{ display: 'none' }} />
          </div>
          <p>Приоритет</p>
          <p>--Статус--</p>
          <h1>-----Дата-----</h1>
        </div>
      </div>
      <div onScroll={scrollHandler} className="ulLiDataMess">
        {loading ? <p>loading...</p> : data.map((prev, i) =>
          <div key={i} onClick={() => OpenModalCreate(prev)} className='itemsMessContent' style={{ cursor: 'pointer' }}>
            <div>
              <div></div>
              <input type="text" onChange={(prev) => prev.target.value = prev.subject} value={prev.subject ?? ''} />
              <input type="text" onChange={(prev) => prev.target.value = prev.body} value={prev.creator.name ?? ''} />
              <input type="text" onChange={() => { }} value={prev.users.map((el) => el.username) ?? ''} />
            </div>
            <p>{prev.priority}</p>
            <p>{prev.status}</p>
            <h1>{prev.dueDate.split('T')[0]}</h1>
          </div>)}
      </div>
    </div>
  );
}
