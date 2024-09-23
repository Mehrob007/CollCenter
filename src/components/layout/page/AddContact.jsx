import { useEffect, useState } from 'react';
import { Button, Input, Form, Select, Spin } from 'antd';
import { Bounce, toast } from 'react-toastify';
import apiClient from '../../../utils/api';
import { getToken } from '../../store/StoreGetToken';
import { Link, useNavigate } from 'react-router-dom';
import { Option } from 'antd/es/mentions';
import { useAuthStoreOperator, useStateModal } from '../../store/useAuthStore';

export default function AddContact({ call, number }) {
    const [formDataContact, setFormDataContact] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: number || '',
        email: '',
        description: '',
        fields: [],
    });
    const { setChengeState } = useStateModal(state => ({
        setChengeState: state.setChengeState
      }))
    const [formDataProblem, setFormDataProblem] = useState({
        description: '',
        fields: [{ name: 'Проблема', value: '', id: 1 }],
        company: ''
    })
    const { dataOperator } = useAuthStoreOperator()

    const [dataSearch, setDataSearch] = useState([]);
    const [fetchingSearch, setFetchingSearch] = useState(false);

    const navigate = useNavigate()
    const [resUserFinde, setResUserFinde] = useState('')

    const { refreshAccessToken } = getToken();
    const [contactId, setContactId] = useState('')

    const [dataTimeG, setDataTimeG] = useState('')

    const getUserPhone = async () => {
        setResUserFinde('')
        let token = localStorage.getItem('accessToken')

        const res = await apiClient.get(`api/contacts/all?phone=${number}&pagination.limit=1&pagination.page=1`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        res.data?.contacts && setResUserFinde(res.data?.contacts)
        res.data?.contacts[0]?.id && setContactId(res.data?.contacts[0].id)
        res.data?.contacts[0] && setFormDataContact(res.data?.contacts[0])
        // console.log(res.data.contacts[0].id);
        res.data?.contacts[0] && setFormData({
            firstName: res.data.contacts[0].name || '',
            lastName: res.data.contacts[0].surname || '',
            middleName: res.data.contacts[0].middleName || '',
            phone: number || '',
            email: res.data.contacts[0].email || '',
            description: res.data.contacts[0].description || '',
            fields: res.data.contacts[0].fields || [],
        })
        // setFormDataProblemContactID({
        //     firstName: res.data.contacts[0].name || '',
        //     lastName: res.data.contacts[0].surname || '',
        //     middleName: res.data.contacts[0].middleName || '',
        //     phone: number || '',
        //     email: res.data.contacts[0].email || '',
        //     description: res.data.contacts[0].description || '',
        //     fields: res.data.contacts[0].fields || [],
        // })
    }



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const hendleChangeProblem = (e) => {
        const { name, value } = e.target
        setFormDataProblem({
            ...formDataProblem,
            [name]: value,
        })
    }

    useEffect(() => {
        if (call) {
            getUserPhone()
        }
    }, [call])



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
    const handleChangeFieldsProblems = (e, id) => {
        const { name, value } = e.target;
        const newFields = formDataProblem.fields.map((field) => {
            if (field.id === id) {
                return { ...field, [name]: value };
            }
            return field;
        });
        setFormDataProblem((prevState) => ({
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
    }

    const removeFields = (id) => {
        setFormData((prevState) => ({
            ...prevState,
            fields: prevState.fields.filter(el => el.id !== id),
        }));
    }


    const addFieldsProblems = () => {
        const newFieldId = formDataProblem.fields.length + 1;
        setFormDataProblem((prevState) => ({
            ...prevState,
            fields: [...prevState.fields, { name: 'Проблема', value: '', id: newFieldId }],
        }));
    };

    const removeFieldsProblems = (id) => {
        setFormDataProblem((prevState) => ({
            ...prevState,
            fields: prevState.fields.filter(el => el.id !== id),
        }));
    }

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
        return;
    }

    // const addContact = async () => {

    // };
    const fetchOptions = async (searchValue) => {
        setFetchingSearch(true);
        const token = localStorage.getItem('accessToken');
        try {
            const response = await apiClient.get(`api/companies/all/?name=${searchValue}&pagination.limit=15&pagination.page=1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setDataSearch(response.data.companies)

            // setFormDataProblem({ ...formDataProblem, company: response.data[0] });  // Предположим, что данные приходят в виде массива объектов
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

    // const updateContact = async () => {

    // };
    useEffect(() => {
        if (call) {
            const dateTime = new Date().toISOString();
            console.log(dateTime);
            setDataTimeG(dateTime)
        }
    }, [call])



    const sendProblem = async () => {
        
        let token = localStorage.getItem('accessToken');
        if (!formData.firstName || !formData.lastName || !formData.phone || !formDataProblem.company || !formDataProblem.description || !formDataProblem.fields[0]) {
            validataError('Заполните необходимые поля')
            return;
        }
        if (contactId.length <= 0) {
            validataError('Этот элемент не существует.')
            return;
        }  
        if (!resUserFinde.length) {
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
        } if (resUserFinde.length) {
            // let token = localStorage.getItem('accessToken');

            // Валидация обязательных полей
          

            try {
                const res = await apiClient.put(`api/contacts/?id=${contactId}&name=${formData.firstName}&surname=${formData.lastName}&phone=${formData.phone}&middleName=${formData.middleName}${formData.email && `&email=${formData.email}`}${formData.description && `&description=${formData.description}`}&fields=${JSON.stringify(formData.fields)}`, {
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
        }
        // let token = localStorage.getItem('accessToken');
        try {
            const res = await apiClient.post(`api/interactions/call?description=${formDataProblem.description}&fields=${JSON.stringify(formDataProblem.fields)}&companyId=${formDataProblem.company}&contactId=${contactId}&userId=${dataOperator.id}&interactionDate=${dataTimeG}&type=${1}`, {
                name: formDataProblem.firstName,
                surname: formDataProblem.lastName,
                middleName: formDataProblem.middleName,
                phone: formDataProblem.phone,
                email: formDataProblem.email,
                description: formDataProblem.description,
                fields: formDataProblem.fields,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log(res);
            setChengeState(false)
            toast.success('Контакт успешно добавлен!');
                // Очистка формы после успешного добавления
                setFormData({
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    phone: '',
                    email: '',
                    description: '',
                    fields: [],
                });
                formDataProblem({
                    company: '',
                    description: '',
                    fields: [],
                })
                
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

    }

    // console.log(formDataProblem);


    return (<>
        <div>

            <>
                <h2>{!resUserFinde.length > 0 ? 'Добавить' : 'Изминить'} контакт</h2>
                <Form style={{ width: '610px', padding: call ? 0 : '0 600px 0 0px' }} className='formCallContacts' layout="vertical">
                    <>
                        <div className='CollRaz' style={{ width: !call && '700px' }}>
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

                    <Form.Item label="Описание" style={{ width: !call && '500px' }}>
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

                    </div>
                    <div>
                        <nav className='addFields' onClick={addFields}>+</nav>
                        {/* <Button type="primary" style={{ height: '40px', margin: '20px 0' }} onClick={() => {
                            if (!resUserFinde.length) {
                                addContact()
                            } if (resUserFinde.length) {
                                updateContact()
                            }
                        }}>
                            {!resUserFinde.length > 0 ? 'Добавить' : 'Изминить'} контакт
                        </Button> */}
                    </div>
                </Form>
                <div>

                </div><br />
                {call && <>
                    <form className='AddingProblem' style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1>Описание проблемы</h1>
                        <div>
                            <label htmlFor="">Компания</label>
                            {dataSearch &&
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Компания"
                                    notFoundContent={fetchingSearch ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={handleSearch}
                                    style={{ width: '100%', height: '40px' }}
                                    onChange={(value) => {
                                        setFormDataProblem((prev) => ({
                                            ...prev,
                                            company: value
                                        }));
                                    }}
                                >
                                    {dataSearch.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            }
                        </div>
                        <div>
                            <label htmlFor="">Описание</label>
                            <Input.TextArea name="description" value={formDataProblem.description} onChange={hendleChangeProblem} />
                        </div>

                        <div>
                            {/* <label></label> */}
                            {formDataProblem.fields.map((el) => (
                                <div key={el.id} className='fields'>
                                    <div>
                                        <label>Имя</label>
                                        <Input value={el.name} name='name' type="text" />
                                    </div>
                                    <div>
                                        <label>Значение</label>
                                        <Input value={el.value} name='value' onChange={(event) => handleChangeFieldsProblems(event, el.id)} type="text" />
                                    </div>
                                    {formDataProblem.fields[0].id != el.id && <nav className='removeFields' onClick={() => removeFieldsProblems(el.id)}>-</nav>}
                                </div>
                            ))}

                        </div>
                        <div className='Fbottom'>
                            <nav className='addFields' onClick={addFieldsProblems}>+</nav>
                        </div>
                    </form>
                    <Button type="primary" style={{ height: '40px', }} onClick={async () => {
                        sendProblem()
                    }}>
                        Отправить
                    </Button>

                </>}
                {!call && <>
                    <Link style={{ textDecoration: 'none', background: '#0478FF', borderRadius: '10px', color: 'white', padding: '5px 30px', margin: '20px 0' }} to="/contacts">назад</Link>
                </>}
            </>

        </div>
    </>)
}