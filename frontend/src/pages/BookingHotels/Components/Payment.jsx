import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveBooking } from "../../../api/HotelService";
import { getTouristFlights } from '../../../api/TouristService';
import TransportationBookingPopUp from "@/pages/tourist/TransportationBooking";
import moment from "moment";
import { Checkbox, message } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import {Modal} from 'antd';
import { AlertCircle } from 'lucide-react';
import { getWalletAndTotalPoints } from "../../../api/TouristService";

const styles = {
    appcc: {
        fontFamily: 'sans-serif',
        textAlign: 'left',
    },
    formcc: {
        margin: '30px auto 0',
        maxWidth: '400px',
    },
    rowcc: {
        marginBottom: '15px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

const CreditCard = ({ bookingStage, setBookingStage, hotelid, hotelname, cityCode, singlePrice, doublePrice, triplePrice, singleNumber, doubleNumber, tripleNumber, total, checkIn, checkOut, setIsBookedOriginatingTransportation, setIsBookedReturnTransportation, setIsBookedAccepted, isBookedOriginatingTransportation, isBookedReturnTransportation, isBookedAccepted }) => {
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [touristFlights, setTouristFlights] = useState([]);
    const [doneBookTransportation, setDoneBookTransportation] = useState(false);
    const [isBooked, setBooked] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isWalletInfoModalVisible, setIsWalletInfoModalVisible] = useState(false);
    const [updatedWalletInfo, setUpdatedWalletInfo] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const stripePromise = loadStripe("pk_test_51QOIg6DNDAJW9Du6kXAE0ci4BML4w4VbJFTY5J0402tynDZvBzG85bvKhY4C43TbOTzwoGiOTYeyC59d5PVhAhYy00OgGKWbLb");

    useEffect(() => {
        const getBookedFlights = async () => {
          const flights = await getTouristFlights();
          console.log("Fetched Flights:", flights);
          setTouristFlights(flights.bookedFlights);
        };

        const fetchWalletData = async () => {
            try {
              const data = await getWalletAndTotalPoints();
              console.log("Fetched Wallet Data:", data);
              setUpdatedWalletInfo(data.wallet);
              setTotalPoints(data.totalPoints);
            } catch (error) {
              console.error("Error fetching wallet data:", error);
            }
          };


        getBookedFlights();
        fetchWalletData();
    }, []);

    useEffect(() => {
        function showTransportationOffer() {
            console.log("Showing Transportation Offer...");
            for (let i = 0; i < touristFlights.length; i++) {
                const flightDeparture = touristFlights[i].origin;
                const flightDest = touristFlights[i].destination;
                const flightDepartureTime = moment(touristFlights[i].departureTime);
                const hotelCheckOut = moment(checkOut);
                const flightArrivalTime = moment(touristFlights[i].arrivalTime);
                const hotelCheckIn = moment(checkIn);
                const diffInMilliseconds1 = Math.abs(flightDepartureTime - hotelCheckOut);
                const diffInDays1 = diffInMilliseconds1 / (1000 * 60 * 60 * 24);
                const diffInMilliseconds2 = Math.abs(hotelCheckIn - flightArrivalTime);
                const diffInDays2 = diffInMilliseconds2 / (1000 * 60 * 60 * 24);

                if (diffInDays1 <= 1) {
                    if (cityCode === flightDeparture) {
                        setIsBookedReturnTransportation(true);
                    }
                }
                if (diffInDays2 <= 1) {
                    if (cityCode === flightDest) {
                        setIsBookedOriginatingTransportation(true);
                    }
                }
            }
        }

        if (touristFlights.length > 0) {
            showTransportationOffer();
        }
    }, [checkIn, checkOut, cityCode, isBookedOriginatingTransportation, isBookedReturnTransportation,touristFlights]);
               
    const handleWalletPayment = async () => {
        try {
          await saveBooking({
            hotelid,
            hotelname,
            cityCode,
            singleNumber,
            doubleNumber,
            tripleNumber,
            checkIn,
            checkOut,
            pricing: total,
            singlePrice,
            doublePrice,
            triplePrice,
            status: "confirmed",
            paymentMethod:"wallet"
        });
          const updatedData = await getWalletAndTotalPoints();
        setUpdatedWalletInfo(updatedData.wallet);
        setTotalPoints(updatedData.totalPoints);
        setIsWalletInfoModalVisible(true);

        message.success("Booking successful!");
        
        setTimeout(() => {
            setBookingStage(3);
        }, 6000);
        } catch (error) {
          console.error("Failed to save booking:", error);
          message.error( error.message );
        }
      };
    
      const handleCreditCardPayment = async () => {
        try {
          const response = await saveBooking({
            hotelid,
            hotelname,
            cityCode,
            singleNumber,
            doubleNumber,
            tripleNumber,
            checkIn,
            checkOut,
            pricing: total,
            singlePrice,
            doublePrice,
            triplePrice,
            status: "confirmed",
            paymentMethod:"card"
        });
    
          const stripe = await stripePromise;
          const sessionId = response?.sessionId;
    
          if (sessionId) {
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
              message.error("Failed to redirect to payment. Please try again.");
            }
          } else {
              message.error("Failed to initiate payment session.");
          }
        } catch (error) {
          message.error("Booking failed. Please try again.");
        }
      };
    
      const handleConfirmPayment = () => {
        setIsConfirmationModalVisible(false);
        handleWalletPayment();
      };
    
      const cancelConfirmationModal = () => {
        setIsConfirmationModalVisible(false);
      };
    
      const closeWalletInfoModal = () => {
        setIsWalletInfoModalVisible(false);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (paymentMethod === "wallet") {
          setIsConfirmationModalVisible(true);
        } else if (paymentMethod === "card") {
          handleCreditCardPayment();
        }
      };

    return (
        <div className="payment-container">
            <form onSubmit={handleSubmit} className="payment-form">
                <div className="payment-method-section">
                    <h3 className="payment-title">Payment Method</h3>
                    <div className="radio-group">
                        <div 
                            className={`radio-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                                className="hidden-radio"
                            />
                            <label htmlFor="card" className="radio-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="radio-icon">
                                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                </svg>
                                Card
                            </label>
                        </div>
                        
                        <div 
                            className={`radio-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('wallet')}
                        >
                            <input
                                type="radio"
                                id="wallet"
                                name="paymentMethod"
                                value="wallet"
                                checked={paymentMethod === "wallet"}
                                onChange={() => setPaymentMethod("wallet")}
                                className="hidden-radio"
                            />
                            <label htmlFor="wallet" className="radio-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="radio-icon">
                                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                </svg>
                                Wallet
                            </label>
                        </div>
                    </div>
                </div>

                {(isBookedOriginatingTransportation || isBookedReturnTransportation) && (
                    <div className="checkbox-container">
                        <Checkbox
                            checked={isBookedAccepted} 
                            onChange={() => {
                                setIsBookedAccepted(!isBookedAccepted);
                            }}
                            className="transportation-checkbox"
                        >
                            Transportation Booked
                        </Checkbox>
                    </div>
                )}

                {!doneBookTransportation && 
                    (isBookedOriginatingTransportation || isBookedReturnTransportation) && 
                    <TransportationBookingPopUp 
                        setDoneBookTransportation={setDoneBookTransportation} 
                        setIsBookedAccepted={setIsBookedAccepted} 
                    />
                }

                <button 
                    type="submit" 
                    className="confirm-booking-button"
                >
                    Confirm Booking
                </button>
            </form>
            <Modal
            visible={isConfirmationModalVisible}
            onOk={handleConfirmPayment}
            onCancel={cancelConfirmationModal}
            okText="Yes, Pay"
            cancelText="Cancel"
            className="custom-confirmation-modal"
            okButtonProps={{
              className: "bg-[#036264] hover:bg-[#04494b] text-white",
              style: { backgroundColor: '#036264', color: 'white' },
            }}
            cancelButtonProps={{
              className: "text-gray-600 hover:text-gray-800",
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
          <Modal
            title={null}
            visible={isWalletInfoModalVisible}
            onOk={closeWalletInfoModal}
            footer={null}
            closeIcon={<div className="modal-close-icon" onClick={closeWalletInfoModal}>✕</div>}
            style={{ 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '350px',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
            bodyStyle={{
              backgroundColor: '#ffffff',
              color: '#333',
              textAlign: 'center',
              padding: '30px 20px',
            }}
          >
            <div className="wallet-modal-content">
              <p>
                <strong>New Wallet Balance:</strong> {updatedWalletInfo?.amount ? updatedWalletInfo.amount.toLocaleString() : '0'} {updatedWalletInfo?.wallet?.currency}
              </p>
              <p>
                <strong>Total Points:</strong> {totalPoints ? totalPoints.toLocaleString() : '0'} points!
              </p>
            </div>
          </Modal>
            <style jsx>{`
                .payment-container {
    max-width: 400px;
    margin: 30px auto 0;
}

.payment-form {
    background-color: #dac4d0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.payment-title {
    color: #036264;
    margin-bottom: 15px;
    font-weight: bold;
}

.radio-group {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}

.radio-option {
    flex: 1;
    border: 2px solid #8f5774;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: white;
    color: #8f5774;
}

.radio-option.selected {
    background-color: #036264;
    border-color: #036264;
    color: white;
}

.hidden-radio {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.radio-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.radio-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    fill: #8f5774;
}

.radio-option.selected .radio-icon {
    fill: white;
}

.checkbox-container {
    margin-bottom: 20px;
}

.transportation-checkbox {
    color: #11302a;
}

.confirm-booking-button {
    width: 100%;
    padding: 12px;
    background-color: #8f5774;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.confirm-booking-button:hover {
    background-color: #8f5774;
}
            `}</style>
        </div>
    );
};

export default CreditCard;