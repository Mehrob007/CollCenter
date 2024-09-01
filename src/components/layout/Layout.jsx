import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BsPersonCircle } from 'react-icons/bs'
import { jwtDecode } from 'jwt-decode' // Remove if not used
import { getToken } from '../store/StoreGetToken'
import apiClient from '../../utils/api'

export default function Layout() {
    const [openHeader, setOpenHeader] = useState(false)
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { refreshAccessToken } = getToken(state => ({
        refreshAccessToken: state.refreshAccessToken
    }))
    const [restart, setRestart] = useState(false)
    async function fetchData() {
        try {
            const token = localStorage.getItem('accessToken')
            const decodedHeader = jwtDecode(token)
            const id = decodedHeader["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            setLoading(true)
            if (token) {
                const response = await apiClient.get(`/api/users?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setData(response.data)
                console.log(response.data);
                
                setRestart(false)
            } else {
                console.error('Access token is missing')
            }
        } catch (error) {
            if (error.response.status === 401) {
                let accessToken = await refreshAccessToken()
                let booleanRes = Boolean(accessToken)
                if (booleanRes){
                    setRestart(true)
                }
                console.log(error.response.status);
                console.log(`Аксес токен обнавлен: ${accessToken}`);
                
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [restart])

    console.log(restart);
    const Exte = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate(0)
    }
    
    return (
        <div className="bigBox">
            <header style={{ width: openHeader ? '390px' : '150px' }}>
                <button
                    className={`openHeader ${openHeader ? 'clous' : 'open'}`}
                    style={{ left: openHeader ? '320px' : '62px' }}
                    onClick={() => setOpenHeader(!openHeader)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className="contentHeader" style={{ width: openHeader ? '290px' : '70px' }}>
                    <div className="personDiv">
                        <div className="person">
                            <BsPersonCircle />
                        </div>
                        <div className="personInfo" style={{ minWidth: openHeader ? '110px' : '0' }}>
                            {loading ? (
                                <h1>Loading...</h1>
                            ) : (
                                <>
                                    <h1>{data?.name} {data?.surname[0]}.</h1>
                                    <p>{data?.role}</p>
                                    <h2>{data?.extensionNumber}</h2>
                                </>
                            )}
                        </div>
                    </div>
                    <nav className="navigate">
                        <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="/">
                            <div className="iconMenu0"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Звонки</span>
                        </NavLink>
                        <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="message">
                            <div className="iconMenu1"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Почта</span>
                        </NavLink>
                        <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="task">
                            <div className="iconMenu2"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Задачи</span>
                        </NavLink>
                        <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="contacts">
                            <div className="iconMenu3"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Контакты</span>
                        </NavLink>
                        <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="magazine">
                            <div className="iconMenu4"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Журнал</span>
                        </NavLink>
                        {/* <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="menejment">
                            <div className="iconMenu5"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Операторы</span>
                        </NavLink>
                        <NavLink onClick={() => setOpenHeader(false)} style={{ width: openHeader ? '200px' : '30px' }} to="otchot">
                            <div className="iconMenu6"></div>
                            <span style={{ width: openHeader ? '120px' : '30px' }}>Отчеты</span> 
                        </NavLink>*/}
                    </nav>
                    <NavLink className="Exte" onClick={() => Exte()} style={{ width: openHeader ? '200px' : '30px' }} to="/">
                        <div></div>
                        <span style={{ width: openHeader ? '120px' : '30px' }}>Выход</span>
                    </NavLink>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}
