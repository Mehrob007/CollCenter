import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BsPersonCircle } from 'react-icons/bs'
import axios from 'axios'
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
    useEffect(() => {
        refreshAccessToken()
        const performAction = () => {
            console.log("Функция выполнена");
            refreshAccessToken()
        };
        const intervalId = setInterval(performAction, 10 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            setTokenRefreshTimer()
        }
    }, [])

    // console.log(refreshAccessToken());
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
            } else {
                console.error('Access token is missing')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function setTokenRefreshTimer() {
        clearTimeout(window.tokenRefreshTimer)
        window.tokenRefreshTimer = setTimeout(() => {
            refreshAccessToken()
        }, 60000) // Adjust time as necessary
    }

    useEffect(() => {
        fetchData()
    }, [])

    const Exte = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate(0)
    }

    axios.interceptors.request.use(
        async (config) => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axios.interceptors.response.use(
        (response) => {
            return response
        },
        async (error) => {
            const originalRequest = error.config
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                const newToken = await refreshAccessToken()
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                console.log(newToken)
                return axios(originalRequest)
            }
            return Promise.reject(error)
        }
    )

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
                        <div className="personInfo" style={{ minWidth: openHeader ? '70px' : '0px' }}>
                            {loading ? (
                                <h1>Loading...</h1>
                            ) : (
                                <>
                                    <h1>{data?.name} {data?.surname[0]}.</h1>
                                    <p>{data?.role}</p>
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
