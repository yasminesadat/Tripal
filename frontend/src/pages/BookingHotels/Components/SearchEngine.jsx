import React, { useEffect, useRef, useState } from "react";
import { getCityCode } from "../../../api/HotelService";
import { message } from "antd";

export default function HeaderSerch({ white, selected, setSelected }) {
  const [ddActive, setDdActive] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const inputRef = useRef();
  const debounceTimeout = useRef(null); // Reference to store the timeout

  useEffect(() => {
    inputRef.current.value = selected;
  }, [selected]);

  const fetchSearchData = async (searchinfo) => {
    try {
      if (searchinfo.length < 3 || searchinfo.length > 10) {
        setSearchData([]); // Clear search data if input is invalid
        setDdActive(false); // Hide dropdown
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
      setDdActive(transformedData.length > 0); // Show dropdown if there are results
    } catch (error) {
      console.error("Error fetching city codes:", error);
      // message.error("Error fetching city codes.");
      // console.log("after errorrrrrrrrrrrrrrr")
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSelected(inputValue);

    // Clear the previous timeout if it exists
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      if (inputValue === "") {
        setSearchData([]); // Clear search data if input is empty
        setDdActive(false); // Hide dropdown
      } else {
        fetchSearchData(inputValue); // Fetch data on input change
      }
    }, 50); // Adjust the delay time (in milliseconds) as needed
  };

  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActive(false); // Hide dropdown on outside click
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div ref={dropDownContainer} className="header__search js-liverSearch js-form-dd">
      <i className="icon-search text-18"></i>
      <input
        onChange={handleInputChange}
        ref={inputRef}
        type="text"
        placeholder="Search cities by 3-10 characters"
        className={`js-search ${white ? "text-white" : ""}`}
        onClick={() => setDdActive((prev) => !prev)}
      />

      <div className={ddActive ? "headerSearchRecent is-active" : "headerSearchRecent"} data-x="headerSearch">
        <div className="headerSearchRecent__container">
          <div className="headerSearchRecent__title">
            <h4 className="text-18 fw-500">Recent Searches</h4>
          </div>

          <div className="headerSearchRecent__list js-results">
            {searchData.filter((elm) => elm.cityCode != null).map((elm, i) => (
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
                  <div className="fw-500 js-search-option-target">{elm.title}</div>
                  <div className="lh-14 text-14 text-light-2">{elm.cityCode} {elm.location}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
