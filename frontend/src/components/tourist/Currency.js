import { useState, useEffect, useRef } from "react";
import { fetchExchangeRates } from "../../api/ExchangeRatesService.js"; 

export default function Currency({ parentClass, userCurrency, onCurrencyChange }) {
  const [currentDropdown, setCurrentDropdown] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency);
  const dropDownContainer = useRef();

  useEffect(() => {
    setSelectedCurrency(userCurrency);
  }, [userCurrency]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setCurrentDropdown("");
    onCurrencyChange(currency);
  };

  const fetchCurrencies = async () => {
    try {
      const ratesData = await fetchExchangeRates(); 
      if (ratesData && ratesData.conversion_rates) {
        const currencyCodes = Object.keys(ratesData.conversion_rates); 
        setCurrencies(currencyCodes); 
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();

    const handleClick = (event) => {
      if (dropDownContainer.current && !dropDownContainer.current.contains(event.target)) {
        setCurrentDropdown("");
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
      className={`${parentClass ? parentClass : "headerDropdown js-form-dd"}`}
    >
      <div
        className="headerDropdown__button"
        onClick={() => setCurrentDropdown((prev) => (prev === "currency" ? "" : "currency"))}
      >
        {selectedCurrency}
        <i className="icon-chevron-down text-18"></i>
      </div>

      <div className={`headerDropdown__content ${currentDropdown === "currency" ? "is-active" : ""}`}>
        <div className="headerDropdown">
          <div className="headerDropdown__container">
            {currencies.map((currencyCode, i) => (
              <div
                onClick={() => handleCurrencyChange(currencyCode)}
                key={i}
                className="headerDropdown__item"
              >
                <button>{currencyCode}</button> 
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
