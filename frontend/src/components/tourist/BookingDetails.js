import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightList.css';
import { message } from 'antd';
import { updateTouristInformation } from '../../api/TouristService';

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
        bookedFlights: [
          {
            flightNumber: flight.itineraries[0]?.segments[0]?.flight?.number || "N/A",
            airline: flight.validatingAirlineCodes[0] || "Unknown",
            departureTime: new Date(flight.itineraries[0]?.segments[0]?.departure?.at),
            arrivalTime: new Date(flight.itineraries[0]?.segments[flight.itineraries[0]?.segments.length - 1]?.arrival?.at),
            origin: flight.itineraries[0]?.segments[0]?.departure?.iataCode || "Unknown",
            destination: flight.itineraries[0]?.segments[flight.itineraries[0]?.segments.length - 1]?.arrival?.iataCode || "Unknown",
            price: flight.price?.total || "0.00",
            currency: flight.price?.currency || "USD",
            bookingDate: new Date(),
          },
        ],
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
        <p><strong>Flight Number:</strong> {flight.itineraries[0]?.segments[0]?.flight?.number || "N/A"}</p>
        <p><strong>Airline:</strong> {flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"}</p>
        <p><strong>Departure:</strong> {flight.itineraries[0]?.segments[0]?.departure?.iataCode} at {new Date(flight.itineraries[0]?.segments[0]?.departure?.at).toLocaleString()}</p>
        <p><strong>Arrival:</strong> {flight.itineraries[0]?.segments[flight.itineraries[0]?.segments.length - 1]?.arrival?.iataCode} at {new Date(flight.itineraries[0]?.segments[flight.itineraries[0]?.segments.length - 1]?.arrival?.at).toLocaleString()}</p>
        <p><strong>Price:</strong> {flight.price?.currency} {flight.price?.total}</p>
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
