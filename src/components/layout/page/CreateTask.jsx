import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { Select, Space, Spin } from 'antd';
import apiClient from '../../../utils/api';
import { getToken } from '../../store/StoreGetToken';
import { Option } from 'antd/es/mentions';

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
    const { refreshAccessToken } = getToken();
    const { interactionIdContacts } = useParams()

    const [dataSearch, setDataSearch] = useState([]);
    const [fetchingSearch, setFetchingSearch] = useState(false);

    const [dataSearchUsers, setDataSearchUsers] = useState([]);
    const [fetchingSearchUsers, setFetchingSearchUsers] = useState(false);
    const navigate = useNavigate()

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
    const ApplicationTaskStatus = [
        { label: 'Отложено', value: 0 },
        { label: 'Ожидает ввода', value: 1 },
        { label: 'Завершено', value: 2 },
        { label: 'В процессе', value: 3 },
        { label: 'Не начато', value: 4 },
    ];



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

    const fetchOptionsUsers = async (searchValue) => {
        setFetchingSearchUsers(true);
        const token = localStorage.getItem('accessToken');
        try {
            const response = await apiClient.get(`/api/search/all?${searchValue}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataSearchUsers(response.data);  // Предположим, что данные приходят в виде массива объектов
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            if (error.response.status === 401) {
                let accessToken = await refreshAccessToken()
                let booleanRes = Boolean(accessToken)
                if (booleanRes) {
                    navigate(0)
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
            setFetchingSearchUsers(false);
        }
    };

    const handleSearchUsers = (value) => {
        if (value) {
            fetchOptionsUsers(value);
        } else {
            setDataSearchUsers([]);
        }
    };





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

    const fetchOptions = async (searchValue) => {
        setFetchingSearch(true);
        const token = localStorage.getItem('accessToken');
        try {
            const response = await apiClient.get(`api/search/call/all/?${interactionIdContacts || searchValue}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataSearch(response.data);  // Предположим, что данные приходят в виде массива объектов
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            if (error.response.status === 401) {
                let accessToken = await refreshAccessToken()
                let booleanRes = Boolean(accessToken)
                if (booleanRes) {
                    navigate(0)
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
            setFetchingSearch(false);
        }
    };

    const handleSearch = (value) => {
        if (value) {
            fetchOptions(value);
        } else {
            setDataSearch([]);
        }
    };
    // const defData = uniqueOptions.find(el => el.value == interactionId);

    // console.log(defData);

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
                    {dataSearch &&
                        <Select
                            showSearch
                            allowClear
                            placeholder="Взаимодействие"
                            notFoundContent={fetchingSearch ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={handleSearch}
                            style={{ width: '100%', height: '40px' }}
                            onChange={(value) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    interactionId: value
                                }));
                            }}
                        >
                            {dataSearch.map((item) => (
                                <Option key={item.id} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    }
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
                    {/* <Space onScroll={scrollHandler} style={{ width: '100%' }} direction="vertical">
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
                    </Space> */}
                    {dataSearchUsers &&
                        <Select
                            showSearch
                            allowClear
                            placeholder="Исполнитель"
                            notFoundContent={fetchingSearchUsers ? <Spin size="small" /> : null}
                            filterOption={false}
                            style={{ width: '100%', height: '40px' }}
                            onSearch={handleSearchUsers}
                            onChange={(value) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    idUsers: value
                                }));
                            }}
                        >
                            {dataSearchUsers.map((item) => (
                                <Option key={item.id} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>}
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
