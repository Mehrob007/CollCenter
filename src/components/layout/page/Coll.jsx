import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import JsSIP from 'jssip';
import iconCollBtn from '../../../assets/icon/iconCollBtn.svg';
import callout from '../../../assets/icon/callout.svg'
import { Bounce, Flip, toast } from 'react-toastify';
import { Button, Modal, Space } from 'antd';
import { getToken } from '../../store/StoreGetToken';
import apiClient from '../../../utils/api';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaPersonWalkingDashedLineArrowRight } from 'react-icons/fa6';

export default function Coll() {
  const [valueInput, setValueInput] = useState('');
  const [valueInput2, setValueInput2] = useState('null');
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  const allowedChars = /[^0-9#*]/g;

  const [calling, setCalling] = useState(false)
  const [gsessions, setGsessions] = useState()
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  // JsSIP.debug.enable('JsSIP:*');
  const socket = new JsSIP.WebSocketInterface('wss://192.168.1.126:8089/ws');
  const configuration = {
    sockets: [socket],
    uri: '99200@192.168.1.126',
    password: '66b2672475521157395738729e350015',
  };
  const ua = new JsSIP.UA(configuration);

  ua.on("newRTCSession", function (data) {
    var session = data.session;
    setGsessions(session);

    if (session.direction === "incoming") {
      // incoming call here
      session.on("accepted", function () {
        // the call has answered
      });
      session.on("confirmed", function () {
        setOpen(true);
      });
      session.on("ended", function () {
        // the call has ended
      });
      session.on("failed", function () {
        // unable to establish the callx
      });
      session.on('addstream', function (e) {
        audioRef.current.srcObject = e.stream
        audioRef.current.play()
      });
    }
  });

  ua.start();

  const handleInputChange = (event) => {
    const cleanedValue = event.target.value.replace(allowedChars, '');
    setValueInput(cleanedValue);
  };

  const funNanbersBtn = (el) => {
    inputRef.current.focus();
    if (!allowedChars.test(el)) {
      setValueInput((prevValue) => prevValue + `${el}`);
    }
  };

  // Function to initiate a call
  const handleCall = () => {
    if (valueInput.length > 0) {
      setValueInput2(valueInput)
      setValueInput('')
      setCalling(true)
      if (valueInput) {
        const eventHandlers = {
          progress: (e) => {
            console.log('Call is in progress');
          },
          failed: (e) => {
            console.log('Call failed with cause:', e.cause);
            setCalling(false);
            reset()
          },
          ended: (e) => {
            console.log('Call ended with cause:', e.cause);
            setCalling(false);
            reset()
            toast.error('Пользователь завершил звонок', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Flip,
            });
          },
          confirmed: (e) => {
            console.log('Call confirmed');
            audioRef.current.play(); // Play the audio when the call is confirmed
            toggle()
          },
        };

        const options = {
          eventHandlers,
          mediaConstraints: { audio: true, video: false },
        };


        const session = ua.call(valueInput, options);
        session.connection.addEventListener('addstream', (event) => {
          console.log("test");
          audioRef.current.srcObject = event.stream
          audioRef.current.play()
        })
        setGsessions(session)

        console.log('Calling:', valueInput);
      } else {
        console.log('Please enter a valid number');
      }
    } else {
      toast.info('Заполните поле вызова', {
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

  const hangUp = () => {
    if (gsessions == null) {
      return;
    } else {
      gsessions.terminate();
      setCalling(false);
      reset()
    }
  }

  const accept = () => {
    gsessions.answer(callOptions);
    setOpen(false);
  }

  const decline = () => {
    gsessions.terminate();
    setOpen(false);
  }
















  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { refreshAccessToken } = getToken()
  const [tokenD, settokenD] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setTokenRefreshTimer()
    }

    window.onload = () => fetchData()
  }, [])

  async function fetchData() {
    try {
      const token = getToken()

      console.error(token)

      const decodedHeader = jwtDecode(token)
      const id = decodedHeader["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      setLoading(true)
      if (token) {
        const response = await apiClient.get(`/api/users?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setData(response.data)
        console.log(response.data);

      } else {
        console.error('Access token is missing')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function setTokenRefreshTimer() {
    clearTimeout(window.tokenRefreshTimer)
    window.tokenRefreshTimer = setTimeout(() => {
      refreshAccessToken()
    }, 60000) // Adjust time as necessary
  }


  axios.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const newToken = await refreshAccessToken()
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        console.log(newToken)
        return axios(originalRequest)
      }
      return Promise.reject(error)
    }
  )



  return (
    <div className='CollBox'>
      <Modal
        open={open}
        title={gsessions?.remote_identity.display_name}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <div className='btnCallinBack'>


              <Button onClick={accept} style={{ background: '#0CD939' }} className='callinBack'>
                <img src={iconCollBtn} alt="iconCollBtn" />
                <span>Принять</span>
              </Button>
              <Button onClick={decline} style={{ background: '#D90C0C' }} className='callinBack'>
                <img src={callout} alt="iconCollBtn" />
                <span>Отклонить</span>
              </Button></div>
            {/* <CancelBtn />
                        <OkBtn /> */}
          </>
        )}
      >
        <p>Вызов...</p>
      </Modal>

      <div className='bgMain-components-1'></div>
      <Link to='auto-redial' className="divAutoColl">
        <button className='btnAutoColl'>Автодозвон</button>
      </Link>
      <div className="collPanel">
        <h1 style={{ opacity: !calling ? 0 : 1 }}>{valueInput2}</h1>
        <p style={{ opacity: !isActive ? 0 : 1 }}>{`${seconds < 600 ? '0' : ''}${Math.floor((seconds % 3600) / 60)}:${seconds < 10 ? '0' : ''}${seconds % 60}`}</p>
        <input
          type="text"
          ref={inputRef}
          className='inputNamber'
          onInput={handleInputChange}
          value={valueInput}
          name='number'
          placeholder="Введите номер"
        />
        <div className='Nambers'>
          <button onClick={() => funNanbersBtn(1)} className="number">1</button>
          <button onClick={() => funNanbersBtn(2)} className="number">2</button>
          <button onClick={() => funNanbersBtn(3)} className="number">3</button>
          <button onClick={() => funNanbersBtn(4)} className="number">4</button>
          <button onClick={() => funNanbersBtn(5)} className="number">5</button>
          <button onClick={() => funNanbersBtn(6)} className="number">6</button>
          <button onClick={() => funNanbersBtn(7)} className="number">7</button>
          <button onClick={() => funNanbersBtn(8)} className="number">8</button>
          <button onClick={() => funNanbersBtn(9)} className="number">9</button>
          <button onClick={() => funNanbersBtn('*')} className="number">*</button>
          <button onClick={() => funNanbersBtn(0)} className="number">0</button>
          <button onClick={() => funNanbersBtn('#')} className="number">#</button>
          <span></span>
          {!calling ?
            <button onClick={handleCall} className="numberColl">
              <img src={iconCollBtn} alt="iconCollBtn" />
            </button> :
            <button className="numberColl" style={{ background: '#D90C0C' }} onClick={hangUp}>
              <img src={callout} alt="callout" />
            </button>
          }


          <button>
            {`=>`}
          </button>
        </div>
      </div>
      <audio ref={audioRef} id="audio-element"></audio>
    </div>
  );
}
