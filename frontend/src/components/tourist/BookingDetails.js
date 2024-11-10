import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './FlightList.css';
import { message } from 'antd';
import { updateTouristInformation, getTouristUserName } from '../../api/TouristService';
import { touristId } from '../../IDs';
import { getHotelHistory } from "../../api/HotelService";
import TransportationBookingPopUp from './TransportationBooking';
import moment from "moment";
import { Checkbox } from 'antd';
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
  const currency = location.state?.currency;
  const exchangeRate = location.state?.exchangeRate;
  const originCityCode = location.state?.originCityCode;
  const destCityCode = location.state?.destCityCode;
  const [touristInfo, setTouristInfo] = useState({ userName: '', email: '' });
  const [doneBookTransportation, setDoneBookTransportation] = useState(false);
  const [isBooked, setBooked] = useState(false);
  const hotelHistoryTourist = "672fa086f7dec6ce57c404dc"
  useEffect(() => {
    const fetchTouristInfo = async () => {
      try {
        const userInfo = await getTouristUserName(touristId);
        console.log("userrr", userInfo);
        setTouristInfo({ userName: userInfo.userName, email: userInfo.email });
      } catch (error) {
        console.error("Error fetching tourist information:", error);
      }
    };
    fetchTouristInfo();
  }, []);
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    const getBookedHotels = async () => {
      try {
        const hotels = await getHotelHistory(hotelHistoryTourist);
        console.log("result:in booking ", hotels);
        setHotels(hotels.bookedHotels);
      } catch (err) {
        console.log(err);
      }
    };
    getBookedHotels();
    
  },[hotelHistoryTourist]);

  function showTransportationOffer() {
    for (let i = 0; i < flight.itineraries.length; i++) {
      console.log("hello")
      const flightDepartureTime = moment(flight.itineraries[i]?.segments[0]?.departure?.at);
      const flightArrivalTime = moment(flight.itineraries[i]?.segments[flight.itineraries[i]?.segments.length - 1]?.arrival?.at);
      console.log("flight dep time", flightDepartureTime);
      console.log("flight arrival time", flightArrivalTime);
      console.log("flight origin", originCityCode);
      console.log("flight dest", destCityCode);
      console.log(hotels);
      for (let j = 0; j < hotels.length; j++) {
        console.log("hiii");
        const hotelCheckIn = moment(hotels[j].checkIn);
        const hotelCheckOut = moment(hotels[j].checkOut);
        const hotelCity = hotels[j].cityCode;
        console.log("hotel check in", hotelCheckIn);
        console.log("hotel check out", hotelCheckOut);
        console.log("hotel city", hotelCity);
        let diffInDays = 9999;
        if (hotelCity === originCityCode) {
          const diffInMilliseconds = Math.abs(flightDepartureTime - hotelCheckOut);
          diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
          console.log("days diff in 1st if", diffInDays);
        }
        if (hotelCity === destCityCode) {
          const diffInMilliseconds = Math.abs(hotelCheckIn - flightArrivalTime);
          diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
          console.log("days diff in 2nd if", diffInDays);
        }
        if (diffInDays <= 1) {
          return true;
        }
      }
     
    }
    return false;
  };
  if (!flight) return <p>No flight selected</p>;
  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };
  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    message.success("Payment processed successfully!");
      try {
        const body = {
          bookedFlights: flight.itineraries.map((itinerary,index) => ({
            flightNumber: `${itinerary?.segments[0]?.carrierCode || "N/A"}${itinerary?.segments[0]?.number || ""}`,
            airline: flight.validatingAirlineCodes[0] || "Unknown",
            departureTime: new Date(itinerary?.segments[0]?.departure?.at),
            arrivalTime: new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at),
            origin: index === 0 ? originCityCode || "Unknown" : destCityCode || "Unknown",
            destination: index === 0 ? destCityCode || "Unknown" : originCityCode || "Unknown",
            price: flight.price?.total || "0.00",
            currency: flight.price?.currency || "EGP",
            bookingDate: new Date(),
          })),
        };
        console.log("Formatted flight data:", body);
        const response = await updateTouristInformation(touristId, body);
        console.log("Tourist updated with flight info:", response);
        navigate('/tourist/invoice', { state: { flight, touristInfo, currency, exchangeRate } });

      } catch (error) {
        console.error("Error updating tourist information:", error);
        message.error("There was an issue updating your information.", error);
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
            <p><strong>Price:</strong> {currency} {convertPrice(flight.price?.total)}</p>
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
       {showTransportationOffer()&&<Checkbox
          checked={isBooked}
        >Transportation Booked</Checkbox>}
        {!doneBookTransportation &&showTransportationOffer()&& <TransportationBookingPopUp setDoneBookTransportation={setDoneBookTransportation} setBooked={setBooked} />}
        <button type="submit" className="submit-button">Pay Now</button>
      </form>
    </div>
  );
};

export default BookingDetails;
