import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { Select, Space } from 'antd';
import apiClient from '../../../utils/api';
import { getToken } from '../../store/StoreGetToken';

export default function CreateTask() {
    const [formData, setFormData] = useState({
        to: '',
        description: '',
        startDate: '',
        deadline: '',
        idUsers: [],
        idPreoritet: '',
        idStatus: '',
        interactionId: '',

    });
    const [options, setOptions] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [data2, setData2] = useState([]);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [fetching2, setFetching2] = useState(false);
    const { refreshAccessToken } = getToken();
    const { interactionId } = useParams()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    console.log(formData);

    const validateForm = () => {
        const { to, description, startDate, deadline } = formData;
        const today = new Date().toISOString().split('T')[0];

        console.log('Form Data:', formData);
        console.log('Today:', today);

        if (!to || !description || !startDate || !deadline) {
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
    };


    const ApplicationTaskPriority = [
        { label: 'Низкий', value: 0 },
        { label: 'Средний', value: 1 },
        { label: 'Высокий', value: 2 }
    ];
    const [arrObjactInteractionId, setArrObjactInteractionId] = useState([]);

    const ApplicationTaskStatus = [
        { label: 'Отложено', value: 0 },
        { label: 'Ожидает ввода', value: 1 },
        { label: 'Завершено', value: 2 },
        { label: 'В процессе', value: 3 },
        { label: 'Не начато', value: 4 },
    ];

    console.log(options);


    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            setLoading(true);
            if (token) {
                const response = await apiClient.get(`/api/users/all?pagination.limit=25&pagination.page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const newArr = response.data.users.map((el) => ({ label: el.name, value: el.id }));
                console.log(response.data);

                setOptions(newArr);
                if (Array.isArray(response.data.users)) {
                    setData((prev) => [...prev, ...response.data.users]);
                } else {
                    console.error('Ожидался массив, но получен другой тип данных:', response.data.users);
                }
                setCurrentPage((prev) => prev + 1);
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
            setLoading(false);
            setFetching(false);
        }
    };
    const scrollHandler = (e) => {
        const target = e.target;
        if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 1 && data.length && !fetching) {
            setFetching(true);
        }
    };
    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        if (fetching) {
            fetchData();
        }
    }, [fetching])

    const funSendLetter = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const token = localStorage.getItem('accessToken');
        try {
            const res = await apiClient.post(`api/tasks/?subject=${formData.to}&startDate=${formData.startDate}T00:00:00Z&dueDate=${formData.deadline}T00:00:00Z&priority=${formData.idPreoritet}&description=${formData.description}&status=${formData.idStatus}${formData.idUsers.map(el => `&usersId=${el}`).join('')}&interactionId=${formData.interactionId}`,
                null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res);
            toast.success('Задача успешно создана', {
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
        } catch (err) {
            console.error('Ошибка при отправке задачи:', err);
            toast.error('Ошибка при отправке задачи', {
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
        }
    };
    const getDataSelectLine = async () => {
        const token = localStorage.getItem('accessToken');
        // console.log(token);

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


            // const faceData = [
            //     {
            //       "id": 0,
            //       "description": "string",
            //       "fields": [
            //         {
            //           "id": 0,
            //           "name": "string",
            //           "value": "string"
            //         }
            //       ],
            //       "company": {
            //         "id": 0,
            //         "name": "string",
            //         "sipNumber": "string"
            //       },
            //       "contact": {
            //         "id": 0,
            //         "name": "string",
            //         "surname": "string",
            //         "phone": "string",
            //         "middleName": "string",
            //         "email": "string",
            //         "description": "string",
            //         "fields": [
            //           {
            //             "id": 0,
            //             "name": "string",
            //             "value": "string"
            //           }
            //         ],
            //         "creator": {
            //           "id": 0,
            //           "username": "string",
            //           "role": "Operator",
            //           "name": "string",
            //           "surname": "string",
            //           "extensionNumber": 0,
            //           "createdAt": "string"
            //         },
            //         "createdAt": "string"
            //       },
            //       "user": {
            //         "id": 0,
            //         "username": "string",
            //         "role": "Operator",
            //         "name": "string",
            //         "surname": "string",
            //         "extensionNumber": 0,
            //         "createdAt": "string"
            //       },
            //       "interactionDate": "string"
            //     }
            //   ]
            // Создаём новый массив объектов, добавляя новые элементы
            const newArr = response.data.interactions.map(el => ({
                value: el.id,
                label: `${el.contact.surname} ${el.contact.name[0]}.   Дата: ${el.interactionDate.split('T')[0]} `
            }));

            // Объединяем существующий массив с новым и обновляем состояние
            setArrObjactInteractionId(prev => [...prev, ...newArr]);


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
                setFetching2(true)
            }
        }
    };

    const uniqueOptions = arrObjactInteractionId.filter((item, index, self) =>
        index === self.findIndex((t) => t.value === item.value)
    );

    // const getDataSearch = async (value) => {
    //     // const res = await apiClient.post(`api/`)

    //     console.log(value);



    //     setFormData((prev) => ({
    //         ...prev,
    //         interactionId: value
    //     }));

    // }
    useEffect(() => {
        getDataSelectLine()
    }, [])
    useEffect(() => {
        getDataSelectLine()
    }, [fetching2]);
    const defData = uniqueOptions.find(el => el.value == interactionId);

    console.log(defData);

    // Если 

    return (
        <div className='WriteLetter'>
            <ToastContainer />
            <div className="headerWL">
                <h1>Создать задачу</h1>
            </div>
            <form className='formDataWL' onSubmit={funSendLetter}>
                <div>
                    <label>Взаимодействие</label>
                    {uniqueOptions &&
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Взаимодействие"
                            optionFilterProp="label"
                            defaultValue={defData !== undefined && defData}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            onChange={(value) => console.log(value)}
                            options={uniqueOptions}
                            onPopupScroll={scrollHandler2}
                        />}
                </div>
                <div>
                    <label>Название задачи</label>
                    <input
                        name="to"
                        placeholder='Название задачи'
                        type="text"
                        value={formData.to}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Исполнитель</label>
                    <Space onScroll={scrollHandler} style={{ width: '100%' }} direction="vertical">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%', height: '50px' }}
                            placeholder="Исполнитель"
                            onChange={(value) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    idUsers: value
                                }));
                            }}
                            options={!loading && options}
                        />
                    </Space>
                </div>

                <div className='StatusPrioritet'>
                    <div>
                        <label >Приоритет</label>
                        <Select
                            showSearch
                            style={{ width: 220 }}
                            placeholder="Приоритет"
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
                </div>
                <div className='textareaformCreate'>
                    <label>Описание</label>
                    <textarea
                        name="description"
                        placeholder='Описание'
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
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
