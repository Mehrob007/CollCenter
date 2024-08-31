import { useState, useEffect } from 'react'
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';
import cloasX from '../../../assets/icon/x.svg'
import { Modal } from 'antd';


export default function Magazine() {
  const [vibor, setVibor] = useState(0)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState({})

  async function fetchData(anotherStatus = false, id) {
    if (anotherStatus) {
      setData([]);
    }
    setVibor(id)
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/interactions/call/all?pagination.limit=1&pagination.page=${currentPage}&type=${id}`, {
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
        setTotalCount(response.headers['x-total-count']);
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
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 100 && data.length < totalCount) {
      setFetching(true);
    }
  };
  const OpenModalCreate = (prev) => {
    setOpen(true);
    setDataModal(prev)
  }

  useEffect(() => {
    if (fetching) {
      fetchData(false, vibor);
    }
  }, [fetching]);
  console.log(data);

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

      </div>


    </Modal>}
    <div className='MessBox'>
      <div className="headerMess">
        <h1>История звонков</h1>
      </div>
      <div className="mainMagazine">
        <div>
          <button onClick={() => {
            fetchData(true, 0)
          }} style={{ background: vibor == 0 ? '#2EA0FF' : 'transparent', color: vibor == 0 ? 'white' : 'black' }}>Входящие</button>
          <button onClick={() => {

            fetchData(true, 1)
          }} style={{ background: vibor == 1 ? '#2EA0FF' : 'transparent', color: vibor == 1 ? 'white' : 'black' }}>Исходящие</button>
        </div>
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
