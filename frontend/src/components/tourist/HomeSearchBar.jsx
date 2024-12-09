import { useState, useRef, useEffect } from "react";
import Calender from "../dropdownSearch/Calender";
import Location from "../dropdownSearch/Location";
import HeaderSerch from "../../pages/BookingHotels/Components/SearchEngine";
import { message } from "antd";
import { DateObject } from "react-multi-date-picker";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ tourist }) {
  const [currentActiveDD, setCurrentActiveDD] = useState("");
  const [selected, setSelected] = useState("");
  const today = new Date();
  const navigate = useNavigate();
  const dropDownContainer = useRef();
  const [dates, setDates] = useState([
    new DateObject().setDay(today.getDate() + 1),
    new DateObject().setDay(today.getDate() + 3),
  ]);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setCurrentActiveDD("");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const validate = () => {
    if (!selected) {
      message.error("Please search for a city.");
    } else if (!dates) {
      message.error("Please enter dates.");
    } else {
      if (tourist) {
        navigate(`/hotelList/${selected}/${dates[0]}/${dates[1]}`);
      } else {
        navigate(`/guest/hotelList/${selected}/${dates[0]}/${dates[1]}`);
      }
    }
  };

  return (
    <>
      <div
        data-aos="fade-up"
        data-aos-delay="300"
        className="hero__filter mt-60 lg:mt-30"
      >
        <div ref={dropDownContainer} className="searchForm -type-1 shadow-1">
          <div className="searchForm__form">
            <div className="searchFormItem js-select-control js-form-dd">
              <div
                className="searchFormItem__button"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "location" ? "" : "location"
                  )
                }
              ></div>

              <div className="xl:d-none ml-30">
                <HeaderSerch selected={selected} setSelected={setSelected} />
              </div>
              <Location
                setLocation={setSelected}
                active={currentActiveDD === "location"}
              />
            </div>

            <div className="searchFormItem__icon size-50 rounded-full bg-white flex-center">
              <div
                className="searchFormItem__button"
                onClick={() =>
                  setCurrentActiveDD((pre) =>
                    pre === "calender" ? "" : "calender"
                  )
                }
              >
                <div className="searchFormItem__icon size-50 rounded-full border-1 flex-center">
                  <i
                    className="text-20 icon-calendar"
                    onClick={() => setCurrentActiveDD("calender")}
                  ></i>
                </div>
                <div className="searchFormItem__content">
                  <div>
                    <span
                      className="js-first-date"
                      style={{ cursor: "pointer" }}
                    >
                      <Calender
                        dates={dates}
                        setDates={setDates}
                        active={currentActiveDD === "calender"}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="searchFormItem js-select-control js-form-dd">
            <div className="searchForm__button">
              <button
                onClick={() => validate()}
                className="button -dark-1 bg-stone rounded-200 text-white"
                style={{ padding: "10px 20px" }}
              >
                <i className="icon-search text-16 mr-10"></i>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
      .searchForm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        background: #fff;
        border-radius: 850px !important; /* Rounded edges */
      }

      `}</style>
    </>
  );
}
