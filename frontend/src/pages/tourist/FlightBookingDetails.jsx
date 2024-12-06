import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { updateTouristInformation, getTouristUserName } from '../../api/TouristService';
//import { getHotelHistory } from "";
//import TransportationBookingPopUp from './TransportationBooking';
//import moment from "moment";
import { Checkbox } from 'antd';
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
export const parseDuration = (duration) => {
  const regex = /^PT(\d+H)?(\d+M)?$/;
  const match = duration.match(regex);
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  return `${hours} hours and ${minutes} minutes`;
};
const FlightBookingDetails = () => {
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
    const fetchTouristInfo = async () => {
      try {
        const userInfo = await getTouristUserName();
        console.log("userrr", userInfo);
        setTouristInfo({ userName: userInfo.userName, email: userInfo.email });
      } catch (error) {
        console.error("Error fetching tourist information:", error);
      }
    };
    fetchTouristInfo();
  }, []);
  const [hotels, setHotels] = useState([]);
//   useEffect(() => {
//     const getBookedHotels = async (id) => {
//       try {
//         const hotels = await getHotelHistory(id);
//         console.log("result:in booking ", hotels);
//         setHotels(hotels.bookedHotels);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getBookedHotels(touristId);
    
//   },[]);
  useEffect(() => {
  function showTransportationOffer() {
    for (let i = 0; i < flight.itineraries.length; i++) {
      console.log("hello");
      //const flightDepartureTime = moment(flight.itineraries[i]?.segments[0]?.departure?.at);
      //const flightArrivalTime = moment(flight.itineraries[i]?.segments[flight.itineraries[i]?.segments.length - 1]?.arrival?.at);
      console.log(hotels);
      for (let j = 0; j < hotels.length; j++) {

        //const hotelCheckIn = moment(hotels[j].checkIn);
        //const hotelCheckOut = moment(hotels[j].checkOut);
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
        const response = await updateTouristInformation( body);
        console.log("Tourist updated with flight info:", response);
        navigate('/tourist/invoice', { state: { flight, touristInfo, currency, exchangeRate, isBookedAccepted,isBookedOriginatingTransportation,isBookedReturnTransportation} });

      } catch (error) {
        console.error("Error updating tourist information:", error);
        message.error("There was an issue updating your information.", error);
      }
    
  };


  return (
    <>
      <MetaComponent title="Flight Booking Details" />
      <TouristHeader />
      
      <div className="header-margin"></div>
    <section className="layout-pt-md layout-pb-lg mt-header">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-6">
                <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20">
                  <h2 className="text-30 md:text-24 fw-700 mb-30">
                    Payment Information
                  </h2>

                  <form className="contactForm">
                    <div className="row y-gap-30">
                      <div className="col-12">
                        <div className="form-input">
                          <input type="text" required />
                          <label className="lh-1 text-16 text-light-1">
                            Card Holder Name *
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-input">
                          <input type="text" required />
                          <label className="lh-1 text-16 text-light-1">
                            Card Number *
                          </label>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-input">
                          <input type="text" required />
                          <label className="lh-1 text-16 text-light-1">
                            Expiry Date *
                          </label>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-input">
                          <input type="text" required />
                          <label className="lh-1 text-16 text-light-1">
                            CVV *
                          </label>
                        </div>
                      </div>

                      {(isBookedOriginatingTransportation || isBookedReturnTransportation) && (
                        <div className="col-12">
                          <Checkbox
                            checked={isBookedAccepted}
                            onChange={() => {
                              setIsBookedAccepted(!isBookedAccepted);
                            }}
                          >
                            Transportation Booked
                          </Checkbox>
                        </div>
                      )}

                      {!doneBookTransportation && 
                       (isBookedOriginatingTransportation || isBookedReturnTransportation) && (
                        <TransportationBookingPopUp 
                          setDoneBookTransportation={setDoneBookTransportation} 
                          setIsBookedAccepted={setIsBookedAccepted} 
                        />
                      )}
                    </div>

                    <button 
                        type="submit" 
                        className="button -md text-white mt-30 w-100"
                        onClick={handlePaymentSubmit}
                        style={{
                          backgroundColor: '#8f5774',
                          border: '2px solid #8f5774',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#dac4d0';
                          e.currentTarget.style.color = '#8f5774';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#8f5774';
                          e.currentTarget.style.color = 'white';
                        }}
                      >
                      Complete Payment
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-6">
  <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20">
    <h2 className="text-20 fw-500">Flight Details</h2>

    {flight.itineraries.map((itinerary, idx) => (
      <div key={idx} className="mt-20">
        <div className="d-flex items-center justify-between">
          <div className="fw-500">Flight Number</div>
          <div>
            {itinerary?.segments[0]?.carrierCode} {itinerary?.segments[0]?.number}
          </div>
        </div>

        <div className="d-flex items-center justify-between">
          <div className="fw-500">Airline</div>
          <div>{flight.validatingAirlineCodes[0] || "Unknown Airline"}</div>
        </div>

        <div className="d-flex items-center justify-between">
          <div className="fw-500">Departure</div>
          <div>
            {itinerary?.segments[0]?.departure?.iataCode} - {" "}
            {new Date(itinerary?.segments[0]?.departure?.at).toLocaleString()}
          </div>
        </div>

        <div className="d-flex items-center justify-between">
          <div className="fw-500">Arrival</div>
          <div>
            {itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode} - {" "}
            {new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at).toLocaleString()}
          </div>
        </div>

        <div className="d-flex items-center justify-between">
          <div className="fw-500">Duration</div>
          <div>
            {parseDuration(itinerary?.segments[0]?.duration)}
          </div>
        </div>
      </div>
    ))}

    {/* Total Price - Appears only once */}
    <div className="line mt-20 mb-20"></div>
    <div className="d-flex items-center justify-between">
      <div className="fw-500">Total Flight Price</div>
      <div>{currency} {convertPrice(flight.price?.total)}</div>
    </div>
  </div>
</div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20">
              <h2 className="text-20 fw-500">Booking Summary</h2>

              <div className="line mt-20 mb-20"></div>

              <div className="d-flex items-center justify-between">
                <div className="fw-500">Subtotal</div>
                <div>{currency} {convertPrice(flight.price?.total)}</div>
              </div>

              <div className="d-flex items-center justify-between">
                  <div className="fw-500">Promo Applied</div>
                  <div>-50.00</div>
                </div>

                <div className="line mt-20 mb-20"></div>

                <div className="d-flex items-center justify-between">
                  <div className="fw-500 text-18">Total</div>
                  <div className="fw-500 text-18">
                    {currency} {convertPrice(flight.price?.total + 50)}
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20 mt-30">
                <h2 className="text-20 fw-500">Do you have a promo code?</h2>

                <div className="contactForm mt-25">
                  <div className="form-input ">
                    <input type="text" required />
                    <label className="lh-1 text-16 text-light-1">
                      Promo code
                    </label>
                  </div>
                </div>

                <button 
                        type="submit" 
                        className="button -md text-white mt-30 w-100"
                        onClick={handlePaymentSubmit}
                        style={{
                          backgroundColor: '#8f5774',
                          border: '2px solid #8f5774',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#dac4d0';
                          e.currentTarget.style.color = '#8f5774';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#8f5774';
                          e.currentTarget.style.color = 'white';
                        }}
                      >
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FooterThree />
    </>
  );
};

export default FlightBookingDetails;