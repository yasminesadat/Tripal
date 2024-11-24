import { useState, useEffect, useRef } from "react";
import { fetchExchangeRates } from "../../../api/ExchangeRatesService.js"; // assuming this function fetches exchange rates
import { message } from "antd";

export default function Currency({ parentClass, userCurrency, onCurrencyChange }) {
  const [currentdd, setCurrentdd] = useState(""); // for handling the dropdown visibility
  const [currencies, setCurrencies] = useState([]); // stores the list of currencies
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency || "EGP"); // default to userCurrency or "USD"
  const dropDownContainer = useRef(); // ref to handle click outside to close the dropdown

  // Fetch currencies when the component mounts
  const fetchCurrencies = async () => {
    try {
      const ratesData = await fetchExchangeRates(); // fetching exchange rates
      if (ratesData && ratesData.conversion_rates) {
        const currencyCodes = Object.keys(ratesData.conversion_rates); // extracting the currency codes
        setCurrencies(currencyCodes); // setting the currencies
      }
    } catch (error) {
      message.error("Failed to fetch currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies(); // call fetchCurrencies when the component mounts

    // Handle click outside to close the dropdown
    const handleClick = (event) => {
      if (dropDownContainer.current && !dropDownContainer.current.contains(event.target)) {
        setCurrentdd(""); // close the dropdown if clicked outside
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick); // cleanup the event listener on unmount
    };
  }, []);

  // Update the selected currency when the user selects a currency
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setCurrentdd(""); // close the dropdown
    onCurrencyChange(currency); // call the parent handler to update the currency in the parent component
  };

  // Sync the selected currency when userCurrency prop changes (e.g., after an API call in the parent)
  useEffect(() => {
    setSelectedCurrency(userCurrency || "USD"); // update the selected currency if userCurrency prop changes
  }, [userCurrency]);

  return (
    <div
      ref={dropDownContainer}
      className={`${parentClass ? parentClass : "headerDropdown js-form-dd"}`}
    >
      <div
        className="headerDropdown__button"
        onClick={() => setCurrentdd((pre) => (pre === "currency" ? "" : "currency"))} // toggle dropdown
      >
        {selectedCurrency}
        <i className="icon-chevron-down text-18"></i>
      </div>

      <div
        className={`headerDropdown__content ${currentdd === "currency" ? "is-active" : ""}`}
      >
        <div className="headerDropdown">
          <div className="headerDropdown__container">
            {currencies.length > 0 ? (
              currencies.map((currencyCode, i) => (
                <div
                  onClick={() => handleCurrencyChange(currencyCode)} // update selected currency
                  key={i}
                  className="headerDropdown__item"
                >
                  <button>{currencyCode}</button>
                </div>
              ))
            ) : (
              <div>Loading currencies...</div> // display a loading message until currencies are fetched
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
