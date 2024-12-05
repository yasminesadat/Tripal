import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { saveBooking } from "../../../api/HotelService";
import { getTouristFlights } from '../../../api/TouristService';
import TransportationBookingPopUp from "@/pages/tourist/TransportationBooking";
import moment from "moment";
import { Checkbox, message } from 'antd';
import { loadStripe } from '@stripe/stripe-js';


// Inline styles for the component
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

const CreditCard = ({ bookingStage, setBookingStage, hotelid, hotelname, cityCode, singleNumber, doubleNumber, tripleNumber, total, checkIn, checkOut, setIsBookedOriginatingTransportation, setIsBookedReturnTransportation, setIsBookedAccepted, isBookedOriginatingTransportation, isBookedReturnTransportation, isBookedAccepted }) => {
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const navigate = useNavigate();
    const [touristFlights, setTouristFlights] = useState([]);
    const [doneBookTransportation, setDoneBookTransportation] = useState(false);
    const [isBooked, setBooked] = useState(false);
    const stripePromise = loadStripe("pk_test_51QOIg6DNDAJW9Du6kXAE0ci4BML4w4VbJFTY5J0402tynDZvBzG85bvKhY4C43TbOTzwoGiOTYeyC59d5PVhAhYy00OgGKWbLb");

    useEffect(() => {
        const getBookedFlights = async () => {
            try {
                const flights = await getTouristFlights();
                console.log("Fetched Flights:", flights);  // Log fetched flights
                setTouristFlights(flights.bookedFlights);
            } catch (err) {
                console.log("Error fetching flights:", err);
            }
        };
        getBookedFlights();
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

                // console.log("diff 1", diffInDays1);
                // console.log("diff 2", diffInDays2);
                // console.log(cityCode);
                // console.log(flightDeparture);
                // console.log(flightDest);

                if (diffInDays1 <= 1) {
                    if (cityCode === flightDeparture) {
                        // console.log("truue");
                        setIsBookedReturnTransportation(true);
                    }
                }
                if (diffInDays2 <= 1) {
                    if (cityCode === flightDest) {
                        // console.log("truue");
                        setIsBookedOriginatingTransportation(true);
                    }
                }
            }
        }

        if (touristFlights.length > 0) {
            showTransportationOffer();
        }
    }, [checkIn, checkOut, cityCode, isBookedOriginatingTransportation, isBookedReturnTransportation,touristFlights]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted.");
    
        if (paymentMethod === "wallet") {
            setBookingStage(3);
        }
        
        try {
            const response = await saveBooking(
                hotelid,
                hotelname,
                cityCode,
                singleNumber,
                doubleNumber,
                tripleNumber,
                checkIn,
                checkOut,
                total,
                "confirmed",
                paymentMethod
            );
            console.log("Response from saveBooking:", response);
    
            if (paymentMethod === "card") {
                const stripe = await stripePromise;
                const sessionId = response?.sessionId;
                
                if (sessionId) {
                    const { error } = await stripe.redirectToCheckout({ sessionId });
                    if (error) {
                        console.error("Stripe redirection error:", error);
                        message.error("Failed to redirect to payment. Please try again.");
                    }
                } else {
                    console.log("Session ID returned:", response.data?.sessionId);
                    console.error("Session ID not received.");
                    message.error("Failed to initiate payment session.");
                }
            }
        } catch (error) {
            console.error("Failed to save Booking", error);
            message.error("Booking failed. Please try again.");
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
                }

                .radio-option.selected {
                    background-color: #dac4d0;
                    border-color: #036264;
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
                    color: #11302a;
                    font-weight: 600;
                }

                .radio-icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 8px;
                    fill: #8f5774;
                }

                .radio-option.selected .radio-icon {
                    fill: #036264;
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