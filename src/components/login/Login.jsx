import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getToken } from '../store/StoreGetToken';
import apiClient from '../../utils/api';

export default function Login() {
    const [inputLogin, setINputLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshAccessToken } = getToken();



    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setTokenRefreshTimer(); 
        }
    }, []);

    async function sendFormData(e) {
        // console.log(`https://localhost:7523/api/auth/login?username=${inputLogin}&password=${passwordLogin}`);
        e.preventDefault();
        if (!localStorage.getItem('accessToken')) {
            try {
                setLoading(true);
                const res = await apiClient.post(`/api/auth/login?username=${inputLogin}&password=${passwordLogin}`);

                const { accessToken, refreshToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                document.location.href = '/'

                setTokenRefreshTimer();
                console.log('Login successful');
            } catch (e) {
                console.error(e);
                alert('Неправильный пароль или ID');
            } finally {
                setLoading(false);
            }
        }
    }



    function setTokenRefreshTimer() {
        
        clearTimeout(window.tokenRefreshTimer);
        
        window.tokenRefreshTimer = setTimeout(() => {
            refreshAccessToken();
        }, 2000); 
    }

    // }

    axios.interceptors.request.use(
        async (config) => {
            let token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const newToken = await refreshAccessToken();
                refreshAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                console.log(newToken);
                return axios(originalRequest);
                
            }
            return Promise.reject(error);
        }
    );

    return (
        <div className='boxLogin'>
            <div className='bg-components-1'></div>
            <div className='bg-com-2'>
                <div className='bg-components-2'></div>
            </div>
            <form className='FormDataLogin' onSubmit={sendFormData}>
                <div className="headFormLogin">
                    <h1>Войти в свой аккаунт</h1>
                    <span></span>
                </div>
                <div className='inputFormLogin'>
                    <input
                        className='inp1'
                        type="text"
                        placeholder='Логин'
                        onChange={(el) => setINputLogin(el.target.value)}
                    />
                    <input
                        className='inp2'
                        type="password"
                        placeholder='Пароль'
                        onChange={(el) => setPasswordLogin(el.target.value)}
                    />
                </div>
                <button className='buttonSubmitFormLogin' type='submit' disabled={loading}>
                    {loading ? 'Загрузка...' : 'Вход'}
                </button>
            </form>
        </div>
    );
}
