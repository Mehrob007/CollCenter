import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { Select, Space } from 'antd';
import axios from 'axios';
import apiClient from '../../../utils/api';
import { getToken } from '../../store/StoreGetToken';

export default function CreateTask() {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        description: '',
        startDate: '',
        deadline: '',
        idUsers: [],
        idPreoritet: '',
        idStatus: '',
        interactionId: ''
    });
    const [options, setOptions] = useState([])
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [fetching, setFetching] = useState(true);
    const { refreshAccessToken } = getToken()

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }


    function validateForm() {
        const { to, subject, description, startDate, deadline } = formData;
        const today = new Date().toISOString().split('T')[0];

        if (!to || !subject || !description || !startDate || !deadline) {
            toast.error('Заполните все поля', {
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

        if (startDate < today) {
            toast.error('Дата начала не может быть в прошлом', {
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

        if (deadline < today) {
            toast.error('Дедлайн не может быть в прошлом', {
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

        if (startDate > deadline) {
            toast.error('Дата начала не может быть позже дедлайна', {
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

        return true;
    }


    const ApplicationTaskPriority = [
        { label: 'Низкий', value: 0 },
        { label: 'Средний', value: 1 },
        { label: 'Высокий', value: 2 }
    ]
    let arrObjactInteractionId;

    const ApplicationTaskStatus = [
        { label: 'Отложено', value: 0 },
        { label: 'Ожидает ввода', value: 1 },
        { label: 'Завершено', value: 2 },
        { label: 'В процессе', value: 3 },
        { label: 'Не начато', value: 4 },
    ]

    async function fetchData() {
        try {
            const token = localStorage.getItem('accessToken');
            setLoading(true);
            if (token) {
                const response = await apiClient.get(`/api/users/all?pagination.limit=10&pagination.page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const newArr = response.data.users.map((el, i) => {
                    return { label: el.name, value: el.id }
                })
                setOptions(newArr)
                if (Array.isArray(response.data.users)) {
                    setData((prev) => [...prev, ...response.data.users]);
                } else {
                    console.error('Ожидался массив, но получен другой тип данных:', response.data.users);
                }

                setCurrentPage((el) => el + 1);
                setTotalCount(response.headers['x-total-count']);
            } else {
                console.error('Access token отсутствует');
            }

        } catch (err) {
            console.error('Ошибка при выполнении запроса:', err);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }
    console.log(formData.startDate);

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
    // console.log(`api/tasks/?subject=${formData.to}&startDate=${formData.startDate.toISOString()}&dueDate=${formData.deadline.toISOString()}&priority=${formData.idPreoritet}&description=${formData.description}&status=${formData.idStatus}${formData.idUsers.map(el => `&usersId=${el}`).join('')}interactionId=${formData.interactionId}`);
    

    async function funSendLetter(el) {
        el.preventDefault();
        let token = localStorage.getItem('accessToken');
        let startDate = new Date(formData.startDate)
        let deadline = new Date(formData.deadline)
        const res = await apiClient.post(`api/tasks/?subject=${formData.to}&startDate=${startDate.toISOString()}&dueDate=${deadline.toISOString()}&priority=${formData.idPreoritet}&description=${formData.description}&status=${formData.idStatus}${formData.idUsers.map(el => `&usersId=${el}`).join('')}interactionId=${formData.interactionId}`,
            null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res);

        if (validateForm()) {
            console.log('Form submitted successfully');
        }
    }

    return (
        <div className='WriteLetter'>
            <ToastContainer />
            <div className="headerWL">
                <h1>Создать задачу</h1>
            </div>
            <form className='formDataWL' onSubmit={funSendLetter}>
                <input
                    name="to"
                    placeholder='Название задачи'
                    type="text"
                    value={formData.to}
                    onChange={handleChange}
                />
                <Space onScroll={scrollHandler} style={{ width: '100%' }} direction="vertical">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%', height: '50px' }}
                        placeholder="Исполнитель"
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                idUsers: value
                            })
                        }
                        }
                        options={!loading && options}

                    />
                </Space>
                <Select
                        showSearch
                        style={{
                            width: '100%',
                        }}
                        placeholder="Приоритет"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                interactionId: value
                            })
                        }}
                        options={arrObjactInteractionId}
                    />
                <div className='StatusPrioritet'>
                    <Select
                        showSearch
                        style={{
                            width: 220,
                        }}
                        placeholder="Приоритет"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                idPreoritet: value
                            })
                        }}
                        options={ApplicationTaskPriority}
                    />
                    
                    <Select
                        showSearch
                        style={{
                            width: 220,
                        }}
                        placeholder="Статус"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={(value) => {
                            setFormData({
                                ...formData,
                                idStatus: value
                            })
                        }}
                        options={ApplicationTaskStatus}
                    />
                </div>
                <textarea
                    name="description"
                    placeholder='Описание'
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
                <div className='inputData'>
                    <label htmlFor="startDate">Начало</label>
                    <input
                        name="startDate"
                        type="date"
                        className='dateCreateTask'
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </div>
                <div className='inputData'>
                    <label htmlFor="deadline">Дедлайн</label>
                    <input
                        name="deadline"
                        type="date"
                        id='deadline'
                        className='dateCreateTask'
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </div>
                <div className='btnRedialDiv'>
                    <button type="submit">Сохранить</button>
                    <Link to='/task'>Отмена</Link>
                </div>
            </form>
        </div>
    );
}
