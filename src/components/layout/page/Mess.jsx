import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';
import { LuDatabaseBackup } from 'react-icons/lu';
import { Modal } from 'antd';
import cloasX from '../../../assets/icon/x.svg'

export default function Mess() {
  const [vibor, setVibor] = useState(true)
  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false)
  const [dataMessage, setDataMessage] = useState();
  const navigate = useNavigate()

  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/email/all?pagination.limit=25&pagination.page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.emailLetters)) {
          setData((prev) => [...prev, ...response.data.emailLetters]);
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.emailLetters);
        }
        console.log(response.data.emailLetters);

        setCurrentPage((el) => el + 1);
        setTotalCount(response.headers['x-total-count']);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes){
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

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);

  const opneModalInfoMessage = (info) => {
    setOpen(true)
    setDataMessage(info)
    console.log(info);
  }
  const writeMessage = (email) => {
    navigate(`/write-letter/${email}`)
  }

  return (
    <div className='MessBox'>
      {dataMessage && (
        <Modal
          open={open}
          title={dataMessage.subject}
          footer={() => <><button className='write' onClick={() => writeMessage(dataMessage.recipients)}> Написать </button></>}
        >
          <button className='cloas' onClick={() => setOpen(false)}>
            <img src={cloasX} alt="cloasX" />
          </button>
          <div className='messageDataModal'>
            <p>{dataMessage.body}</p>
          </div>
        </Modal>
      )}
      <div className="headerMess">
        <h1>Почта</h1>
        <button className='upDataBtn' onClick={() => setFetching(true)}>
          <LuDatabaseBackup />
        </button>
      </div>
      <div className="mainMess">
        <div>
          <button onClick={() => setVibor(false)} style={{ background: !vibor ? '#2EA0FF' : 'transparent', color: !vibor ? 'white' : 'black' }}>Входящие</button>
          <button onClick={() => setVibor(true)} style={{ background: vibor ? '#2EA0FF' : 'transparent', color: vibor ? 'white' : 'black' }}>Отправленные</button>
        </div>
        <Link to='/write-letter' className='linkMess'>Новое письмо</Link>
      </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>
        {vibor ? !loading ? data.filter((prevFilter) => prevFilter.isIncoming == false).map((el, i) => (
          <div key={i} className='itemsMessContent' style={{ cursor: "pointer" }} onClick={() => opneModalInfoMessage(el)}>
            <div>
              <div></div>
              <input type="text" onChange={(prev) => prev.target.value = el.body} value={el.body ?? ''} />
              <input type="text" onChange={(prev) => prev.target.value = el.recipients} value={el.recipients ?? ''} />
              <input type="text" onChange={() => { }} value={el.subject} />
            </div>
            <h1>День: {el.sentDate.split('T')[0]} Время: {el.sentDate.split('T')[1].split('Z')[0].slice(0, 5)}</h1>
          </div>
        )) : <p>loading...</p> : !loading ? data.filter((prevFilter) => prevFilter.isIncoming == true).map((el, i) => (
          <div key={i} className='itemsMessContent' style={{ cursor: "pointer" }} onClick={() => opneModalInfoMessage(el)}>
            <div>
              <div></div>
              <input type="text" onChange={(prev) => prev.target.value = el.body} value={el.body ?? ''} />
              <input type="text" onChange={(prev) => prev.target.value = el.recipients} value={el.recipients ?? ''} />
              <input type="text" onChange={() => { }} value={el.subject} />
            </div>
            <h1>День: {el.sentDate.split('T')[0]} Время: {el.sentDate.split('T')[1].split('Z')[0].slice(0, 5)}</h1>
          </div>
        )) : <p>loading...</p>}
      </div>
    </div>
  )
}
