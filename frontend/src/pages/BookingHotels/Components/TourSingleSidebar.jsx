/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import Calender from "../../../components/dropdownSearch/Calender";
import { times } from "./tourSingleContent";
import { getHotelPrices } from "../../../api/HotelService";
import { getConversionRate, getTouristCurrency } from "../../../api/ExchangeRatesService";
import { format } from "date-fns";
import { getTouristAge } from "@/api/TouristService";
import { message } from 'antd';

export default function TourSingleSidebar({
  cityCode,
  hotelID,
  name,
  dates1,
  dates2,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();
  const [dates, setDates] = useState(() => {
    try {
      // If dates1 and dates2 exist, use them
      if (dates1 && dates2) {
        return [
          new Date(format(dates1, "dd MMM yy")),
          new Date(format(dates2, "dd MMM yy"))
        ];
      }

      // Default values: today and tomorrow
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      return [today, tomorrow];
    } catch (error) {
      // Fallback in case of parsing errors
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      return [today, tomorrow];
    }
  }); const [singleNumber, setSingleNumber] = useState(0);
  const [doubleNumber, setDoubleNumber] = useState(0);
  const [tripleNumber, setTripleNumber] = useState(0);
  const [singlePrice, setSinglePrice] = useState(0.0);
  const [doublePrice, setDoublePrice] = useState(0.0);
  const [triplePrice, setTriplePrice] = useState(0.0);
  const [boardType, setBoardType] = useState("ROOM_ONLY");
  const [activeTimeDD, setActiveTimeDD] = useState(false);
  const [currency, setCurrency] = useState("EGP");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [touristAge, setTouristAge] = useState(0);



  const getExchangeRate = async () => {
    if (currency) {
      const rate = await getConversionRate(currency);
      setExchangeRate(rate);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1); return () => clearInterval(intervalId);
  }, [currency]);

  useEffect(() => {
    const fetchTouristAge = async () => {
      try {
        const data = await getTouristAge();
        setTouristAge(data.age);
      } catch (error) {
        message.error('Failed to fetch tourist age');
        console.error(error);
      }
    };

    fetchTouristAge();
  }, []);

  const fetchHotelPrices = useCallback(async () => {
    if (!dates || !boardType) return;

    const numberofdays = (dates[1] - dates[0]) / (1000 * 60 * 60 * 24);
    try {
      const responseSingle = await getHotelPrices(
        hotelID,
        format(dates[0], "yyyy-MM-dd"),
        format(dates[1], "yyyy-MM-dd"),
        1,
        boardType
      );
      const price1 = responseSingle.data[0].offers[0].price.variations.average.base;
      const convRate = responseSingle.dictionaries.currencyConversionLookupRates;
      const ratesArray = Object.values(convRate);
      const rateValue = ratesArray.length > 0 ? ratesArray[0].rate : 1;
      setSinglePrice(Math.ceil(price1 * numberofdays * rateValue * exchangeRate));
    } catch (error) {
      setSinglePrice(25708 * exchangeRate);
      setError("No rooms available for the selected dates and criteria.");
    }

    try {
      const responseDouble = await getHotelPrices(
        hotelID,
        format(dates[0], "yyyy-MM-dd"),
        format(dates[1], "yyyy-MM-dd"),
        2,
        boardType
      );
      const price2 =
        responseDouble.data[0].offers[0].price.variations.average.base;
      const convRate2 =
        responseDouble.dictionaries.currencyConversionLookupRates;
      const ratesArray2 = Object.values(convRate2);
      const rateValue2 = ratesArray2.length > 0 ? ratesArray2[0].rate : 1;
      setDoublePrice(
        Math.ceil(price2 * numberofdays * rateValue2 * exchangeRate)
      );
    } catch (error) {
      setDoublePrice(35918 * exchangeRate);
      setError("No rooms available for the selected dates and criteria.");
    }

    try {
      const responseTriple = await getHotelPrices(
        hotelID,
        format(dates[0], "yyyy-MM-dd"),
        format(dates[1], "yyyy-MM-dd"),
        3,
        boardType
      );
      console.log("hi3");
      const price3 =
        responseTriple.data[0].offers[0].price.variations.average.base;
      const convRate3 =
        responseTriple.dictionaries.currencyConversionLookupRates;
      const ratesArray3 = Object.values(convRate3);
      const rateValue3 = ratesArray3.length > 0 ? ratesArray3[0].rate : 1;
      setTriplePrice(
        Math.ceil(price3 * numberofdays * rateValue3 * exchangeRate)
      );
    } catch (error) {
      setTriplePrice(39817 * exchangeRate);
      setError("No rooms available for the selected dates and criteria.");
    }
  }, [hotelID, dates, boardType, currency]);

  useEffect(() => {
    fetchHotelPrices();
  }, [hotelID, currency, dates, boardType, fetchHotelPrices]);
  const canBook =
    (
      (isNaN(singlePrice) ? 0 : singlePrice * exchangeRate) * singleNumber +
      (isNaN(doublePrice) ? 0 : doublePrice * exchangeRate) * doubleNumber +
      (isNaN(triplePrice) ? 0 : triplePrice * exchangeRate) * tripleNumber
    ).toFixed(2) > 0;

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
                    <Calender dates={dates} setDates={setDates} />
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
            <div
              className="searchFormItem__button"
              onClick={() => setActiveTimeDD((pre) => !pre)}
              data-x-click="time"
            >
              <div className="searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center">
                <i className="text-20 icon-clock"></i>
              </div>
              <div className="searchFormItem__content">
                <h5>BoardType</h5>
                <div className="js-select-control-chosen">
                  {boardType ? boardType : "Choose BoardType"}
                </div>
              </div>
              <div className="searchFormItem__icon_chevron">
                <i className="icon-chevron-down d-flex text-18"></i>
              </div>
            </div>

            <div
              className={`searchFormItemDropdown -tour-type ${activeTimeDD ? "is-active" : ""
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
                        setBoardType((pre) => (pre == elm ? "" : elm));
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
            Single (1 Person){" "}
            <span className="fw-500">
              {singlePrice && !isNaN(singlePrice)
                ? `${currency} ${(singlePrice * singleNumber * exchangeRate).toFixed(2)}`
                : "NA"}{" "}
            </span>
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() =>
                setSingleNumber((pre) => (pre > 0 ? pre - 1 : pre))
              }
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{singleNumber}</div>
            </div>

            <button
              onClick={() => setSingleNumber((pre) => pre + 1)}
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
            Double (2 Persons){" "}
            <span className="fw-500">
              {doublePrice && !isNaN(doublePrice)
                ? `${currency} ${(doublePrice * doubleNumber * exchangeRate).toFixed(2)}`
                : "NA"}
            </span>
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() =>
                setDoubleNumber((pre) => (pre > 0 ? pre - 1 : pre))
              }
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{doubleNumber}</div>
            </div>

            <button
              onClick={() => setDoubleNumber((pre) => pre + 1)}
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
            Triple (3 Persons){" "}
            <span className="fw-500">
              {triplePrice && !isNaN(triplePrice)
                ? `${currency} ${(triplePrice * tripleNumber * exchangeRate).toFixed(2)}`
                : "NA"}
            </span>
          </div>

          <div className="d-flex items-center js-counter">
            <button
              onClick={() =>
                setTripleNumber((pre) => (pre > 0 ? pre - 1 : pre))
              }
              className="button size-30 border-1 rounded-full js-down"
            >
              <i className="icon-minus text-10"></i>
            </button>

            <div className="flex-center ml-10 mr-10">
              <div className="text-14 size-20 js-count">{tripleNumber}</div>
            </div>

            <button
              onClick={() => setTripleNumber((pre) => pre + 1)}
              className="button size-30 border-1 rounded-full js-up"
            >
              <i className="icon-plus text-10"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="line mt-20 mb-20"></div>
      <div className="d-flex items-center justify-between">
        <div className="text-18 fw-500">Total:</div>
        <div className="text-18 fw-500">
          {currency}
          {(
            (isNaN(singlePrice) ? 0 : singlePrice * exchangeRate) * singleNumber +
            (isNaN(doublePrice) ? 0 : doublePrice * exchangeRate) * doubleNumber +
            (isNaN(triplePrice) ? 0 : triplePrice * exchangeRate) * tripleNumber
          ).toFixed(2)}
        </div>
      </div>
      {canBook ? (
        <button
          className="button -md -lightpurple col-12 bg-accent-1 text-white mt-20"
          onClick={() => {
            if (touristAge > 18) {
              window.location.href = `/confirmBooking/${cityCode}/${hotelID}/${name}/${singlePrice}/${singleNumber}/${doublePrice}/${doubleNumber}/${triplePrice}/${tripleNumber}/${boardType}/${dates[0]}/${dates[1]}/${currency}/${exchangeRate}`;
            }
            else {
              message.error('You must be at least 18 years old to book a flight.');
            }
          }}
        >
          Book Now
          <i className="icon-arrow-top-right ml-10"></i>
        </button>
      ) : null}{" "}
    </div>
  );
}
