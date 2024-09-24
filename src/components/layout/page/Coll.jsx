import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JsSIP from 'jssip';
import iconCollBtn from '../../../assets/icon/iconCollBtn.svg';
import callout from '../../../assets/icon/callout.svg'
import { Bounce, Flip, toast } from 'react-toastify';
import { Button, Modal } from 'antd';
import { getToken } from '../../store/StoreGetToken';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../../../utils/api';
import AddContact from './AddContact';
import { SlCallOut } from 'react-icons/sl';
import { useStateModal } from '../../store/useAuthStore';
import Audeo from '../../../../public/rington/ringtone.mp3';
// import apiClient from '../../../utils/api';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { FaPersonWalkingDashedLineArrowRight } from 'react-icons/fa6';

export default function Coll() {
  const { numbers } = useParams()
  const [valueInput, setValueInput] = useState('');
  const [valueInput2, setValueInput2] = useState('null');
  const { refreshAccessToken } = getToken()
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  useEffect(() => {
    refreshAccessToken()
    const performAction = () => {
      console.log("Функция выполнена");
      refreshAccessToken()
    };
    const intervalId = setInterval(performAction, 14 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const allowedChars = /[^0-9#*]/g;

  const [calling, setCalling] = useState(false)
  const [gsessions, setGsessions] = useState()
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [ua, setUA] = useState(null);

  // const [namberIncoming, setNamberIncoming] = useState(gsessions?.remote_identity.display_name);
  // const [loading, setLoading] = useState();
  // const [data, setData] = useState();
  // const [loading2, setLoading2] = useState();
  // const [data2ExtensionSecret, setData2] = useState();
  // const [addContactCall, setAddContactCall] = useState(false)

  const [stateConfig, setStateConfig] = useState({})
  const { modalState, setChengeState } = useStateModal(state => ({
    modalState: state.modalState,
    setChengeState: state.setChengeState
  }))  

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
  const ringtoneRef = useRef(null);

  useEffect(() => {
    // Initialize the ringtone
    ringtoneRef.current = new Audio(Audeo);
    ringtoneRef.current.loop = true;

    // Cleanup when the component is unmounted
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.src = ''; // Stop and release the audio resource
      }
    };
  }, []);


  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

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
  const handleCall = (valueInput) => {
    if (valueInput.length > 9 && valueInput.length < 3) {
      toast.error('Номер введен неправильно!', {
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
      return; // Остановка выполнения функции, если валидация не пройдена
    }
    if (modalState) {
      toast.error('Закройте окно изменеия!', {
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
      return; // Остановка выполнения функции, если валидация не пройдена
    }
    if (valueInput.length > 0) {
      setChengeState(true)
      // setAddContactCall(true)
      setValueInput2(valueInput)
      setValueInput('')
      setCalling(true)
      if (valueInput) {
        const eventHandlers = {
          progress: () => {
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
          confirmed: () => {
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
    ringtoneRef.current.pause();
    gsessions.answer(stateConfig);
    setOpen(false);
    setChengeState(true)
  }
  const perenCall = () => {
    gsessions.refer('sip:' + valueInput2 + '@10.158.193.4');
    console.log(valueInput2);
  }


  const decline = () => {
    ringtoneRef.current.pause();
    gsessions.terminate();
    setOpen(false);
  }




  async function fetchData() {
    let accountData = null;
    let extensionSecret = null;

    try {
      const token = localStorage.getItem('accessToken')
      const decodedHeader = jwtDecode(token)
      const id = decodedHeader["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      // setLoading(true)
      if (token) {
        const response = await apiClient.get(`/api/users?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        accountData = response.data.extensionNumber;
        console.log(response.data.extensionNumber);
      } else {
        console.error('Access token is missing')
      }
    } catch (error) {
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          navigate(0)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);

      }
    }

    try {
      const token = localStorage.getItem('accessToken')
      // setLoading2(true)
      if (token) {
        const response = await apiClient.get(`/api/users/get-extension-secret`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        extensionSecret = response.data.extensionSecret;
        console.log(response.data);
      } else {
        console.error('Access token is missing')
      }
    } catch (error) {
      if (error.response.status === 401) {
        let accessToken = await refreshAccessToken()
        let booleanRes = Boolean(accessToken)
        if (booleanRes) {
          navigate(0)
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
    }
    JsSIP.debug.enable('JsSIP:*');
    const socket = new JsSIP.WebSocketInterface('wss://10.158.193.4:8089/ws');
    const configuration = {
      sockets: [socket],
      uri: `${accountData}@10.158.193.4`,
      password:  extensionSecret
    };
    setStateConfig(setStateConfig)
    const ua = new JsSIP.UA(configuration);

    // ua.on("newRTCSession", function (data) {
    //   var session = data.session;
    //   setGsessions(session);

    //   if (session.direction === "incoming") {
    //     setOpen(true);
    //     setValueInput2(session.remoteIdentity.uri.user)
    //     session.on("accepted", function (e) {
    //       console.log('Call accepted:', e);
    //       audioRef.current.srcObject = e.stream;
    //       audioRef.current.play();
    //     });

    //     session.on("confirmed", function () {
    //       console.log('Call confirmed');
    //       audioRef.current.play();
    //     });

    //     session.on("ended", function () {
    //       console.log('Call ended');
    //       audioRef.current.srcObject = null; // Очистка источника аудио
    //       setOpen(false); // Закрытие интерфейса
    //     });

    //     session.on("failed", function () {
    //       console.error('Call failed');
    //       setOpen(false); // Закрытие интерфейса при неудаче
    //     });

    //     session.on("peerconnection", () => {
    //       session.connection.addEventListener("track", (e) => {
    //         console.log('Adding audio track');
    //         audioRef.current.srcObject = e.streams[0];
    //         audioRef.current.play();
    //       });
    //     });
    //   }
    // });


    ua.on("newRTCSession", function (data) {
      var session = data.session;
      setGsessions(session);

      if (session.direction === "incoming") {
        ringtoneRef.current.play().catch(err => {
          console.error('Error playing ringtone:', err);
        });
        setOpen(true);
        session.on("accepted", function (e) {
          console.log('Call accepted:', e);
          ringtoneRef.current.pause();
          audioRef.current.srcObject = e.stream;
          audioRef.current.play();
        });

        session.on("confirmed", function () {
          console.log('Call confirmed');
          audioRef.current.play();
        });

        session.on("ended", function () {
          console.log('Call ended');
          audioRef.current.srcObject = null; // Очистка источника аудио
          setOpen(false); // Закрытие интерфейса
        });

        session.on("failed", function () {
          console.error('Call failed');
          setOpen(false); // Закрытие интерфейса при неудаче
        });

        session.on("peerconnection", () => {
          session.connection.addEventListener("track", (e) => {
            console.log('Adding audio track');
            audioRef.current.srcObject = e.streams[0];
            audioRef.current.play();
          });
        });
      }
    });


    setUA(ua);

    ua.start();
  }

  const getData = async () => {
    await fetchData()


  }
  const handleKeyDown = (event) => {
    // Проверяем, нажата ли клавиша Enter
    if (event.key === 'Enter') {
      handleCall(valueInput)

    }
  };

  useEffect(() => { getData() }, [])

  useEffect(() => {
    if (numbers) {
      handleCall(numbers)
    }
  }, [numbers])
  return (
    <div className='CollBox'>
      <Modal
        open={open}
        title={gsessions?.remote_identity.display_name}
        footer={() => 
       { 
        setValueInput2(`${gsessions?.remote_identity.display_name}`)
        return  (
            <>
              <div className='btnCallinBack'>
                <Button onClick={accept} style={{ background: '#0CD939' }} className='callinBack'>
                  <img src={iconCollBtn} alt="iconCollBtn" />
                  <span>Принять</span>
                </Button>
                <Button onClick={decline} style={{ background: '#D90C0C', margin: 0 }} className='callinBack'>
                  <img src={callout} alt="iconCollBtn" />
                  <span>Отклонить</span>
                </Button>
              </div>
              {/* <CancelBtn />
                          <OkBtn /> */}
            </>
          )
        }
      }
      >
        <p>Вызов...</p>
      </Modal>

      <div className='bgMain-components-1'></div>
      {modalState ? <div>
        <AddContact call={true} number={valueInput2} />
      </div> :
        <div className='auto-call'>
          {/* <Link to='auto-redial' className="divAutoColl">
           <button className='btnAutoColl'>Автодозвон</button>
         </Link> */}
        </div>
      }

      {/* {addContacts} */}
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
          onKeyDown={handleKeyDown}
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
            <button onClick={() => handleCall(valueInput)} className="numberColl">
              <img src={iconCollBtn} alt="iconCollBtn" />
            </button> :
            <button className="numberColl" style={{ background: '#D90C0C' }} onClick={hangUp}>
              <img src={callout} alt="callout" />
            </button>
          }
          <button onClick={() => perenCall()}>
            <SlCallOut style={{ color: '#000', fontSize: '30px', fontWeight: '600' }} />
          </button>
        </div>
      </div>
      <audio ref={audioRef} id="audio-element"></audio>
    </div>
  );
}

