import React from "react";

const HistoricalPlacesList = ({ places = [] }) => {
  return (
    <div class="list" >
      {places.map((place) => (
        <div class="list-item" key={place._id}>
          <div class="list-item-header">{place.name}</div>
          <div class="list-item-attributes-image">
            <div className="list-item-attribute-img">
              {place.images && place.images.length > 0 && (
                <img
                  src={place.images[0].url}  
                  alt={place.name}
                  style={{ width: "200px" }}
                />
              )}
            </div>
            <div class="list-item-attributes">
              <div class="list-item-attribute">{place.description}</div>
              <div class="list-item-attribute">Location: {place.location.address}</div>
              <div class="list-item-attribute">
                Opening Hours: Weekdays {place.openingHours.weekdays.openingTime} -{" "}
                {place.openingHours.weekdays.closingTime}, Weekends{" "}
                {place.openingHours.weekends.openingTime} -{" "}
                {place.openingHours.weekends.closingTime}
              </div>
              <div class="list-item-attribute">
                Ticket Prices: Foreigner: ${place.ticketPrices.foreigner}, Native: $
                {place.ticketPrices.native}, Student: ${place.ticketPrices.student}
              </div>
              <div class="list-item-attribute">
                Tags:{" "}
                {place.tags && place.tags.length > 0
                  ? place.tags.map((tag) => tag.name).join(", ")
                  : "N/A"}
              </div>
              <div class="list-item-attribute">
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
