import React, { useEffect, useState,useRef } from "react";
import Calender from "../common/Calender";
import { times } from "../../data/tourSingleContent";
import { touristId } from "../../IDs";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message } from "antd";
import { bookResource } from "../../api/BookingService";

export default function TourSingleSidebar({itinerary,activity}) {

  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("EGP");


  useEffect(() => {
    const curr = sessionStorage.getItem("currency");
    if (curr) {
        setCurrency(curr); 
        fetchExchangeRate(curr); 
    }
}, []);

const fetchExchangeRate = async (curr) => {
    try {
        const rate = await getConversionRate(curr);
        setExchangeRate(rate);
    } catch (error) {
        message.error("Failed to fetch exchange rate.");
    }
};

  const formatPrice = (price) => {
    const convertedPrice = (price * exchangeRate).toFixed(2);
    return `${currency} ${convertedPrice}`;
  };

  const [ticketNumber, setTicketCount] = useState(1);

  const [selectedTime, setSelectedTime] = useState("");
  const [activeTimeDD, setActiveTimeDD] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [activeDateDD, setActiveDateDD] = useState(false);
  
  const handleBookClick = async () => {
    if (itinerary&&(!selectedDate || !selectedTime)) {
      message.error("Please select both a date and time.");
      return;
    }

    try {
      const response = await bookResource(
        itinerary ? "itinerary" : "activity",
        itinerary ? itinerary._id : activity._id,
        touristId,
        selectedDate,
        selectedTime,
        ticketNumber
      );
      message.success(response.message);
    } catch (error) {
      message.error(error.response?.data?.error || "Booking failed");
    }
  };
  return (
    <div className="tourSingleSidebar">

      {itinerary&& (<div className="searchForm -type-1 -sidebar mt-20">
        <div className="searchForm__form">
          {/* <div className="searchFormItem js-select-control js-form-dd js-calendar">
            <div className="searchFormItem__button" data-x-click="calendar">
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <i className="text-20 icon-calendar"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>Dates</h5>
                <div>
                  <span className="js-first-date">
                    <Calender /> 
                    
                  </span>
                  <span className="js-last-date"></span>
                </div>
              </div>
              <div className="searchFormItem__icon_chevron">
                <i className="icon-chevron-down d-flex text-18"></i>
              </div>
            </div>
          </div> */}

          <div className="searchFormItem js-select-control js-form-dd js-calendar">
            <div
              className="searchFormItem__button"
              onClick={() => setActiveDateDD((pre) => !pre)}
              data-x-click="date"
            >
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
              <i className="text-20 icon-calendar"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>Date</h5>
                <div className="js-select-control-chosen">
                  {selectedDate ? selectedDate : "Choose date"}
                </div>
              </div>
              <div className="searchFormItem__icon_chevron">
                <i className="icon-chevron-down d-flex text-18"></i>
              </div>
            </div>

            <div
              className={`searchFormItemDropdown -tour-type ${
                activeDateDD ? "is-active" : ""
              }`}
              data-x="date"
              data-x-toggle="is-active"
            >
              <div className="searchFormItemDropdown__container">
                <div className="searchFormItemDropdown__list sroll-bar-1">
                  {itinerary.availableDates.map((elm, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedDate((pre) => (pre == elm ? "" : elm));
                        setActiveDateDD(false);
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

          <div className="searchFormItem js-select-control js-form-dd">
            <div
              className="searchFormItem__button"
              onClick={() => setActiveTimeDD((pre) => !pre)}
              data-x-click="time"
            >
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <i className="text-20 icon-clock"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>Time</h5>
                <div className="js-select-control-chosen">
                  {selectedTime ? selectedTime : "Choose time"}
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
                  {itinerary.availableTime.map((elm, i) => (
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
      </div>)}

      <h5 className="text-18 fw-500 mb-20 mt-20">Tickets</h5>

      <div>
        <div className="d-flex items-center justify-between">
          <div className="text-14">
            Tickets: {" "}
            {itinerary&&<span className="fw-500">
              {ticketNumber} x {formatPrice(itinerary.price.toFixed(2))} 
            </span>}

            {activity&&<span className="fw-500">
              {ticketNumber} x {formatPrice(activity.price.toFixed(2))} 
            </span>}
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() => setTicketCount((pre) => (pre > 1 ? pre - 1 : pre))}
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{ticketNumber}</div>
            </div>

            <button
              onClick={() => setTicketCount((pre) => pre + 1)}
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

      {/* <div className="d-flex justify-between mt-20">
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

      <div className="line mt-20 mb-20"/>
        

        {itinerary&&<div className="text-14 ">
        <span className="fw-500">Service Fee:  </span> 
         {(formatPrice(itinerary.serviceFee.toFixed(2)))}
        </div>}

      <div className="d-flex items-center justify-between">

        <div className="text-18 fw-500">Total:</div>
        {itinerary&&<div className="text-18 fw-500">
          {(
            itinerary.price * ticketNumber +
            itinerary.serviceFee
          ).toFixed(2)}
        </div>}

        {activity&&<div className="text-18 fw-500">
          {(activity.price * ticketNumber).toFixed(2)}
        </div>}

      </div>

      <button onClick={handleBookClick}  className="button -md -dark-1 col-12 bg-accent-1 text-white mt-20">
        Book Now
        <i className="icon-arrow-top-right ml-10"></i>
      </button>
    </div>
  );
}
