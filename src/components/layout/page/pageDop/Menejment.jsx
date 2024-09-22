import { useState, useEffect } from 'react'
import { getToken } from '../../../store/StoreGetToken';
import apiClient from '../../../../utils/api';
import { Bounce, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';


export default function Menejment() {
  // const [vibor, setVibor] = useState(1)
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { refreshAccessToken } = getToken(state => ({
    refreshAccessToken: state.refreshAccessToken
  }))

  const validataError = (message) => {
    toast.error(message, {
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
    return false;
  }
  async function DeleteOperator( id ) {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await apiClient.delete(`/api/users/?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`оператор удален ${response.data}`);
        navigate(0)
        
      } else {
        validataError('ключ отсутствует ошибка: 403')
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        validataError('Ошибка при выполнении запроса: 401 перезагруска!')
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          setFetching(true)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
    }
  }
  async function fetchData() {
    try {
      const token = localStorage.getItem('accessToken');
      setLoading(true);
      if (token) {
        const response = await apiClient.get(`/api/users/all?pagination.limit=25&pagination.page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.users)) {
          setData((prev) => [...prev, ...response.data.users]);
        } else {
          console.error('Ожидался массив, но получен другой тип данных:', response.data.users);
        }

        // setTotalCount(response.headers['x-total-count']);
        setCurrentPage((el) => el + 1);
      } else {
        validataError('ключ отсутствует ошибка: 403')
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      if (error.response.status === 401) {
        validataError('Ошибка при выполнении запроса: 401 перезагруска!')
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          navigate(0)
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
    const target = e.target;
    if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 1) {
      console.log('scroll');
      setFetching(true);
    }
  };

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);
  console.log(data);

  return (
    <div className='MessBox'>
      <div className="headerMess" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Операторы</h1>
        <Link to={`/adding-operator`} style={{ padding: '2px 14px', background: '#e0e0e0', textDecoration: 'none', color: '#000', borderRadius: '10px', fontWeight: '400', fontSize: '18px'}}>Дабавить оператора</Link>
      </div>
      <div className="ulLiDataMess" onScroll={scrollHandler}>
        {data?.map((el) => (
          <div key={el.id} className='itemsTasksContent' style={{ cursor: 'pointer' }}>
            <h1>{el.name}</h1>
            <button className='buttonMenejDele' onClick={() => DeleteOperator(el.id)}>delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
