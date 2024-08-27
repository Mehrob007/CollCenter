import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

export default function WriteLetter() {
    const [formData, setFormData] = useState({
        recipient: '',
        subject: '',
        description: '',
        file: null
    });

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
                transition: Bounce,
            });
            return false;
        }
        return true;
    }

    function funSendLetter(e) {
        e.preventDefault();
        if (validateForm()) {
            const recipientsArray = formData.recipient.split(',').map(recipient => recipient.trim());
            const dataToSend = {
                ...formData,
                recipient: recipientsArray
            };

            // Логика отправки письма здесь
            console.log(dataToSend);
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
    )
}
