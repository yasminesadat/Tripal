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
  const [isBookedOriginatingTransportation, setIsBookedOriginatingTransportation] = useState(false);
  const [isBookedReturnTransportation,setIsBookedReturnTransportation]=useState(false);
  const [isBookedAccepted,setIsBookedAccepted]=useState(false);
  useEffect(() => {
    const fetchTouristInfo = async (id) => {
      try {
        const userInfo = await getTouristUserName(id);
        console.log("userrr", userInfo);
        setTouristInfo({ userName: userInfo.userName, email: userInfo.email });
      } catch (error) {
        console.error("Error fetching tourist information:", error);
      }
    };
    fetchTouristInfo(touristId);
  }, []);
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    const getBookedHotels = async (id) => {
      try {
        const hotels = await getHotelHistory(id);
        console.log("result:in booking ", hotels);
        setHotels(hotels.bookedHotels);
      } catch (err) {
        console.log(err);
      }
    };
    getBookedHotels(touristId);
    
  },[]);
  useEffect(() => {
  function showTransportationOffer() {
    for (let i = 0; i < flight.itineraries.length; i++) {
      console.log("hello");
      const flightDepartureTime = moment(flight.itineraries[i]?.segments[0]?.departure?.at);
      const flightArrivalTime = moment(flight.itineraries[i]?.segments[flight.itineraries[i]?.segments.length - 1]?.arrival?.at);
      console.log(hotels);
      for (let j = 0; j < hotels.length; j++) {

        const hotelCheckIn = moment(hotels[j].checkIn);
        const hotelCheckOut = moment(hotels[j].checkOut);
        const hotelCity = hotels[j].cityCode;
        
        const diffInMilliseconds1 = Math.abs(flightDepartureTime - hotelCheckOut);
        let diffInDays1 = diffInMilliseconds1 / (1000 * 60 * 60 * 24);
        const diffInMilliseconds2 = Math.abs(hotelCheckIn - flightArrivalTime);
        let  diffInDays2 = diffInMilliseconds2 / (1000 * 60 * 60 * 24);
        if(i==0){
          if(hotelCity === destCityCode){
          if (diffInDays2 <= 1) {
            setIsBookedOriginatingTransportation(true);
          }

          }
          if(hotelCity === originCityCode){
            if (diffInDays1 <= 1) {
              setIsBookedOriginatingTransportation(true);
            }
          }
        }
        if(i==1){
          if(hotelCity === destCityCode){
            if (diffInDays1 <= 1) {
              setIsBookedReturnTransportation(true);
            }
          }
          if(hotelCity === originCityCode){
            if (diffInDays2 <= 1) {
              setIsBookedReturnTransportation(true);
            }
          }

        }
        
      }
     
    }
    return isBookedOriginatingTransportation||isBookedReturnTransportation;
  };
  showTransportationOffer();

},[hotels, flight.itineraries, isBookedOriginatingTransportation, isBookedReturnTransportation, originCityCode, destCityCode]);
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
        navigate('/tourist/invoice', { state: { flight, touristInfo, currency, exchangeRate, isBookedAccepted,isBookedOriginatingTransportation,isBookedReturnTransportation} });

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
       {(isBookedOriginatingTransportation||isBookedReturnTransportation)&&<Checkbox
          checked={isBookedAccepted} onChange={()=>{
            setIsBookedAccepted(!isBookedAccepted);
          }}
        >Transportation Booked</Checkbox>}
        {!doneBookTransportation &&(isBookedOriginatingTransportation||isBookedReturnTransportation)&& <TransportationBookingPopUp setDoneBookTransportation={setDoneBookTransportation} setIsBookedAccepted={setIsBookedAccepted} />}
        <button type="submit" className="submit-button">Pay Now</button>
      </form>
    </div>
  );
};

export default BookingDetails;
