import { useState, useEffect, useRef } from "react";
import { fetchExchangeRates } from "../../../api/ExchangeRatesService.js";
import { message } from "antd";
import Spinner from "@/components/common/Spinner";

export default function Currency({ parentClass, userCurrency, onCurrencyChange }) {
  const [currentdd, setCurrentdd] = useState("");
  const [currencies, setCurrencies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency || "EGP");
  const dropDownContainer = useRef(); 

  const fetchCurrencies = async () => {
    try {
      const ratesData = await fetchExchangeRates();
      if (ratesData && ratesData.conversion_rates) {
        const currencyCodes = Object.keys(ratesData.conversion_rates);
        setCurrencies(currencyCodes);
      }
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch currencies:", error);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchCurrencies();

    const handleClick = (event) => {
      if (dropDownContainer.current && !dropDownContainer.current.contains(event.target)) {
        setCurrentdd("");
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);


  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency); 
    sessionStorage.setItem("currency", currency);
    setCurrentdd("");
    onCurrencyChange(currency);
  };

  useEffect(() => {
    setSelectedCurrency(userCurrency || "EGP");
  }, [userCurrency]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      ref={dropDownContainer}
      className={`${parentClass ? parentClass : "headerDropdown js-form-dd"}`}
    >
      <div
        className="headerDropdown__button"
        onClick={() => setCurrentdd((pre) => (pre === "currency" ? "" : "currency"))}
      >
        {selectedCurrency} 
        <i className="icon-chevron-down text-18"></i>
      </div>

      <div
        className={`headerDropdown__content ${currentdd === "currency" ? "is-active" : ""}`}
      >
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
