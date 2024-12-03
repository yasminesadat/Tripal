import { useEffect, useState, useRef } from "react";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";
import { message } from "antd";
import { getUserData } from "@/api/UserService";
import { bookResource } from "@/api/BookingService";

export default function TourSingleSidebar({ itinerary, activity, refActivityBook, refItineraryBook }) {
  const [userRole, setUserRole] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("EGP");
  const selectedRef = refActivityBook || refItineraryBook;

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

  const [ticketNumber, setTicketCount] = useState(1);

  const handleBookClick = async () => {
    try {
      const response = await bookResource(
        itinerary ? "itinerary" : "activity",
        itinerary ? itinerary._id : activity._id,
        ticketNumber
      );
      message.success(response.message);
      console.log(activity?.bookings)
    } catch (error) {
      message.error(error.response?.data?.error || "Booking failed");
    }
  };

  return (
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
  );
}
