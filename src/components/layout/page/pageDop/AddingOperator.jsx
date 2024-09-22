import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../../store/StoreGetToken";
import apiClient from "../../../../utils/api";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";


export default function AddingOperator() {
    const { refreshAccessToken } = getToken(state => ({
        refreshAccessToken: state.refreshAccessToken
    }))
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        password: '',
        name: '',
        surname: '',
        extensionNumber: '',
        username: ''
    });
    const navigate = useNavigate()
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
    async function fetchData(e) {
        e.preventDefault();
        if(formData.username != '' &&
            formData.password != '' &&
            formData.name != '' &&
            formData.surname != '' &&
            formData.extensionNumber != '' ){
            setLoading(true)
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const response = await apiClient.post(`/api/users/?username=${formData.username}&password=${formData.password}&name=${formData.name}&surname=${formData.surname}&extensionNumber=${formData.extensionNumber}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response.data);
    
                } else {
                    validataError('ключ отсутствует ошибка: 403')
                }
            } catch (error) {
                validataError('Ошибка при выполнении запроса!')
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
            }finally{
                setLoading(false)
            }
        }else{
            validataError('Заполните необходимые поля!')
        }
        
       
    }
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    return (
        <div className='WriteLetter'>
            <div className="headerWL" style={{ display: 'flex', gap: '20px' }}>
                Добавление оператора
                <Link to={`/menejment`} style={{ padding: '2px 14px', background: '#e0e0e0', textDecoration: 'none', color: '#000', borderRadius: '10px', fontWeight: '400', fontSize: '18px'}}>назад</Link>
            </div>
            <form onSubmit={fetchData} className="formDataWL">
                <div>
                    <label>Имя</label>
                    <input type="text" name="name" onChange={handleChange} />
                </div>
                <div>
                    <label>Фамилия</label>
                    <input type="text" name="surname" onChange={handleChange} />
                </div>
                <div>
                    <label>Имя пользователя</label>
                    <input type="text" name="username" onChange={handleChange} />
                </div>
                <div>
                    <label>Пароль</label>
                    <input type="text" name="password" onChange={handleChange} />
                </div>
                <div>
                    <label>Расширеный номер </label>
                    <input type="text" name="extensionNumber" onChange={handleChange} />
                </div>
                <button style={{ cursor: 'pointer' }} type="submit">{!loading ? 'Добавить оператора' : 'Загруска...'}</button>
                
            </form>
        </div>
    )
}
