import { useEffect, useState, useRef } from "react";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";
import { message } from "antd";
import { getUserData } from "@/api/UserService";
import { bookResource } from "@/api/BookingService";
import { checkTouristPromoCode } from "@/api/TouristService";
import { loadStripe } from "@stripe/stripe-js";
export default function TourSingleSidebar({ itinerary, activity, refActivityBook, refItineraryBook }) {
  const [userRole, setUserRole] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("EGP");
  const selectedRef = refActivityBook || refItineraryBook;
  const [myPromoCode, setPromoCode] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [ticketNumber, setTicketCount] = useState(1);
  const stripePromise = loadStripe("pk_test_51QOIg6DNDAJW9Du6kXAE0ci4BML4w4VbJFTY5J0402tynDZvBzG85bvKhY4C43TbOTzwoGiOTYeyC59d5PVhAhYy00OgGKWbLb");

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handlePromoCodeSubmit = async () => {
    try {
      const promoCodeNew = await checkTouristPromoCode({ promoCode: myPromoCode });
      if (promoCodeNew.status === "yes") {
        message.success(promoCodeNew.message);
      }
      else {
        message.error(promoCodeNew.message);
      }
    }
    catch (error) {
      console.log("error", error);
      message.error(error.response.data.error);
      ;
    }

  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const curr = getTouristCurrency();
      if (curr) {
        setCurrency(curr);
        fetchExchangeRate(curr);
      }
    }, 500); // every 500ms

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchExchangeRate = async (curr) => {
    try {
      const rate = await getConversionRate(curr);
      setExchangeRate(rate);
    } catch (error) {
      message.error("Failed to fetch exchange rate.");
    }
  };

  const formatPrice = (price) => {
    const convertedPrice = (price * exchangeRate).toFixed(2);
    return `${currency} ${convertedPrice}`;
  };


  const handleBookClick = async () => {
    try {
      const response = await bookResource(
        itinerary ? "itinerary" : "activity",
        itinerary ? itinerary._id : activity._id,
        ticketNumber,
        myPromoCode,
        paymentMethod
      );
      if (paymentMethod === "wallet") {
        message.success(response.message);
      } else if (paymentMethod === "card") {

        const stripe = await stripePromise;
        const { sessionId } = response;
  
        const stripeSession = await stripe.redirectToCheckout({ sessionId });
  
        // if (stripeSession) {
        //   // Use sessionId and other required details to call the completeBooking route
        //   const completeBookingResponse = await axios.post(`/api/${itinerary ? "itinerary" : "activity"}/${itinerary ? itinerary._id : activity._id}/complete-booking`, {
        //     sessionId,
        //     touristId: userId,
        //     tickets: ticketNumber,
        //     resourceType: itinerary ? "itinerary" : "activity",
        //     resourceId: itinerary ? itinerary._id : activity._id
        //   });
  
        //   message.success(completeBookingResponse.data.message);
        // }
      }
    } catch (error) {
      console.error("Booking error:", error);
      message.error(error.response?.data?.error || "Booking failed");
    }
  };


  return (
    <>
      <div>
        <div className="tourSingleSidebar">
          <h5 className="text-18 fw-500 mb-20 mt-20">Tickets</h5>

          <div>
            <div className="d-flex items-center justify-between">
              <div className="text-14">
                Tickets: {" "}
                {itinerary && <span className="fw-500">
                  {ticketNumber} x {formatPrice(itinerary.price.toFixed(2))}
                </span>}

                {activity && <span className="fw-500">
                  {ticketNumber} x {formatPrice(activity.price.toFixed(2))}
                </span>}
              </div>

              <div className="d-flex items-center js-counter">
                <button
                  onClick={() => setTicketCount((pre) => (pre > 1 ? pre - 1 : pre))}
                  className="button size-30 border-1 rounded-full js-down"
                >
                  <i className="icon-minus text-10"></i>
                </button>

                <div className="flex-center ml-10 mr-10">
                  <div className="text-14 size-20 js-count">{ticketNumber}</div>
                </div>

                <button
                  onClick={() => setTicketCount((pre) => pre + 1)}
                  className="button size-30 border-1 rounded-full js-up"
                >
                  <i className="icon-plus text-10"></i>
                </button>
              </div>
            </div>
          </div>

          {/* <h5 className="text-18 fw-500 mb-20 mt-20">Add Extra</h5> */}

          {/* <div className="d-flex items-center justify-between">
        <div className="d-flex items-center">
          <div className="form-checkbox">
            <input
              checked={isExtraService ? true : false}
              onChange={() => setisExtraService((pre) => !pre)}
              type="checkbox"
            />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon">
                <img src="/img/icons/check.svg" alt="icon" />
              </div>
            </div>
          </div>
          <div className="ml-10">Add Service per booking</div>
        </div>

        <div className="text-14">$40</div>
      </div> */}

          {/* <div className="d-flex justify-between mt-20">
        <div className="d-flex">
          <div className="form-checkbox mt-5">
            <input
              checked={isServicePerPerson ? true : false}
              onChange={() => setIsServicePerPerson((pre) => !pre)}
              type="checkbox"
            />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon">
                <img src="/img/icons/check.svg" alt="icon" />
              </div>
            </div>
          </div>

          <div className="ml-10">
            Add Service per person
            <div className="lh-16">
              Adult: <span className="fw-500">$17.00</span> - Youth:{" "}
              <span className="fw-500">$14.00</span>
            </div>
          </div>
        </div>

        <div className="text-14">$40</div>
      </div> */}

          <div className="line mt-20 mb-20" />
                <h5 className="text-18 fw-500 mb-20">Select Payment Method</h5>
            <div className="d-flex items-center justify-between">
              <label>
                <input
                  type="radio"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
                Wallet Payment
              </label>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Credit Card (via Stripe)
              </label>
            </div>


          {itinerary && <div className="text-14 ">
            <span className="fw-500">Service Fee:  </span>
            {(formatPrice(itinerary.serviceFee.toFixed(2)))}
          </div>}

          <div className="d-flex items-center justify-between">

            <div className="text-18 fw-500">Total:</div>
            {itinerary && <div className="text-18 fw-500">
              {
                formatPrice((itinerary.price * ticketNumber + itinerary.serviceFee).toFixed(2))}
            </div>}

            {activity && <div className="text-18 fw-500">
              {formatPrice((activity.price * ticketNumber).toFixed(2))}
            </div>}

          </div>

          <button ref={selectedRef} onClick={handleBookClick} className="button -md -dark-1 col-12 bg-accent-1 text-white mt-20">
            Book Now
            <i className="icon-arrow-top-right ml-10"></i>
          </button>




        </div>

        <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20 mt-30">
          <h2 className="text-20 fw-500">Do you have a promo code?</h2>

          <div className="contactForm mt-25">
            <div className="form-input ">
              <input
                type="text"
                required
                value={myPromoCode}
                onChange={handlePromoCodeChange}
              />
              <label className="lh-1 text-16 text-light-1">
                Promo code
              </label>
            </div>
          </div>

          <button
            className="button -md -outline-accent-1 text-accent-1 mt-30"
            onClick={handlePromoCodeSubmit}
          >
            Apply
          </button>
        </div>

      </div>
      <style>{`
  .form-input {
    position: relative;
    margin-bottom: 20px;
  }

  .form-input input {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--color-stone-light)! important;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
  }

  .form-input label {
    position: absolute;
    left: 10px;
    top: -10px;
    background-color: white;
    padding: 0 8px;
    font-size: 16px;
    color: var(--color-light-1);
    pointer-events: none;
  }
  .contactForm .form-input label {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: 0.3s ease;
            color: #aaa;
          }
          .contactForm .form-input input:focus + label,
          .contactForm .form-input textarea:focus + label,
          .contactForm .form-input input:not(:placeholder-shown) + label,
          .contactForm .form-input textarea:not(:placeholder-shown) + label,
          .contactForm .form-input input.filled + label,
          .contactForm .form-input textarea.filled + label {
            transform: translateY(-29px);
            font-size: 12px;
            color: #333;
          }
  .button.-md.-outline-accent-1 {
    padding: 8px 16px;
    font-size: 14px;
    border: 2px solid var(--color-stone);
    color: var(--color-stone);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: transparent;
  }

  .button.-md.-outline-accent-1:hover {
    background-color: var(--color-stone);
    color: white;
  }
`}</style>
    </>
  );
}
