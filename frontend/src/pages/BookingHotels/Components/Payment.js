import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { saveBooking } from "../../../api/HotelService";

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
    rccsCardcc: {
        height: '182.873px',
        marginTop: '10px',
        marginBottom: '10px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'all 0.4s linear',
        width: '290px',
        backgroundImage: 'url(./images/6.jpeg)', // Example background image
      
    },
    rowcc: {
        marginBottom: '15px',
    },
    inputcc: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ced4da',
        borderRadius: '0.25rem',
        backgroundColor: '#ffffff',
        outline: 'none',
        boxShadow: 'none',
    },
    errorcc: {
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
    },
};

const CreditCard = ({bookingStage,setBookingStage,userid,hotelid,hotelname,singleNumber,doubleNumber,tripleNumber,total,checkIn,checkOut}) => {
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [cvc, setCvc] = useState("");
    const [focus, setFocus] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const cardNumberPattern = /^[0-9]{16}$/; // 16 digits
        const cvcPattern = /^[0-9]{3}$/; // 3 digits
        const datePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/; // MM/YY or MM/YYYY

        // Validate card number
        if (!number) {
            newErrors.number = "Card number is required.";
        } else if (number.length !== 16) {
            newErrors.number = "Card number must be exactly 16 digits.";
        } else if (!cardNumberPattern.test(number)) {
            newErrors.number = "Invalid card number. Must be 16 digits.";
        }

        // Validate cardholder name
        if (!name) {
            newErrors.name = "Cardholder name is required.";
        } else if (name.length < 3 || name.length > 30) {
            newErrors.name = "Cardholder name must be between 3 and 30 characters.";
        }

        // Validate expiration date
        if (!date) {
            newErrors.date = "Expiration date is required.";
        } else if (!datePattern.test(date)) {
            newErrors.date = "Invalid expiration date. Format: MM/YY.";
        }

        // Validate CVV
        if (!cvc) {
            newErrors.cvc = "CVV is required.";
        } else if (cvc.length !== 3) {
            newErrors.cvc = "CVV must be exactly 3 digits.";
        } else if (!cvcPattern.test(cvc)) {
            newErrors.cvc = "Invalid CVV. Must be 3 digits.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Handle successful submission (e.g., send data to an API)
        // console.log("Payment Information Submitted:",  userid,hotelid,hotelname,singleNumber,doubleNumber,tripleNumber,checkIn,checkOut,total,"confirmed" );
        setBookingStage(3);
        try {
            const responseSingle = await saveBooking(userid,hotelid,hotelname,singleNumber,doubleNumber,tripleNumber,checkIn,checkOut,total,"confirmed");
            
            setErrors({});
        }
        catch (error) {           
            console.error("Failed to save Booking");       
        }
    }
    return (
        <div style={styles.appcc}>
            <div className="rccs__card rccs__card--unknown" style={styles.rccsCardcc}>
                <Cards
                    number={number}
                    name={name}
                    expiry={date}
                    cvc={cvc}
                    focused={focus}
                />
            </div>

            <form style={styles.formcc} onSubmit={handleSubmit}>
                <div className="row" style={styles.rowcc}>
                    <div className="col-sm-11">
                        <label htmlFor="number">Card Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={number}
                            name="number"
                            onChange={(e) => setNumber(e.target.value)}
                            onFocus={(e) => setFocus(e.target.name)}
                            style={styles.inputcc}
                            required
                        />
                        {errors.number && <p style={styles.errorcc}>{errors.number}</p>}
                    </div>
                </div>

                <div className="row" style={styles.rowcc}>
                    <div className="col-sm-11">
                        <label htmlFor="name">Card Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            onFocus={(e) => setFocus(e.target.name)}
                            style={styles.inputcc}
                            required
                        />
                        {errors.name && <p style={styles.errorcc}>{errors.name}</p>}
                    </div>
                </div>

                <div className="row" style={styles.rowcc}>
                    <div className="col-sm-6">
                        <label htmlFor="expiry">Expiration Date</label>
                        <input
                            type="text"
                            name="expiry"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onFocus={(e) => setFocus(e.target.name)}
                            style={styles.inputcc}
                            required
                        />
                        {errors.date && <p style={styles.errorcc}>{errors.date}</p>}
                    </div>
                    <div className="col-sm-5">
                        <label htmlFor="cvc">CVV</label>
                        <input
                            type="tel"
                            name="cvc"
                            className="form-control"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            onFocus={(e) => setFocus(e.target.name)}
                            style={styles.inputcc}
                            required
                        />
                        {errors.cvc && <p style={styles.errorcc}>{errors.cvc}</p>}
                    </div>
                </div>

                <button type="submit" className="button -md -dark-1 bg-accent-1 text-white" >Confirm Booking</button>
            </form>
        </div>
    );
};

export default CreditCard;
