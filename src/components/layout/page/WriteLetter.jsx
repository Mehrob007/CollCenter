import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../../utils/api';
import { Select } from 'antd';
import { getToken } from '../../store/StoreGetToken';

const { Option } = Select;

export default function WriteLetter() {
    const { Email } = useParams()
    const { refreshAccessToken } = getToken(state => ({
        refreshAccessToken: state.refreshAccessToken
    }))
    const [formData, setFormData] = useState({
        recipient: '',
        subject: '',
        description: '',
        file: null,
        emailCredentialId: null
    });
    const [lineSelect, setLineSelect] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate()
    const [arrObjactInteractionId, setArrObjactInteractionId] = useState([]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    function handleFileChange(e) {
        setFormData(prevData => ({
            ...prevData,
            file: e.target.files[0]
        }));
    }
    function validateForm() {
        // Regular expression for basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.recipient || !formData.subject || !formData.description) {
            toast.error('Заполните все обязательные поля', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return false;
        }
        if (!emailPattern.test(formData.recipient)) {
            toast.error('Введите действительный email адрес', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return false;
        }

        return true;
    }

    async function funSendLetter(e) {
        e.preventDefault();
        let token = localStorage.getItem('accessToken');
        if (validateForm()) {
            const recipientsArray = formData.recipient.split(',').map(recipient => recipient.trim());

            const dataToSend = {
                ...formData,
                recipient: recipientsArray
            };
            console.log(dataToSend);
            const localDate = new Date();
            const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), localDate.getHours(), localDate.getMinutes(), localDate.getSeconds()));

            const formattedDate = utcDate.toISOString().split('.')[0] + 'Z';
            try {
                const res = await apiClient.post(`api/email/?subject=${formData.subject}&body=${formData.description}${recipientsArray.map(el => `&recipients=${el}`).join('')}&sentDate=${formattedDate}&emailCredentialId=${formData.emailCredentialId}`,
                    null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                console.log(res);
            } catch (error) {
                console.error('Error sending letter:', error);
                if (error.response.status === 401) {
                    let accessToken = refreshAccessToken()
                    let booleanRes = Boolean(accessToken);
                    if (booleanRes) {
                        navigate(0)
                    }
                }
            }
        }
    }

    const getDataSelectLine = async () => {
        const token = localStorage.getItem('accessToken');
        // console.log(token);

        try {
            const response = await apiClient.get(
                `api/email/email-credentials/all?pagination.limit=50&pagination.page=${currentPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLineSelect((prevState) => [...prevState, ...response.data.emailCredentials]);
            setCurrentPage((el) => el + 1);
            console.log(response.data.emailCredentials);
            const arr = lineSelect.map(el => [
                { value: el.id, label: el.name }
            ])
            setArrObjactInteractionId(...arr)
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        } finally {
            setFetching(false);
        }
    }
    const scrollHandler = (e) => {
        const target = e.target;
        if (target && target.scrollHeight && target.scrollTop && target.clientHeight) {
            if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 1) {
                console.log('scroll');
                setFetching(true)
            }
        }
    };

    useEffect(() => {
        getDataSelectLine()
    }, [fetching]);
    return (
        <div className='WriteLetter'>
            <div className="headerWL">
                <h1>Отправить новое письмо</h1>
            </div>
            <form className='formDataWL' onSubmit={funSendLetter}>
                <div>
                    <label >Аккаунт</label> <br />
                    <Select
                        showSearch
                        style={{ width: 220 }}
                        placeholder="Аккаунт"
                        optionFilterProp="children"
                        filterSort={(optionA, optionB) =>
                            (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                        }
                        onChange={(value) =>
                            setFormData((prevData) => ({
                                ...prevData,
                                emailCredentialId: value,
                            }))
                        }
                        onPopupScroll={scrollHandler}
                    >
                        {arrObjactInteractionId && arrObjactInteractionId.map((item, i) => (
                            <Option key={i} value={item.value}>
                                {item.label}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <label >Кому (через запятую для нескольких адресов)</label>
                    <input
                        placeholder='Кому (через запятую для нескольких адресов)'
                        type="text"
                        name="recipient"
                        // defaultValue={Email}
                        value={Email || formData.recipient}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label >Тема</label>
                    <input
                        placeholder='Тема'
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label >Описание</label>
                    <textarea
                        placeholder='Описание'
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div>
                    <input
                        type="file"
                        id="file-input"
                        className="file-input"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input" className="custom-file-label">Прикрепить файл</label>
                </div>
                <div className='btnRedialDiv'>
                    <button type="submit">Отправить</button>
                    <Link to='/message'>Отмена</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
