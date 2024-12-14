import { useEffect, useRef, useState } from "react";
import { getCityCode } from "../../../api/HotelService";

export default function HeaderSerch({ white, selected, setSelected }) {
  const [ddActive, setDdActive] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const inputRef = useRef();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    inputRef.current.value = selected;
  }, [selected]);

  const fetchSearchData = async (searchinfo) => {
    try {
      if (searchinfo.length < 3 || searchinfo.length > 10) {
        setSearchData([]);
        setDdActive(false);
        return;
      }
      const response = await getCityCode(searchinfo);
      const transformedData = response.map((city) => ({
        cityCode: city.iataCode,
        iconClass: "icon-pin text-20",
        title: city.name,
        location: city.address.countryCode,
      }));

      setSearchData(transformedData);
      setDdActive(transformedData.length > 0);
    } catch (error) {
      console.error("Error fetching city codes:", error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSelected(inputValue);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (inputValue === "") {
        setSearchData([]); 
        setDdActive(false); 
      } else {
        fetchSearchData(inputValue);
      }
    }, 50);
  };

  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActive(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={dropDownContainer}
      className="header__search js-liverSearch js-form-dd"
    >
      <div className="searchFormItem__icon size-50 rounded-full bg-white  flex-center">
        <i className="text-20 icon-pin"></i>
      </div>
      <input
        onChange={handleInputChange}
        ref={inputRef}
        type="text"
        placeholder="Search cities by 3-10 characters"
        className={`js-search ${white ? "text-white" : ""}`}
        onClick={() => setDdActive((prev) => !prev)}
        style={{ marginLeft: "-9%" }}
      />

      <div
        className={
          ddActive ? "headerSearchRecent is-active" : "headerSearchRecent"
        }
        data-x="headerSearch"
      >
        <div className="headerSearchRecent__container">
          <div className="headerSearchRecent__title">
            <h4 className="text-18 fw-500">Recent Searches</h4>
          </div>

          <div className="headerSearchRecent__list js-results">
            {searchData
              .filter((elm) => elm.cityCode != null)
              .map((elm, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelected(elm.cityCode);
                    setDdActive(false);
                  }}
                  className="headerSearchRecent__item js-search-option"
                  data-x-click="headerSearch"
                >
                  <div className="size-50 bg-white rounded-12 border-1 flex-center">
                    {elm.iconClass && <i className={elm.iconClass}></i>}
                  </div>
                  <div className="ml-10">
                    <div className="fw-500 js-search-option-target">
                      {elm.title}
                    </div>
                    <div className="lh-14 text-14 text-light-2">
                      {elm.cityCode} {elm.location}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
