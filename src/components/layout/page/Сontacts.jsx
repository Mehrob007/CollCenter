import { useEffect, useState } from "react";

import { Button, Input, Modal } from "antd";
import iconDelete from "../../../assets/icon/iconDelete.svg";
import miniCall from "../../../assets/icon/miniCall.svg";
import cloasX from "../../../assets/icon/x.svg";
import moreDetails from "../../../assets/icon/moredetails.svg";
import { getToken } from "../../store/StoreGetToken";
import apiClient from "../../../utils/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { Items } from "../../../modules/infinity-scroll/Items";

export default function Contacts() {
  const { poiskNumber } = useParams();
  const [dataModalG, setDataModalG] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    description: "",
    email: "",
    fields: [],
  });
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const { refreshAccessToken } = getToken();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState({ fetch: true, page: 0 });
  const [IDModal, setIDModal] = useState("");

  const [poisk, setPoisk] = useState("");
  const [poiskSurNeme, setPoiskSurNeme] = useState("");
  const [poiskMiaddleName, setPoiskMiaddleName] = useState("");
  const [poiskPhone, setPoiskPhone] = useState(poiskNumber || "");

  const [restart, setRestart] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData.fields);

  const createContacts = async () => {
    let token = localStorage.getItem("accessToken");

    // Проверка на наличие всех обязательных полей
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.middleName
    ) {
      toast.error("Заполните необходимые поля", {
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

    // Дополнительная валидация для email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Введите корректный email", {
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

    // Проверка на наличие хотя бы одного поля в массиве fields
    // if (formData.fields.length === 0 || !formData.fields[0].name || !formData.fields[0].value) {
    //   toast.error('Добавьте хотя бы одно поле', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //     transition: Bounce,
    //   });
    //   return; // Остановка выполнения функции, если валидация не пройдена
    // }

    // Основной код для создания или обновления контакта
    if (IDModal && token) {
      try {
        const res = await apiClient.put(
          `api/contacts/?id=${IDModal}&name=${formData.firstName}&surname=${
            formData.lastName
          }&phone=${formData.phone}&middleName=${formData.middleName}&email=${
            formData.email
          }&description=${formData.description}&fields=${JSON.stringify(
            formData.fields
          )}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setOpenCreate(false);
        navigate(0);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          let accessToken = await refreshAccessToken();
          let booleanRes = Boolean(accessToken);
          if (booleanRes) {
            setRestart(true);
          } else {
            console.log(
              "Не удалось выполнить действие: отсутствуют необходимые данные."
            );
          }
        }
      }
    }
  };

  const getModalDataContact = async (dataModalID) => {
    let token = localStorage.getItem("accessToken");
    try {
      const res = await apiClient.get(`api/contacts/?id=${dataModalID.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      // setDataModal(res.data);
      setIDModal(dataModalID.id);
      // console.log(`modalData: ${dataModalID}`);

      setFormData({
        firstName: res.data.name,
        lastName: res.data.surname,
        middleName: res.data.middleName,
        phone: res.data.phone,
        email: res.data.email || "", // Ensure all keys exist
        description: res.data.description || "",
        fields: [], // Default to an empty field if not provided
      });
    } catch (error) {
      console.error(error);
    }
  };

  const calling = (tellNumber) => {
    console.log("calling");
    navigate(`/${tellNumber}`);
  };
  const noCalling = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      const res = await apiClient.delete(`api/contacts/?id=${IDModal}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        let accessToken = refreshAccessToken();
        let booleanRes = Boolean(accessToken);
        if (booleanRes) {
          navigate(0);
        }
        console.log(error.response.status);
        console.log(`Аксес токен обнавлен: ${accessToken}`);
      }
    } finally {
      navigate(0);
      setOpenCreate(false);
    }
  };

  const OpneModalInfo = (id) => {
    setOpen(true);
    getModalDataContact(id);
    setDataModalG(id);
  };
  const handleChangeFields = (el, id) => {
    const { name, value } = el.target;

    const newData = formData.fields.map((prev) => {
      if (prev.id === id) {
        return { ...prev, [name]: value }; // Fix here: Spread prev correctly
      } else {
        return prev;
      }
    });

    setFormData((prevState) => ({
      ...prevState,
      fields: newData,
    }));
  };

  const addFields = (id) => {
    setFormData((prevState) => ({
      ...prevState,
      fields: [...prevState.fields, { name: "", value: "", id }],
    }));
  };
  const removeFields = (id) => {
    setFormData((prevState) => ({
      ...prevState,
      fields: prevState.fields.filter((el) => el.id !== id),
    }));
  };

  console.log("contacts", data);
  console.log("fetching", fetching);

  return (
    <>
      {/* <ToastContainer /> */}
      <Modal
        open={open}
        title=""
        footer={() => (
          <>
            <div
              className="btnCallinBack"
              style={{ padding: "0", margin: "0" }}
            >
              <Button
                onClick={() => calling(dataModalG.phone)}
                style={{ background: "#0CD939", color: "#fff" }}
                className="callinBackContacts"
              >
                <img src={miniCall} alt="iconCollBtn" />
                <span>Позвонить</span>
              </Button>
              <Button
                onClick={() => noCalling()}
                style={{ background: "#D90C0C", color: "#fff" }}
                className="callinBackContacts"
              >
                <img src={iconDelete} alt="iconCollBtn" />
                <span>Удалить</span>
              </Button>
            </div>
          </>
        )}
      >
        <button className="cloas" onClick={() => setOpen(false)}>
          <img src={cloasX} alt="cloasX" />
        </button>
        <div className="box-modal-create-elements">
          {dataModalG ? (
            <>
              <div className="bg-ccc">{dataModalG.name[0]}</div>
              <h2>{dataModalG.name}</h2>
              <p>{dataModalG.phone}</p>
            </>
          ) : (
            ""
          )}
          <h1
            onClick={() => {
              setOpen(false);
              setOpenCreate(true);
            }}
          >
            Изменить контакт
          </h1>
        </div>
      </Modal>
      <Modal
        open={openCreate}
        title="Изменить контакт"
        footer={() => (
          <>
            <div
              className="btnCallinBack"
              style={{ padding: "0", margin: "0" }}
            >
              <Button
                onClick={createContacts}
                style={{ background: "#2EA0FF", color: "#fff" }}
                className="callinBackContacts"
              >
                <span>Сохранить</span>
              </Button>
              <Button
                onClick={() => setOpenCreate(false)}
                style={{ background: "#2ea1ff48", color: "#2EA0FF" }}
                className="callinBackContacts"
              >
                <span>Отмена</span>
              </Button>
            </div>
          </>
        )}
      >
        <button className="cloas" onClick={() => setOpenCreate(false)}>
          <img src={cloasX} alt="cloasX" />
        </button>

        {dataModalG && (
          <div className="box-modal-createing-elements">
            <div>
              <label>Имя</label>
              <Input
                value={formData.firstName}
                name="firstName"
                onChange={handleChange}
                placeholder="Имя"
              />
            </div>
            <div>
              <label>Фамилия</label>
              <Input
                value={formData.lastName}
                name="lastName"
                onChange={handleChange}
                placeholder="Фамилия"
              />
            </div>
            <div>
              <label>Отчества</label>
              <Input
                value={formData.middleName}
                name="middleName"
                onChange={handleChange}
                placeholder="Отчества"
              />
            </div>
            <div>
              <label>Номер</label>
              <Input
                value={formData.phone}
                name="phone"
                onChange={handleChange}
                placeholder="Телефон"
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                value={formData.email}
                name="email"
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div>
              <label>Описание</label>
              <textarea
                value={formData.description}
                name="description"
                onChange={handleChange}
                placeholder="Описание"
              ></textarea>
            </div>
            <div>
              {formData.fields.map((el) => (
                <div key={el.id} className="fields">
                  <div>
                    <label>имя</label>
                    <input
                      value={el.name}
                      name="name"
                      onChange={(event) => handleChangeFields(event, el.id)}
                      type="text"
                    />
                  </div>
                  <div>
                    <label>значение</label>
                    <input
                      value={el.value}
                      name="value"
                      onChange={(event) => handleChangeFields(event, el.id)}
                      type="text"
                    />
                  </div>

                  <nav
                    className="removeFields"
                    onClick={() => removeFields(el.id)}
                  >
                    -
                  </nav>
                </div>
              ))}

              <nav
                className="addFields"
                onClick={() => addFields(formData.fields.length + 1)}
              >
                +
              </nav>
            </div>
          </div>
        )}
      </Modal>
      <div className="MessBox">
        <div className="headerMess">
          <h1>Контакты</h1>
          <Link className="button" to="/add-contacts">
            Добавить контакт{" "}
          </Link>
        </div>

        {/* <div className="ulLiDataMessHeader">
          <div
            className="liMess"
            style={{ height: "15px", borderColor: "#229AFF" }}
          >
            <div>
              <input type="text" value="Имя" onChange={() => {}} />
            </div>
            <div>
              <input type="text" value="Фамилия" onChange={() => {}} />
            </div>
            <div>
              <input type="text" value="Отчества" onChange={() => {}} />
            </div>
            <div>
              <input type="text" value="Телефон" onChange={() => {}} />
            </div>
            <svg
              style={{ opacity: 0 }}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="15" cy="15" r="15" fill="#279DFF" />
              <circle cx="8" cy="15" r="2.5" fill="#F5F5F5" />
              <circle cx="15" cy="15" r="2.5" fill="#F5F5F5" />
              <circle cx="22" cy="15" r="2.5" fill="#F5F5F5" />
            </svg>
          </div>
        </div> */}
        {/* <div className="ulLiDataMess" onScroll={scrollHandler}> */}
        {/* {data?.map((prev, i) => (
            <div key={i} className="liMess">
              <div>
                <input type="text" value={prev.name} onChange={() => {}} />
              </div>
              <div>
                <input type="text" value={prev.surname} onChange={() => {}} />
              </div>
              <div>
                <input
                  type="text"
                  value={prev.middleName}
                  onChange={() => {}}
                />
              </div>
              <div>
                <input type="text" value={prev.phone} onChange={() => {}} />
              </div>
              <svg
                style={{ cursor: "pointer" }}
                onClick={() => OpneModalInfo(prev)}
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="15" cy="15" r="15" fill="#279DFF" />
                <circle cx="8" cy="15" r="2.5" fill="#F5F5F5" />
                <circle cx="15" cy="15" r="2.5" fill="#F5F5F5" />
                <circle cx="22" cy="15" r="2.5" fill="#F5F5F5" />
              </svg>
            </div>
          ))} */}

        <Items
          setData={setData}
          getURL="/api/contacts/all"
          searchKeys={[
            "poisk",
            "poiskSurNeme",
            "poiskMiaddleName",
            "poiskPhone",
          ]}
          setFetching={setFetching}
          fetching={fetching}
          data={data}
          page={currentPage}
          setPage={setCurrentPage}
          headerItems={["Имя", "Фамилия", "Отчества", "Телефон"]}
          keys={["name", "surname", "middleName", "phone"]}
          stylesItem={{ gridTemplateColumns: "repeat(5, 1fr)" }}
          active={[
            {
              icon: moreDetails,
              function: (prev) => OpneModalInfo(prev),
            },
          ]}
        />
        {/* </div> */}
      </div>
    </>
  );
}
