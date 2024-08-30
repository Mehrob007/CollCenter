import { useState, useEffect } from 'react'
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';


export default function Magazine() {
  const [vibor, setVibor] = useState(1)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))

  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/contacts/all?pagination.limit=1&pagination.page=${currentPage}`, {
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

        setTotalCount(response.headers['x-total-count']);
        setCurrentPage((el) => el + 1);
      } else {
        console.error('Access token отсутствует');
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if(error.response.status === 401){
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if(booleanRes){
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
  return (
    <div className='MessBox'>
      <div className="headerMess">
        <h1>История звонков</h1>
      </div>
      <div className="mainMagazine">
        <div>
          <button onClick={() => setVibor(1)} style={{ background: vibor == 1 ? '#2EA0FF' : 'transparent', color: vibor == 1 ? 'white' : 'black' }}>Входящие</button>
          <button onClick={() => setVibor(2)} style={{ background: vibor == 2 ? '#2EA0FF' : 'transparent', color: vibor == 2 ? 'white' : 'black' }}>Исходящие</button>
          {/* <button onClick={() => setVibor(3)} style={{ background: vibor == 3 ? '#2EA0FF' : 'transparent', color: vibor == 3 ? 'white' : 'black' }}>Пропущенные</button> */}
        </div>
      </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>
          {!loading ? <></> : <p>Loading...</p>}
      </div>
    </div>
  )
}
