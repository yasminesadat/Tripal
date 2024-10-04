import React from "react";

const HistoricalPlacesList = ({ places = [] }) => {
  return (
    <ul>
      {places.map((place) => (
        <li key={place._id}>
          <h2>{place.name}</h2>
          <p>{place.description}</p>
          {place.pictures && place.pictures.length > 0 && (
            <div>
              <h3>Pictures:</h3>
              <img
                src={place.pictures[0]}
                alt={place.name}
                style={{ width: "200px" }}
              />
            </div>
          )}
          <p>Location: {place.location.address}</p>
          <p>
            Opening Hours: Weekdays {place.openingHours.weekdays.openingTime} -{" "}
            {place.openingHours.weekdays.closingTime}, Weekends{" "}
            {place.openingHours.weekends.openingTime} -{" "}
            {place.openingHours.weekends.closingTime}
          </p>
          <p>
            Ticket Prices: Foreigner: ${place.ticketPrices.foreigner}, Native: $
            {place.ticketPrices.native}, Student: ${place.ticketPrices.student}
          </p>
          <p>
            Tags:{" "}
            {place.tags && place.tags.length > 0
              ? place.tags.map((tag) => tag.name).join(", ")
              : "N/A"}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default HistoricalPlacesList;
