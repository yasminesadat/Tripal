import React, { useEffect, useRef, useState } from "react";
import { getCityCode } from "../../../api/HotelService";

export default function HeaderSerch({ white,selected,setSelected }) {
  // const [selected, setSelected] = useState("");
  const [ddActive, setDdActive] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = selected;
  }, [selected]);

   
  const fetchSearchData= async (searchinfo)=>{
    try {
      if (searchinfo.length < 3 || searchinfo.length>10) {
        return; // Do not fetch if the input is less than 3 characters
      }
      const response= await getCityCode(searchinfo);

   //   if (Array.isArray(response.data)) {
      const transformedData = response.map((city) => ({
        cityCode: city.iataCode, // Unique ID
        iconClass: "icon-pin text-20",
        title: city.name,
        location: city.address.countryCode

      }));
    
      console.log(response)
      setSearchData(transformedData);
    }
   // }
    catch (error) {
      console.error("Error fetching tours:", error);
    }
  }

  useEffect(() => {
    if (selected) {
      fetchSearchData(selected); // Fetch data whenever selected changes
    }
  }, [selected]); 

  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActive("");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <>
      <div
        ref={dropDownContainer}
        className="header__search js-liverSearch js-form-dd"
      >
        <i className="icon-search text-18"></i>
        <input
          onChange={(e) => setSelected(e.target.value)}
          ref={inputRef}
          onClick={() => setDdActive((pre) => !pre)}
          type="text"
          placeholder="Search cities by 3-10 characters"
          className={`js-search ${white ? "text-white" : ""}`}
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
              {searchData .filter((elm) => elm.cityCode!=null).map((elm, i) => (
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
                      {elm.img && (
                        <img src={elm.img} alt="image" className="rounded-12" />
                      )}
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
    </>
  );
}
