import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightList.css';
import { message } from 'antd';
import { updateTouristInformation } from '../../api/TouristService';

export const parseDuration = (duration) => {
  const regex = /^PT(\d+H)?(\d+M)?$/;
  const match = duration.match(regex);
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  return `${hours} hours and ${minutes} minutes`;
};
const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flight = location.state?.flight;
  const touristId = "672aff256aa38ed2c3b51b36";

  if (!flight) return <p>No flight selected</p>;

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    message.success("Payment processed successfully!");

    try {
      const body = {
        bookedFlights: flight.itineraries.map((itinerary) => ({
          flightNumber: `${itinerary?.segments[0]?.carrierCode || "N/A"}${itinerary?.segments[0]?.number || ""}`,
          airline: flight.validatingAirlineCodes[0] || "Unknown",
          departureTime: new Date(itinerary?.segments[0]?.departure?.at),
          arrivalTime: new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at),
          origin: itinerary?.segments[0]?.departure?.iataCode || "Unknown",
          destination: itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode || "Unknown",
          price: flight.price?.total || "0.00",
          currency: flight.price?.currency || "USD",
          bookingDate: new Date(),
        })),
      };

      console.log("Formatted flight data:", body);

      const response = await updateTouristInformation(touristId, body);
      console.log("Tourist updated with flight info:", response);

      navigate('/tourist/invoice', { state: { flight } });
    } catch (error) {
      console.error("Error updating tourist information:", error);
      message.error("There was an issue updating your information.");
    }
  };

  return (
    <div className="booking-summary-container">
      <h1>Booking Summary</h1>
      <div className="flight-details">
        {flight.itineraries.map((itinerary, idx) => (
          <div key={idx} className="itinerary-details">
            <h3>Flight {idx + 1}</h3>
            <p><strong>Flight Number:</strong> {`${itinerary?.segments[0]?.carrierCode || "N/A"}${itinerary?.segments[0]?.number || ""}`}</p>
            <p><strong>Airline:</strong> {flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"}</p>
            <p><strong>Departure:</strong> {itinerary?.segments[0]?.departure?.iataCode} at {new Date(itinerary?.segments[0]?.departure?.at).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode} at {new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at).toLocaleString()}</p>
            <p><strong>Duration:</strong> {parseDuration(itinerary?.segments[0]?.duration || "PT0H0M")}</p>
            <p><strong>Price:</strong> {flight.price?.currency} {flight.price?.total}</p>
          </div>
        ))}
      </div>

      <form className="payment-form" onSubmit={handlePaymentSubmit}>
        <h2>Enter Payment Information</h2>
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" name="cardNumber" required placeholder="1234 5678 9012 3456" />
        </div>
        <div className="form-group">
          <label>CVC</label>
          <input type="text" name="cvc" required placeholder="123" />
        </div>
        <div className="form-group">
          <label>Expiration Date</label>
          <input type="text" name="expiry" required placeholder="MM/YY" />
        </div>
        <button type="submit" className="submit-button">Pay Now</button>
      </form>
    </div>
  );
};

export default BookingDetails;
