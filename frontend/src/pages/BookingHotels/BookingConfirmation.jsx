import { useState, useEffect } from "react";
import CreditCard from "./Components/Payment";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import img from "./Components/HotelsImages/bookingicon2.png";
import MetaComponent from "@/components/common/MetaComponent";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import {message} from 'antd';
import { getTouristUserName } from "@/api/TouristService";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";

export default function BookingPages() {
  const metadata = {
    title: "Home || Tripal - Travel Agency",
  };
  const [isBookedOriginatingTransportation, setIsBookedOriginatingTransportation] = useState(false);
  const [isBookedReturnTransportation, setIsBookedReturnTransportation] = useState(false);
  const [isBookedAccepted, setIsBookedAccepted] = useState(false);
  const [bookingStage, setBookingStage] = useState(2);
  const [total, setTotal] = useState(0);
  const [userName,setUserName]=useState("")

  const today = new Date();
  const {
    cityCode,
    hotelID,
    name,
    singlePrice,
    singleNumber,
    doublePrice,
    doubleNumber,
    triplePrice,
    tripleNumber,
    boardType,
    checkIn,
    checkOut,
   
  } = useParams();

  const date1=  format((new Date(checkIn)), 'dd MMMM yyyy');
  const date2=  format((new Date(checkOut)), 'dd MMMM yyyy');

  
  const [exchangeRate, setExchangeRate] = useState(1);

  const [currency, setCurrency] = useState( "EGP");

  const getExchangeRate = async () => {
    if (currency) {
      const rate = await getConversionRate(currency);
      setExchangeRate(rate);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1);  return () => clearInterval(intervalId);
  }, [currency]);


  const fetchUserName= async() => {
    try{
    console.log("hi")  
    const name = await getTouristUserName();
    console.log("hi",name.userName)
    setUserName(name.userName)
    }
    catch(error)
    {
     message.error(error.message)
    }
}


  useEffect(() => {
    const calculatedTotal = (
      (isNaN(singlePrice) ? 0 : singlePrice) * singleNumber  +
      (isNaN(doublePrice) ? 0 : doublePrice) * doubleNumber  +
      (isNaN(triplePrice) ? 0 : triplePrice) * tripleNumber 
    ).toFixed(2);
    setTotal(calculatedTotal);
    fetchUserName()
    
  }, [
    singleNumber,
    doubleNumber,
    tripleNumber,
    singlePrice,
    doublePrice,
    triplePrice,
  ]);

  return (

    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content">
          <section className="layout-pt-md layout-pb-lg mt-header">
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div
                    className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20 mt-30 flex justify-center items-center"
                    style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
                  >
                    {bookingStage === 2 && (
                      <div>
                        <h2 className="text-30 md:text-24 fw-700 mb-30">
                          How do you want to pay?
                        </h2>

                        <div className="tabs -pills-3 js-tabs">
                          <CreditCard
                            bookingStage={bookingStage}
                            setBookingStage={setBookingStage}
                            cityCode={cityCode}
                            hotelid={hotelID}
                            hotelname={name}
                            singleNumber={singleNumber}
                            singlePrice={singlePrice}
                            doublePrice={doublePrice}
                            triplePrice={triplePrice}
                            doubleNumber={doubleNumber}
                            tripleNumber={tripleNumber}
                            total={total}
                            checkIn={checkIn}
                            checkOut={checkOut}
                            setIsBookedOriginatingTransportation={setIsBookedOriginatingTransportation}
                            setIsBookedReturnTransportation={setIsBookedReturnTransportation}
                            setIsBookedAccepted={setIsBookedAccepted}
                            isBookedOriginatingTransportation={isBookedOriginatingTransportation}
                            isBookedReturnTransportation={isBookedReturnTransportation}
                            isBookedAccepted={isBookedAccepted}
                          />
                        </div>
                      </div>
                    )}
                    {bookingStage == 3 && (

                      <div>
                        <div className="d-flex flex-column items-center text-center">
                          <div className="size-80 rounded-full flex-center bg-accent-1 text-white" >
                            <i className="icon-check text-26"></i>
                          </div>

                          <h2 className="text-30 md:text-24 fw-700 mt-20">
                            {userName}, your order was submitted successfully!
                          </h2>
                          <div className="mt-10">
                            Booking details has been sent to: booking@tourz.com
                          </div>
                        </div>

                        <div className="border-dashed-1 py-30 px-50 rounded-12 mt-30" style={{ color: "var(--color-light-purple" }}>
                          <div className="row y-gap-15">
                            <div className="col-md-3 col-6" >
                              <div>Order Number</div>
                              <div className="text-accent-2" style={{ color: "var(--color-dark-purple" }}>13119</div>
                            </div>

                            <div className="col-md-3 col-6">
                              <div>Date of Booking</div>
                              <div className="text-accent-2" style={{ color: "var(--color-dark-purple" }}>
                                {format(today, "MMMM dd, yyyy")}
                              </div>
                            </div>

                            <div className="col-md-3 col-6">
                              <div>Total</div>
                              <div className="text-accent-2" style={{ color: "var(--color-dark-purple" }}>
                                {currency} {total*exchangeRate}
                              </div>
                            </div>

                            <div className="col-md-3 col-6">
                              <div>Payment Method</div>
                              <div className="text-accent-2" style={{ color: "var(--color-dark-purple" }}>Online Payment</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="pl-50 md:pl-0">
                    <div className="bg-white rounded-12 shadow-2 py-30 px-30 md:py-20 md:px-20">
                      <h2 className="text-20 fw-500" style={{ color: "var(--color-dark-purple" }}>Your Booking Details</h2>

                      <div className="d-flex mt-30">
                        <img src={img} alt="image" />
                        <div className="ml-20"  >{name}</div>
                      </div>

                      <div className="line mt-20 mb-20"></div>

                      <div className="">
                        <div className="d-flex items-center justify-between">
                          <div className="fw-500">CheckIn Date: {date1}</div>
                          <div className="">{}</div>
                        </div>

                        <div className="line mt-10 mb-10"></div>
                        <div className="d-flex items-center justify-between">
                          <div className="fw-500">CheckOut Date: {date2}</div>
                          <div className="">{}</div>
                        </div>
                        <div className="line mt-10 mb-10"></div>

                        {singleNumber > 0 && (
                          <div className="d-flex items-center justify-between">
                            <div className="fw-500">Single Rooms:</div>
                            <div className="">
                              {singleNumber} x {Math.round(singlePrice * exchangeRate)} = {currency}{" "}
                              {Math.round(singleNumber * singlePrice * exchangeRate)}
                            </div>
                          </div>
                        )}

                        {doubleNumber > 0 && (
                          <div className="d-flex items-center justify-between">
                            <div className="fw-500">Double Rooms:</div>
                            <div className="">
                              {doubleNumber} x {Math.round(doublePrice*exchangeRate)} = {currency}{" "}
                              {Math.round(doubleNumber * doublePrice*exchangeRate)}
                            </div>
                          </div>
                        )}

                        {tripleNumber > 0 && (
                          <div className="d-flex items-center justify-between">
                            <div className="fw-500">Triple Rooms:</div>
                            <div className="">
                              {tripleNumber} x {Math.round(triplePrice * exchangeRate)} = {currency}{" "}
                              {Math.round(tripleNumber * triplePrice * exchangeRate)}
                            </div>
                          </div>
                        )}
                        <div className="line mt-10 mb-10"></div>

                        <div className="d-flex items-center justify-between">
                          <div className="fw-500">Board Type:</div>
                          <div className="">{boardType} </div>
                        </div>

                        {isBookedAccepted && (isBookedOriginatingTransportation || isBookedReturnTransportation) && <div className="d-flex items-center justify-between">
                          <div className="fw-500">+ FREE TRANSPORTATION</div>
                        </div>}

                      </div>

                      <div className="line mt-20 mb-20"></div>

                      <div className="">
                        <div className="d-flex items-center justify-between">
                          <div className="fw-500">Total : </div>
                          <div className="">
                            {currency} {Math.round(total*exchangeRate)}
                          </div>
                        </div>
                      </div>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </section>        </main>
        <FooterThree />
      </div>
    </>
  );
}