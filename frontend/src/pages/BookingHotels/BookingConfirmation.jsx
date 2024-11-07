import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function BookingPages() {

  const [bookingStage, setBookingStage] = useState(2);
  const [activeTab, setActiveTab] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(''); // New state for payment method
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [paypalMethod, setPaypalMethod] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmit = () => {
    if (activeTab === 1) {
      // Validate card details
      if (!cardHolderName || !cardNumber || !expiryDate || !cvc) {
        setError('Please fill all fields for card payment.');
        return;
      }
    } else {
      // Handle PayPal payment logic here
      setPaypalMethod(true); // Assume method selected
    }

    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      alert('Payment Successful!'); // Replace with actual success handling
    }, 2000);
  };

  return (
    <section className="layout-pt-md layout-pb-lg mt-header">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
           

            <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20 mt-30">

              

           { bookingStage === 2 && (
      <div>
        <h2 className="text-30 md:text-24 fw-700 mb-30">How do you want to pay?</h2>

        <div className="tabs -pills-3 js-tabs">
           {/* <div className="rccs__card backcolor"> */}

      <div clasName="rccs__card rccs__card--unknown">
        <Cards
          number={number}
          name={name}
          expiry={date}
          cvc={cvc}
          focused={focus}
        />
      </div>

      <br />
      <form>
        <div className="row">
          <div className="col-sm-11">
            <label for="name">Card Number</label>
            <input
              type="text"
              className="form-control"
              value={number}
              name="number"
              onChange={(e) => {
                SetNumber(e.target.value);
              }}
              onFocus={(e) => SetFocus(e.target.name)}
            ></input>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-11">
            <label for="name">Card Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              name="name"
              onChange={(e) => {
                SetName(e.target.value);
              }}
              onFocus={(e) => SetFocus(e.target.name)}
            ></input>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-6">
            <label for="name">Expiration Date</label>
            <input
              type="text"
              name="expiry"
              className="form-control"
              value={date}
              onChange={(e) => {
                SetDate(e.target.value);
              }}
              onFocus={(e) => SetFocus(e.target.name)}
            ></input>
          </div>
          <div className="col-sm-5">
            <label for="name">CVV</label>
            <input
              type="tel"
              name="cvc"
              className="card"
              value={cvc}
              onChange={(e) => {
                SetCvc(e.target.value);
              }}
              onFocus={(e) => SetFocus(e.target.name)}
            ></input>
          </div>
        </div>
      </form>    
        </div>
      </div>
    
            )
}

{bookingStage == 3 &&
              <div >
              <div className="d-flex flex-column items-center text-center">
                <div className="size-80 rounded-full flex-center bg-accent-1 text-white">
                  <i className="icon-check text-26"></i>
                </div>

                <h2 className="text-30 md:text-24 fw-700 mt-20">
                  System, your order was submitted successfully!
                </h2>
                <div className="mt-10">
                  Booking details has been sent to: booking@tourz.com
                </div>
              </div>

              <div className="border-dashed-1 py-30 px-50 rounded-12 mt-30">
                <div className="row y-gap-15">
                  <div className="col-md-3 col-6">
                    <div>Order Number</div>
                    <div className="text-accent-2">13119</div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div>Date</div>
                    <div className="text-accent-2">27/07/2021</div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div>Total</div>
                    <div className="text-accent-2">$40.10</div>
                  </div>

                  <div className="col-md-3 col-6">
                    <div>Payment Method</div>
                    <div className="text-accent-2">Direct Bank Transfer</div>
                  </div>
                </div>
              </div>

              <h2 className="text-30 md:text-24 fw-700 mt-60 md:mt-30">
                Order Details
              </h2>

              <div className="d-flex item-center justify-between y-gap-5 pt-30">
                <div className="text-18 fw-500">
                  Westminster Walking Tour & Westminster Abbey Entry
                </div>
                <div className="text-18 fw-500">$382</div>
              </div>

              <div className="mt-25">
                <div className="d-flex items-center justify-between">
                  <div className="fw-500">Date:</div>
                  <div className="">06 April 2023</div>
                </div>

                <div className="d-flex items-center justify-between">
                  <div className="fw-500">Time:</div>
                  <div className="">10:00 am</div>
                </div>

                <div className="d-flex items-center justify-between">
                  <div className="fw-500">Duration:</div>
                  <div className="">12 Days</div>
                </div>

                <div className="d-flex items-center justify-between">
                  <div className="fw-500">Tickets:</div>
                  <div className="">
                    Adult x2 = $98 - Youth x3 = $383 - Children x6 = $394
                  </div>
                </div>
              </div>

              <div className="line mt-30 mb-30"></div>

              <div className="d-flex item-center justify-between y-gap-5">
                <div className="text-18 fw-500">Service per booking</div>
                <div className="text-18 fw-500">$43</div>
              </div>

              <div className="line mt-30 mb-30"></div>

              <div className="d-flex item-center justify-between y-gap-5">
                <div className="text-18 fw-500">
                  Service per person 1 Adult, 2 Youth, 4 Children
                </div>
                <div className="text-18 fw-500">$125</div>
              </div>

              <div className="line mt-30 mb-30"></div>

              <div className="row justify-end">
                <div className="col-md-4">
                  <div className="d-flex items-center justify-between">
                    <div className="text-18 fw-500">Subtotal</div>
                    <div className="text-18 fw-500">$382</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="text-18 fw-500">Total</div>
                    <div className="text-18 fw-500">$23</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="text-18 fw-500">Amount Paid</div>
                    <div className="text-18 fw-500">$3.482</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="text-18 fw-500">Amount Due</div>
                    <div className="text-18 fw-500">$43.242</div>
                  </div>
                </div>
              </div>
            </div>
}
            <div className="container d-flex items-center justify-between w-100 mt-60" style={{maxWidth:'400px'}} >
           
                      <button onClick={()=>setBookingStage(pre=>pre-1)} className={`button -md -dark-1 bg-accent-1 text-white ${bookingStage == 1 ? 'hiddenButtonBooking ButtonBooking' : 'ButtonBooking'} `} >
                       Previous
                        {/* <i className="icon-arrow-top-right text-16 ml-10"></i> */}
                      </button>

                    
                      <button onClick={()=>setBookingStage(pre=>pre+1)} style={{alignSelf:'end'}}  className={`button -md -dark-1 bg-accent-1 text-white ${bookingStage == 3 ? 'hiddenButtonBooking ButtonBooking' : 'ButtonBooking'} `}>
                        Next
                        <i className="icon-arrow-top-right text-16 ml-10"></i>
                      </button>
                    </div>
            </div>

           

          

         

           
          </div>

          <div className="col-lg-4">
            <div className="pl-50 md:pl-0">
              <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20">
                <h2 className="text-20 fw-500">Your booking details</h2>

                <div className="d-flex mt-30">
                  <img src="/img/tourSingle/booking/1.png" alt="image" />
                  <div className="ml-20">
                    Zipline 18 Platform and ATV Adventure Tour From Phuket
                  </div>
                </div>

                <div className="line mt-20 mb-20"></div>

                <div className="">
                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Date:</div>
                    <div className="">06 April 2023</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Time:</div>
                    <div className="">10:00 am</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Duration:</div>
                    <div className="">12 Days</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Tickets:</div>
                    <div className="">Adult x2 = $98</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500"></div>
                    <div className="">Youth x3 = $383</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500"></div>
                    <div className="">Children x6 = $394</div>
                  </div>
                </div>

                <div className="line mt-20 mb-20"></div>

                <div className="y-gap-15">
                  <div className="d-flex justify-between">
                    <div className="fw-500">Service per booking</div>
                    <div className="">$30.00</div>
                  </div>

                  <div className="d-flex justify-between">
                    <div className="fw-500">
                      Service per person 1 Adult, 2 Youth, 4 Children
                    </div>
                    <div className="">$179.00</div>
                  </div>
                </div>

                <div className="line mt-20 mb-20"></div>

                <div className="">
                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Subtotal</div>
                    <div className="">$382</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Total</div>
                    <div className="">$23</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Amount Paid</div>
                    <div className="">$3.482</div>
                  </div>

                  <div className="d-flex items-center justify-between">
                    <div className="fw-500">Amount Due</div>
                    <div className="">$43.242</div>
                  </div>
                </div>
              </div>

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

                <button className="button -md -outline-accent-1 text-accent-1 mt-30">
                  Apply
                  <i className="icon-arrow-top-right text-16 ml-10"></i>
                </button>
              </div>

              <div className="mt-30">
                <button className="button -md -dark-1 bg-accent-1 text-white col-12">
                  Complete My Order
                  <i className="icon-arrow-top-right text-16 ml-10"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
