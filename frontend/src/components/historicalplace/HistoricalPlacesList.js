import React, { useEffect, useState } from "react";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message } from 'antd';

const HistoricalPlacesList = ({ places = [], curr = "EGP" }) => {
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (curr) {
        try {
          const rate = await getConversionRate(curr); 
          setExchangeRate(rate);
        } catch (error) {
          message.error("Failed to fetch exchange rate.");
        }
      }
    };

    fetchExchangeRate();
  }, [curr]);

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2); 
  };

  return (
    <div className="list">
      {places.map((place) => (
        <div className="list-item" key={place._id}>
          <div className="list-item-header">{place.name}</div>
          <div className="list-item-attributes-image">
            <div className="list-item-attribute-img">
              {place.images && place.images.length > 0 && (
                <img
                  src={place.images[0].url}  
                  alt={place.name}
                  style={{ width: "200px" }}
                />
              )}
            </div>
            <div className="list-item-attributes">
              <div className="list-item-attribute">{place.description}</div>
              <div className="list-item-attribute">Location: {place.location.address}</div>
              <div className="list-item-attribute">
                Opening Hours: Weekdays {place.openingHours.weekdays.openingTime} -{" "}
                {place.openingHours.weekdays.closingTime}, Weekends{" "}
                {place.openingHours.weekends.openingTime} -{" "}
                {place.openingHours.weekends.closingTime}
              </div>
              <div className="list-item-attribute">
                Ticket Prices: Foreigner: {curr} {convertPrice(place.ticketPrices.foreigner)}, Native: {curr} {convertPrice(place.ticketPrices.native)}, Student: {curr} {convertPrice(place.ticketPrices.student)}
              </div>
              <div className="list-item-attribute">
                Tags:{" "}
                {place.tags && place.tags.length > 0
                  ? place.tags.map((tag) => tag.name).join(", ")
                  : "N/A"}
              </div>
              <div className="list-item-attribute">
                Duration Tags:{" "}
                {place.historicalPeriod && place.historicalPeriod.length > 0
                  ? place.historicalPeriod.map((tag) => tag.name).join(", ")
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalPlacesList;