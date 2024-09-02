import { useEffect, useState } from 'react';
import { Button, Input, Form } from 'antd';
import { Bounce, toast } from 'react-toastify';
import apiClient from '../../../utils/api';
import { getToken } from '../../store/StoreGetToken';
import { Link, useNavigate } from 'react-router-dom';

export default function AddContact({ call, number }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: number || '',
        email: '',
        description: '',
        fields: [],
    });
    const navigate = useNavigate()
    const [resUserFinde, setResUserFinde] = useState('')

    const { refreshAccessToken } = getToken();
    const [contactId, setContactId] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (call) {
            getUserPhone()
        }
    }, [call])

    const getUserPhone = async () => {
        setResUserFinde('')
        let token = localStorage.getItem('accessToken')

        const res = await apiClient.get(`api/contacts/all?phone=${number}&pagination.limit=1&pagination.page=1`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setResUserFinde(res.data.contacts)
        setContactId(res.data.contacts[0].id)
        console.log(res.data.contacts[0].id);
        
    }

    const handleChangeFields = (e, id) => {
        const { name, value } = e.target;
        const newFields = formData.fields.map((field) => {
            if (field.id === id) {
                return { ...field, [name]: value };
            }
            return field;
        });
        setFormData((prevState) => ({
            ...prevState,
            fields: newFields,
        }));
    };

    const addFields = () => {
        const newFieldId = formData.fields.length + 1;
        setFormData((prevState) => ({
            ...prevState,
            fields: [...prevState.fields, { name: '', value: '', id: newFieldId }],
        }));
    };

    const addContact = async () => {
        let token = localStorage.getItem('accessToken');

        // Валидация обязательных полей
        if (!formData.firstName || !formData.lastName || !formData.phone) {
            toast.error('Заполните необходимые поля', {
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
            return;
        }

        try {
            const res = await apiClient.post(`api/contacts/?name=${formData.firstName}&surname=${formData.lastName}&phone=${formData.phone}&middleName=${formData.middleName}&email=${formData.email}&description=${formData.description}&fields=${JSON.stringify(formData.fields)}`, {
                name: formData.firstName,
                surname: formData.lastName,
                middleName: formData.middleName,
                phone: formData.phone,
                email: formData.email,
                description: formData.description,
                fields: formData.fields,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(res);
            toast.success('Контакт успешно добавлен!');
            // Очистка формы после успешного добавления
            ({
                firstName: '',
                lastName: '',
                middleName: '',
                phone: '',
                email: '',
                description: '',
                fields: [{ name: '', value: '', id: 1 }],
            });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                let accessToken = await refreshAccessToken();
                let booleanRes = Boolean(accessToken);
                if (booleanRes) {
                    navigate(0);
                } else {
                    console.log('Не удалось выполнить действие: отсутствуют необходимые данные.');
                }
            }
        }
    };
    const updateContact = async () => {
        let token = localStorage.getItem('accessToken');

        // Валидация обязательных полей
        if (!formData.firstName || !formData.lastName || !formData.phone) {
            toast.error('Заполните необходимые поля', {
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
            return;
        }

        try {
            const res = await apiClient.put(`api/contacts/?id=${contactId}&name=${formData.firstName}&surname=${formData.lastName}&phone=${formData.phone}&middleName=${formData.middleName}${ formData.email && `&email=${formData.email}` }${ formData.description && `&description=${formData.description}`}&fields=${JSON.stringify(formData.fields)}`, {
                name: formData.firstName,
                surname: formData.lastName,
                middleName: formData.middleName,
                phone: formData.phone,
                email: formData.email,
                description: formData.description,
                fields: formData.fields,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(res);
            toast.success('Контакт успешно обновлен!');
            // Очистка формы после успешного обновления
            setFormData({
                firstName: '',
                lastName: '',
                middleName: '',
                phone: '',
                email: '',
                description: '',
                fields: [{ name: '', value: '', id: 1 }],
            });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                let accessToken = await refreshAccessToken();
                let booleanRes = Boolean(accessToken);
                if (booleanRes) {
                    navigate(0);
                } else {
                    console.log('Не удалось выполнить действие: отсутствуют необходимые данные.');
                }
            }
        }
    };

    const removeFields = (id) => {
        setFormData((prevState) => ({
            ...prevState,
            fields: prevState.fields.filter(el => el.id !== id),
        }));
    }

    return (<>
        <div style={{ display: 'felx', flexDirection: 'column', alignItems: 'center', justifyContent: 'cenetr' }}>
            <h2>{!resUserFinde.length > 0 ? 'Добавить' : 'Изминить'} контакт</h2>

            <Form style={{ width: call ? '410px' : '410', padding: call ? 0 : '0 600px 0 0px' }} layout="vertical">
                <>
                    <div className='CollRaz'>
                        <Form.Item label="Имя">
                            <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Фамилия">
                            <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Отчество">
                            <Input name="middleName" value={formData.middleName} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Телефон">
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input name="email" value={formData.email} onChange={handleChange} />
                        </Form.Item>
                    </div>
                </>

                <Form.Item label="Описание">
                    <Input.TextArea name="description" value={formData.description} onChange={handleChange} />
                </Form.Item>
                <div>
                <label></label>
                    {formData.fields.map((el) => (
                        <div key={el.id} className='fields'>
                            <div>
                                <label>Имя</label>
                                <Input value={el.name} name='name' onChange={(event) => handleChangeFields(event, el.id)} type="text" />
                            </div>
                            <div>
                                <label>Значение</label>
                                <Input value={el.value} name='value' onChange={(event) => handleChangeFields(event, el.id)} type="text" />
                            </div>
                           
                                <nav className='removeFields' onClick={() => removeFields(el.id)}>-</nav>
                            
                        </div>
                    ))}
                        <nav className='addFields' onClick={addFields}>+</nav>
                    
                </div>

            </Form>
            <Button styles={{ margin: '0 auto' }} type="primary" style={{ height: '40px', margin: '20px auto' }} onClick={() => {
                if (!resUserFinde.length) {
                    addContact()
                } if (resUserFinde.length) {
                    updateContact()
                }
            }}>
                {!resUserFinde.length > 0 ? 'Добавить' : 'Изминить'} контакт
            </Button><br />
            {!call && <Link style={{ textDecoration: 'none', background: '#0478FF', borderRadius: '10px', color: 'white', padding: '5px 30px', margin: '20px 0' }} to="/contacts">назад</Link>}

        </div>
    </>);
}