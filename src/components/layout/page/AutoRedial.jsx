import React from 'react'
import { Link } from 'react-router-dom'

export default function AutoRedial() {
    return (
        <form className='AutoRedial'>
            <div className='AutoRedialDiv'>
                <select name="" id="">
                    <option value="*">Район</option>
                </select>
                <select name="" id="">
                    <option value="*">Школа</option>
                </select>
                <select name="" id="">
                    <option value="*">Роль</option>
                </select>
            </div>
            <div className='FileRedialDiv'>
                <div>
                    <input type="file" id="file-input" className="file-input" />
                    <label for="file-input" className="custom-file-label">Прикрепить файл</label>
                </div>
                <div>
                    <input type="file" id="file-input" className="file-input" />
                    <label for="file-input" className="custom-file-label">Записать</label>
                </div>
            </div>
            <div className='btnRedialDiv'>
               <button type="submit">Отправить</button>
               <Link to='/'>Отмена</Link>
            </div>
        </form>
    )
}
