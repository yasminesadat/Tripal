import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { updateTouristInformation, getTouristUserName, getWalletAndTotalPoints } from '../../api/TouristService';
import { saveFlightBooking } from "../../api/TouristService";
import { getHotelHistory } from "../../api/HotelService";
import TransportationBookingPopUp from './TransportationBooking'
import moment from "moment";
import { Checkbox, Modal, Button} from 'antd';
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import { loadStripe } from "@stripe/stripe-js";
import { AlertCircle } from 'lucide-react';
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
  const originCityCode = location.state?.originCityCode;
  const destCityCode = location.state?.destCityCode;
  const [touristInfo, setTouristInfo] = useState({ userName: '', email: '' });
  const [doneBookTransportation, setDoneBookTransportation] = useState(false);
  const [isBookedOriginatingTransportation, setIsBookedOriginatingTransportation] = useState(false);
  const [isBookedReturnTransportation,setIsBookedReturnTransportation]=useState(false);
  const [isBookedAccepted,setIsBookedAccepted]=useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [updatedWalletInfo, setUpdatedWalletInfo] = useState(0); 
  const [totalPoints, setTotalPoints] = useState(0); 
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
const [pendingPaymentBody, setPendingPaymentBody] = useState(null);

  const stripePromise = loadStripe("pk_test_51QOIg6DNDAJW9Du6kXAE0ci4BML4w4VbJFTY5J0402tynDZvBzG85bvKhY4C43TbOTzwoGiOTYeyC59d5PVhAhYy00OgGKWbLb");

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

    const fetchWalletData = async () => {
      try {
        const data = await getWalletAndTotalPoints();
        setUpdatedWalletInfo(data.wallet);
        setTotalPoints(data.totalPoints);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };
    fetchTouristInfo();
    fetchWalletData();
  }, []);

  const [exchangeRate, setExchangeRate] = useState(1);

  const [currency, setCurrency] = useState( "EGP");

  const getExchangeRate = async () => {
    if (currency) {
      try {
        const rate = await getConversionRate(currency);
        setExchangeRate(rate);
      } catch (error) {
        //message.error("Failed to fetch exchange rate.");
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1);  return () => clearInterval(intervalId);
  }, [currency]);


  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    const getBookedHotels = async () => {
      try {
        const hotels = await getHotelHistory();
        console.log("result:in booking ", hotels);
        setHotels(hotels.bookedHotels);
      } catch (err) {
        console.log(err);
      }
    };
    getBookedHotels();
    
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

  const confirmBooking = (body) => {
    if (!body) {
      console.error("Body is not provided for payment.");
      return;
    }
    setPendingPaymentBody(body);
    setIsConfirmationModalVisible(true);
  };
  
  const handleWalletPayment = async () => {
    try {
      if (!pendingPaymentBody) {
        message.error("No payment details available.");
        return;
      }
  
      const response = await saveFlightBooking(pendingPaymentBody);
      console.log("Tourist updated with flight info:", response);
  
      const updatedWalletData = await getWalletAndTotalPoints();
      setTotalPoints(updatedWalletData.totalPoints);
      setUpdatedWalletInfo(updatedWalletData);
  
      message.success("Payment successful! Wallet updated.");
      setIsConfirmationModalVisible(false);
      setIsModalVisible(true);
      setPendingPaymentBody(null);
    } catch (error) {
      console.error("Error processing wallet payment:", error);
      message.error("There was an issue updating your information.");
    }
  };
  
  const cancelPayment = () => {
    setIsConfirmationModalVisible(false);
    setPendingPaymentBody(null);
  };
  
  const handleCardPayment = async (body) => {
    try {
      const response = await saveFlightBooking(body);
  
      const stripe = await stripePromise;
      const { sessionId } = response;
  
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error processing card payment:", error);
      message.error("There was an issue updating your information.");
    }
  };
  
  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = {
        bookedFlights: flight.itineraries.map((itinerary, index) => ({
          flightNumber: `${itinerary?.segments[0]?.carrierCode || "N/A"}${itinerary?.segments[0]?.number || ""}`,
          airline: flight.validatingAirlineCodes[0] || "Unknown",
          departureTime: new Date(itinerary?.segments[0]?.departure?.at).toISOString(),
          arrivalTime: new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at).toISOString(),
          origin: index === 0 ? originCityCode || "Unknown" : destCityCode || "Unknown",
          destination: index === 0 ? destCityCode || "Unknown" : originCityCode || "Unknown",
          price: (flight.price?.total*exchangeRate).toString() || "0.00",
          currency: currency || "EGP",
        })),
        useWallet: paymentMethod === "wallet",
        paymentMethod,
      };
  
      if (paymentMethod === "wallet") {

        confirmBooking(body);
    } else if (paymentMethod === "card") {

        await handleCardPayment(body);
    }
    } catch (error) {
      console.error("Error submitting payment:", error);
      message.error("There was an issue submitting your payment.");
    }
  };

  const showConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleConfirmationYes = () => {
    setIsConfirmationModalVisible(false);
    setIsModalVisible(true);
    handlePaymentSubmit();
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
                    How would you like to pay?
                  </h2>

                  <form className="contactForm">
                    <div className="row y-gap-30">
                      <h5 className="text-18 fw-500 mb-20">Select Payment Method</h5>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                            <input
                              type="radio"
                              value="wallet"
                              checked={paymentMethod === "wallet"}
                              onChange={() => setPaymentMethod("wallet")}
                              style={{ marginRight: "5px", transform: "scale(0.4)" }}
                            />
                            Wallet Payment
                          </label>
                          <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                            <input
                              type="radio"
                              value="card"
                              checked={paymentMethod === "card"}
                              onChange={() => setPaymentMethod("card")}
                              style={{ marginRight: "5px", transform: "scale(0.4)" }}
                            />
                            Credit Card (via Stripe)
                          </label>
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
    onClick={handlePaymentSubmit} // Call handlePaymentSubmit directly
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
                    <div>{currency} {(flight.price?.total*exchangeRate)}</div>
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
                <div>{currency} {flight.price?.total*exchangeRate}</div>
              </div>

              <div className="d-flex items-center justify-between">
                  <div className="fw-500">Promo Applied</div>
                  <div>-50.00</div>
                </div>

                <div className="line mt-20 mb-20"></div>

                <div className="d-flex items-center justify-between">
                  <div className="fw-500 text-18">Total</div>
                  <div className="fw-500 text-18">
                    {currency} {(flight.price?.total*exchangeRate+ 50)}
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
          {/* <Modal
  title="Wallet Updated!"
  visible={isModalVisible}
  onOk={() => {
    setIsModalVisible(false);
    navigate('/tourist'); // Navigate to /tourist when clicking OK
  }}
  onCancel={() => {
    setIsModalVisible(false);
    navigate('/tourist'); // Navigate to /tourist when clicking Cancel
  }}
  okText="Close"
>
  <p><strong>New Wallet Balance:</strong> {updatedWalletInfo?.wallet} EGP</p>
  <p><strong>Total Points:</strong> {updatedWalletInfo?.totalPoints} points</p>
</Modal> */}
        </div>
      </section>
      <Modal
    title={null}
    visible={isModalVisible}
    onOk={() => {
        setIsModalVisible(false);
        navigate('/tourist/invoice', { 
            state: { 
                flight, 
                touristInfo, 
                currency, 
                exchangeRate, 
                isBookedAccepted, 
                isBookedOriginatingTransportation, 
                isBookedReturnTransportation 
            } 
        });
    }}
    onCancel={() => {
      setIsModalVisible(false);
      navigate('/tourist/invoice', { 
          state: { 
              flight, 
              touristInfo, 
              currency, 
              exchangeRate, 
              isBookedAccepted, 
              isBookedOriginatingTransportation, 
              isBookedReturnTransportation 
          } 
      });
  }}
    footer={[
        <Button 
            key="submit" 
            className="modal-ok-button"
            onClick={() => {
                setIsModalVisible(false);
                navigate('/tourist/invoice', { 
                    state: { 
                        flight, 
                        touristInfo, 
                        currency, 
                        exchangeRate, 
                        isBookedAccepted, 
                        isBookedOriginatingTransportation, 
                        isBookedReturnTransportation 
                    } 
                });
            }}
        >
            OK
        </Button>
    ]}
    closeIcon={<div className="modal-close-icon" onClick={() => setIsModalVisible(false)}>✕</div>}
    style={{ 
        top: '50%', 
        transform: 'translateY(-50%)',
        width: '350px',
        borderRadius: '12px',
        overflow: 'hidden'
    }}
    bodyStyle={{
        backgroundColor: '#ffffff',
        color: '#ffffff',
        textAlign: 'center',
        padding: '30px 20px',
    }}
>
    <div className="wallet-modal-content">
    <p>
        <strong>New Wallet Balance:</strong> {updatedWalletInfo?.wallet?.amount ? updatedWalletInfo.wallet.amount.toLocaleString() : '0'} {updatedWalletInfo?.wallet?.currency}
    </p>
    <p>
        <strong>Total Points:</strong> {totalPoints ? totalPoints.toLocaleString() : '0'} points!
    </p>
    </div>

    <style jsx>{`
        .modal-close-icon {
            position: absolute;
            top: 15px;
            right: 30px;
            cursor: pointer;
            font-size: 20px;
            color: #8f5774;
            transition: color 0.3s ease;
        }

        .modal-close-icon:hover {
            color: #036264;
        }

        .ant-modal-footer {
            display: flex;
            justify-content: center;
            padding: 15px;
            background-color: #e5f8f8;
            border-top: none;
        }

        .modal-ok-button {
            background-color: #8f5774 !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 8px !important;
            font-weight: bold !important;
            transition: background-color 0.3s ease !important;
        }

        .modal-ok-button:hover {
            background-color: #036264 !important;
        }

        .wallet-modal-content {
            font-family: inherit;
        }

        .wallet-modal-content p {
            margin: 10px 0;
            color: #11302a;
        }
    `}</style>
</Modal>
      {isConfirmationModalVisible && (
        <Modal
        visible={isConfirmationModalVisible}
        onOk={handleWalletPayment}
        onCancel={cancelPayment}
        okText="Yes, Pay"
        cancelText="Cancel"
        className="custom-confirmation-modal"
        okButtonProps={{
            className: "bg-[#036264] hover:bg-[#04494b] text-white !important",
            style: { backgroundColor: '#036264', color: 'white' }
        }}
        cancelButtonProps={{
            className: "text-gray-600 hover:text-gray-800"
        }}
    >
        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <AlertCircle className="text-[#036264] w-12 h-12" />
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Payment</h3>
                <p className="text-gray-600">
                    Are you sure you want to proceed with this payment? 
                    Please review the details before confirming.
                </p>
            </div>
        </div>
    </Modal>
      )}
     <FooterThree />
   </>
  
  );
};

export default FlightBookingDetails;