import PropTypes from "prop-types";
import Item from "./Item";
import apiClient from "../../utils/api";
import { useEffect, useState } from "react";
import SearchHeaderItems from "../search/SearchHeaderItems";
// import { useState } from "react";

export function Items({
  data,
  stylesItem,
  keys,
  active,
  headerItems,
  page,
  setPage,
  fetching,
  setData,
  setFetching,
  getURL,
  searchKeys,
}) {
  const [search, setSearch] = useState({});
  const scrollHandler = (e) => {
    const target = e.target;
    console.table({
      name: "target",
      scrollHeight: target.scrollHeight,
      scrollTop: target.scrollTop,
      clientHeight: target.clientHeight,
    });

    if (!fetching.fetch) {
      if (target.scrollHeight - (target.scrollTop + target.clientHeight) < 1) {
        setFetching({ fetch: true, page: page + 1 });
        setPage(page + 1);
      }
      // if (page >= 1 && target.scrollTop < 1) {
      //   setFetching({ fetch: true, page: page - 1 });
      //   setPage(page - 1);
      // }
    }
  };

  async function fetchData(el) {
    try {
      let countPage = 1;

      if (el) {
        setPage(0);
        countPage = 1;
      }

      const response = await apiClient.get(
        `${getURL}?${search.poisk ? `name=${search.poisk}&` : ""}${
          search.poiskSurNeme ? `surname=${search.poiskSurNeme}&` : ""
        }${
          search.poiskMiaddleName
            ? `middleName=${search.poiskMiaddleName}&`
            : ""
        }${
          search.poiskPhone ? `phone=${search.poiskPhone}&` : ""
        }pagination.limit=25&pagination.page=${!el ? page : countPage}`
      );
      let dataL = [...data, ...response.data.contacts];

      if (Array.isArray(response.data.contacts)) {
        if (el) {
          setData(response.data.contacts);
        } else {
          setData(dataL);
        }
      } else {
        console.error(
          "Ожидался массив, но получен другой тип данных:",
          response.data.contacts
        );
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    } finally {
      setFetching({ ...fetching, fetch: false });
    }
  }

  useEffect(() => {
    if (fetching.fetch) {
      fetchData(false);
      // setCurrentPage(fetching.page);
    }
  }, [fetching]);

  useEffect(() => {
    const initialSearch = searchKeys.reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setSearch(initialSearch);
  }, [searchKeys]);
  console.log("searchKeys", searchKeys);

  return (
    <>
      <dev className="ItemsMain">
        <SearchHeaderItems
          setSearch={setSearch}
          search={search}
          setPage={setPage}
          fetchData={fetchData}
        />
        <div className="headerItems" style={stylesItem}>
          {headerItems.map((e, i) => (
            <h1 key={i}>{e}</h1>
          ))}
        </div>
        <div className="items " onScroll={scrollHandler}>
          {data.map((item, i) => (
            <Item
              key={i}
              active={active}
              data={item}
              keys={keys}
              stylesItem={stylesItem}
            />
          ))}
        </div>
      </dev>
    </>
  );
}

Items.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  stylesItem: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  keys: PropTypes.arrayOf(PropTypes.string),
  headerItems: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.arrayOf(
    PropTypes.shape({
      function: PropTypes.func.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ),
  setFetching: PropTypes.func.isRequired,
  fetching: PropTypes.shape({
    fetch: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
  }),
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  getURL: PropTypes.string.isRequired,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
};
