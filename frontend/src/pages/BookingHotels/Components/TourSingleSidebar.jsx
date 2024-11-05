import React, { useEffect, useState,useCallback } from "react";
import Calender from "../../../components/dropdownSearch/Calender";
import DatePicker, { DateObject } from "react-multi-date-picker";

import { times } from "./tourSingleContent";  // Times is the boardType :) 
import { getHotelPrices } from "../../../api/HotelService";

  
  export default function TourSingleSidebar({ hotelID }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dates, setDates] = useState([
      new DateObject().setDay(5),
      new DateObject().setDay(14),
    ]);
    const [adultNumber, setAdultNumber] = useState(0);
    const [youthNumber, setYouthNumber] = useState(0);
    const [childrenNumber, setChildrenNumber] = useState(0);
    const [isExtraService, setisExtraService] = useState(false);
    const [isServicePerPerson, setIsServicePerPerson] = useState(false);
    const [extraCharge, setExtraCharge] = useState(0);
    const [singleRoom,setSingleRoom]= useState(0.0);
    const [doubleRoom,setDoubleRoom]= useState(0.0);
    const [tripleRoom,setTripleRoom]= useState(0.0);
    const [selectedTime, setSelectedTime] = useState("ROOM_ONLY");
    const [activeTimeDD, setActiveTimeDD] = useState(false);
    

    const prices = {
      extraService: 40,
      servicePerPerson: 40,
    };

    const fetchHotelPrices = useCallback( async () => {
        if (!dates || !selectedTime ) return; // Only call API if both dates are selected
       // console.log("checkin",dates[0].format("YYYY-MM-DD")," checkout",dates[1].format("YYYY-MM-DD"))
        try {
                const responseSingle = await getHotelPrices(hotelID, 
               dates[0].format("YYYY-MM-DD"),
               dates[1].format("YYYY-MM-DD"),
                 1,
                 selectedTime
            );
           const price1=responseSingle[0].offers[0].price.variations.average.base;
            console.log("Single Prices Response:", price1);
            setSingleRoom( price1);
          }
          catch (error) {           
            console.error("No rooms available for the selected criteria.");
            setSingleRoom("NA");
            setError("No rooms available for the selected dates and criteria.");           
         }

          try{

            const responseDouble = await getHotelPrices(hotelID, 
               dates[0].format("YYYY-MM-DD"),
              dates[1].format("YYYY-MM-DD"),
              2,
              selectedTime
          );
            const price2= responseDouble[0].offers[0].price.variations.average.base
            console.log("Double Prices Response:", price2);
            setDoubleRoom(price2);
          }
          catch (error) {           
            console.error("No rooms available for the selected criteria.");
            setDoubleRoom("NA");
            setError("No rooms available for the selected dates and criteria.");           
         }

          try{
            const responseTriple = await getHotelPrices(hotelID, 
              dates[0].format("YYYY-MM-DD"),
              dates[1].format("YYYY-MM-DD"),
              3,
              selectedTime
          );
            const price3= responseTriple[0].offers[0].price.variations.average.base

            console.log("Triple Prices Response:", price3);
            setTripleRoom(price3);
          

          }
         catch (error) {           
           console.error("No rooms available for the selected criteria.");
           setTripleRoom("NA")
           setError("No rooms available for the selected dates and criteria.");           
        }
        
         finally {
            setLoading(false);
        }
    }, [hotelID, dates,selectedTime]);

    // useEffect to call fetchHotelPrices when dates change
    useEffect(() => {
        fetchHotelPrices();
    }, [hotelID, dates,selectedTime,fetchHotelPrices]); // Fetch data when hotelID or dates change



 

  // useEffect(() => {
  //   setExtraCharge(0);
  //   if (isExtraService) {
  //     setExtraCharge((pre) => pre + prices.extraService);
  //   }
  //   if (isServicePerPerson) {
  //     setExtraCharge((pre) => pre + prices.servicePerPerson);
  //   }
  // }, [isExtraService, isServicePerPerson, setExtraCharge]);

  

  return (
    <div className="tourSingleSidebar">
     

      <div className="searchForm -type-1 -sidebar mt-20">
        <div className="searchForm__form">
          <div className="searchFormItem js-select-control js-form-dd js-calendar">
            <div className="searchFormItem__button" data-x-click="calendar">
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <i className="text-20 icon-calendar"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>From</h5>
                <div>
                  <span className="js-first-date">
                    <Calender dates={dates} setDates={setDates}/>
                  </span>
                  <span className="js-last-date"></span>
                </div>
              </div>
              <div className="searchFormItem__icon_chevron">
                <i className="icon-chevron-down d-flex text-18"></i>
              </div>
            </div>
          </div>

          <div className="searchFormItem js-select-control js-form-dd">
          <div className="searchFormItem__button"
              onClick={() => setActiveTimeDD((pre) => !pre)}
              data-x-click="time"
            >
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <i className="text-20 icon-clock"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>BoardType</h5>
                <div className="js-select-control-chosen">
                  {selectedTime ? selectedTime : "Choose BoardType"}
                </div>
              </div>
              <div className="searchFormItem__icon_chevron">
                <i className="icon-chevron-down d-flex text-18"></i>
              </div>
            </div>

            <div
              className={`searchFormItemDropdown -tour-type ${
                activeTimeDD ? "is-active" : ""
              }`}
              data-x="time"
              data-x-toggle="is-active"
            >
              <div className="searchFormItemDropdown__container">
                <div className="searchFormItemDropdown__list sroll-bar-1">
                  {times.map((elm, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedTime((pre) => (pre == elm ? "" : elm));
                        setActiveTimeDD(false);
                      }}
                      className="searchFormItemDropdown__item"
                    >
                      <button className="js-select-control-button">
                        <span className="js-select-control-choice">{elm}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-18 fw-500 mb-20 mt-20">Rooms</h5>

      <div>
        <div className="d-flex items-center justify-between">
          <div className="text-14">
            Single (1 Person) {" "}
            <span className="fw-500">
            { singleRoom && !isNaN(singleRoom) ? `$${(singleRoom * adultNumber).toFixed(2)}` : "NA"}            </span>
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() => setAdultNumber((pre) => (pre > 0 ? pre - 1 : pre))}
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{adultNumber}</div>
            </div>

            <button
              onClick={() => setAdultNumber((pre) => pre + 1)}
              className="button size-30 border-1 rounded-full js-up"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-15">
        <div className="d-flex items-center justify-between">
          <div className="text-14">
            Double (2 Persons) {" "}
            <span className="fw-500">
            {doubleRoom && !isNaN(doubleRoom) ? `$${(doubleRoom * youthNumber).toFixed(2)}` : "NA"}           
            </span>
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() => setYouthNumber((pre) => (pre > 0 ? pre - 1 : pre))}
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{youthNumber}</div>
            </div>

            <button
              onClick={() => setYouthNumber((pre) => pre + 1)}
              className="button size-30 border-1 rounded-full js-up"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-15">
        <div className="d-flex items-center justify-between">
          <div className="text-14">
            Triple (3 Persons) {" "}
            <span className="fw-500">
            { tripleRoom && !isNaN(tripleRoom) ? `$${(tripleRoom * childrenNumber).toFixed(2)}` : "NA"}            
            </span>
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() =>
                setChildrenNumber((pre) => (pre > 0 ? pre - 1 : pre))
              }
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{childrenNumber}</div>
            </div>

            <button
              onClick={() => setChildrenNumber((pre) => pre + 1)}
              className="button size-30 border-1 rounded-full js-up"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
      </div>

      {/* <h5 className="text-18 fw-500 mb-20 mt-20">Add Extra</h5> */}

      {/* <div className="d-flex items-center justify-between">
        <div className="d-flex items-center">
          <div className="form-checkbox">
            <input
              checked={isExtraService ? true : false}
              onChange={() => setisExtraService((pre) => !pre)}
              type="checkbox"
            />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon">
                <img src="/img/icons/check.svg" alt="icon" />
              </div>
            </div>
          </div>
          <div className="ml-10">Add Service per booking</div>
        </div>

        <div className="text-14">$40</div>
      </div> */}
{/* 
      <div className="d-flex justify-between mt-20">
        <div className="d-flex">
          <div className="form-checkbox mt-5">
            <input
              checked={isServicePerPerson ? true : false}
              onChange={() => setIsServicePerPerson((pre) => !pre)}
              type="checkbox"
            />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon">
                <img src="/img/icons/check.svg" alt="icon" />
              </div>
            </div>
          </div>

          <div className="ml-10">
            Add Service per person
            <div className="lh-16">
              Adult: <span className="fw-500">$17.00</span> - Youth:{" "}
              <span className="fw-500">$14.00</span>
            </div>
          </div>
        </div>

        <div className="text-14">$40</div>
      </div> */}

      <div className="line mt-20 mb-20"></div>

      <div className="d-flex items-center justify-between">
        <div className="text-18 fw-500">Total:</div>
        <div className="text-18 fw-500">
        $
        {(
          (isNaN(singleRoom) ? 0 : singleRoom) * adultNumber +
          (isNaN(doubleRoom) ? 0 : doubleRoom) * youthNumber +
          (isNaN(tripleRoom) ? 0 : tripleRoom) * childrenNumber +
          (isNaN(extraCharge) ? 0 : extraCharge) * 1
        ).toFixed(2)}
        </div>
      </div>

      <button className="button -md -dark-1 col-12 bg-accent-1 text-white mt-20">
        Book Now
        <i className="icon-arrow-top-right ml-10"></i>
      </button>
    </div>
  );
}
