import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../../utils/api';
import { Select } from 'antd';

const { Option } = Select;

export default function WriteLetter() {
    const [formData, setFormData] = useState({
        recipient: '',
        subject: '',
        description: '',
        file: null,
        emailCredentialId: null
    });

    let arrObjactInteractionId = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
    ];

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
        if (!formData.recipient || !formData.subject || !formData.description) {
            toast.info('Заполните все обязательные поля', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                // Bounce is not a valid transition in react-toastify
                // You might need to remove this or use the correct one
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
            }
        }
    }

    return (
        <div className='WriteLetter'>
            <div className="headerWL">
                <h1>Отправить новое письмо</h1>
            </div>
            <form className='formDataWL' onSubmit={funSendLetter}>
                <input
                    placeholder='Кому (через запятую для нескольких адресов)'
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                />
                <input
                    placeholder='Тема'
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                />
                <textarea
                    placeholder='Описание'
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
                <Select
                    showSearch
                    style={{ width: 220 }}
                    placeholder="emailCredentialId"
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                        (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
                    }
                    onChange={(value) => setFormData(prevData => ({
                        ...prevData,
                        emailCredentialId: value
                    }))}
                >
                    {arrObjactInteractionId.map(item => (
                        <Option key={item.value} value={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
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
