import React from "react";
import SearchIcon from "../../assets/icon/SearchIcon.svg";

export default function SearchHeaderItems({
  setSearch,
  search,
  setPage,
  fetchData,
}) {
  console.log("search", search);
  return (
    <div className="mainMess">
      {search.poisk !== undefined && (
        <nav
          style={{
            maxWidth: "350px",
            widows: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input
            style={{ width: "100%" }}
            className="inputContentSearch"
            onChange={(el) => setSearch({ ...search, poisk: el.target.value })}
            value={search.poisk}
            placeholder="Поиск по имени"
            type="text"
          />
        </nav>
      )}
      {search.poiskSurNeme !== undefined && (
        <nav
          style={{
            maxWidth: "350px",
            widows: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input
            style={{ width: "100%" }}
            className="inputContentSearch"
            onChange={(el) =>
              setSearch({ ...search, poiskSurNeme: el.target.value })
            }
            value={search.poiskSurNeme}
            placeholder="Поиск по фамилии"
            type="text"
          />
        </nav>
      )}
      {search.poiskMiaddleName !== undefined && (
        <nav
          style={{
            maxWidth: "350px",
            widows: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input
            style={{ width: "100%" }}
            className="inputContentSearch"
            onChange={(el) =>
              setSearch({ ...search, poiskMiaddleName: el.target.value })
            }
            value={search.poiskMiaddleName}
            placeholder="Поиск по очества"
            type="text"
          />
        </nav>
      )}
      <nav
        style={{
          maxWidth: "350px",
          widows: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {search.poiskPhone !== undefined && (
          <input
            style={{ width: "100%" }}
            className="inputContentSearch"
            onChange={(el) =>
              setSearch({ ...search, poiskPhone: el.target.value })
            }
            value={search.poiskPhone}
            placeholder="Поиск по номеру"
            type="text"
          />
        )}
        <button
          className="btnPoisk"
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setPage(0);
            fetchData(true);
          }}
        >
          <img src={SearchIcon} className="SearchIcon" alt="SearchIcon" />
        </button>
      </nav>
    </div>
  );
}
