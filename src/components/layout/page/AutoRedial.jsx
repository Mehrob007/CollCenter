import { Link } from 'react-router-dom'
// import { getToken } from '../../store/StoreGetToken';

export default function AutoRedial() {
    // const { refreshAccessToken } = getToken(state => ({
    //     refreshAccessToken: state.refreshAccessToken
    // }))

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
                    <label htmlFor="file-input" className="custom-file-label">Прикрепить файл</label>
                </div>
                <div>
                    <input type="file" id="file-input" className="file-input" />
                    <label htmlFor="file-input" className="custom-file-label">Записать</label>
                </div>
            </div>
            <div className='btnRedialDiv'>
               <button type="submit">Отправить</button>
               <Link to='/'>Отмена</Link>
            </div>
        </form>
    )
}
