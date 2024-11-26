import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";

const FlightInvoice = () => {
  const location = useLocation();
  const flight = location.state?.flight;
  const tourist = location.state?.touristInfo;
  const currency = location.state?.currency;
  const exchangeRate = location.state?.exchangeRate;
  const isBookedAccepted = location.state?.isBookedAccepted;
  const isBookedOriginatingTransportation = location.state?.isBookedOriginatingTransportation;
  const isBookedReturnTransportation = location.state?.isBookedReturnTransportation;
  
  

  const convertPrice = (price) => {
    return (price * exchangeRate).toFixed(2);
  };

  const parseDuration = (duration) => {
    const regex = /^PT(\d+H)?(\d+M)?$/;
    const match = duration.match(regex);
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    return `${hours} hours and ${minutes} minutes`;
  };

  const today = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  const handlePrintClick = () => {
    window.print();
  };

  if (!flight) return <p>No flight details available</p>;

  return (
    <>
      <MetaComponent title="Flight Invoice" />
      <TouristHeader />
      <div className="invoice-container" style={{ margin: 0, padding: 0, backgroundColor: '#f4f4f4' }}>
        <style>{`
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            body * {
              visibility: hidden;
            }
            .invoice-container, .invoice-container * {
              visibility: visible;
            }
            .invoice-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print-hide {
              display: none !important;
            }
          }
        `}</style>

        <div className="container-fluid px-0">
          <div className="row justify-center mx-0">
            <div className="col-xl-11 col-lg-12 px-0">
              <div className="bg-white rounded-0">
                <div className="layout-pt-md layout-pb-md px-50 md:px-20">
                  <div className="row justify-between align-items-center mb-4">
                  <div className="row justify-center my-5">
                    <div className="col-auto text-center">
                      <div className="d-flex align-items-center">
                        <div className="text-40 fw-600 mr-2">Invoice #</div>
                        <div className="text-40 fw-500">
                          {flight.itineraries[0]?.segments[0]?.carrierCode || "N/A"}
                          {flight.itineraries[0]?.segments[0]?.number || ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  </div>

                  {/* Print Button - Positioned at top right */}
                  <div className="position-absolute top-0 center-0 mt-3 mr-3 print-hide">
                    <button 
                      onClick={handlePrintClick} 
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#8f5774',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '20px'
                      }}
                    >
                      Print Boarding Pass
                    </button>
                  </div>
                  <div className="row justify-between pt-50">
                    <div className="col-auto">
                      <div className="text-20">Invoice date:</div>
                      <div className="text-20 fw-500 lh-15">{today}</div>
                    </div>

                    <div className="col-xl-4">
                      <div className="text-20">Travel Date:</div>
                      <div className="text-20 fw-500 lh-15">
                        {new Date(flight.itineraries[0]?.segments[0]?.departure?.at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Passenger and Flight Details */}
                  <div className="row justify-between pt-50">
                    <div className="col-auto">
                      <div className="text-30 fw-500">Passenger Details</div>
                      <div className="text-20 fw-500 mt-20">Passenger's Username: {tourist?.userName || "N/A"}</div>
                      <div className="text-20 mt-10">Passenger's Email: {tourist?.email || "N/A"}</div>
                    </div>

                    <div className="col-xl-4">
                      <div className="text-30 fw-500">Flight Details</div>
                      <div className="text-20 fw-500 mt-20">
                        {flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"} Airlines
                      </div>
                      <div className="text-20 mt-10">
                        {flight.itineraries.map((itinerary, idx) => (
                          <div key={idx}>
                            {idx + 1} Flight (s) : {itinerary?.segments[0]?.departure?.iataCode} 
                            → {itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="row pt-50">
                    <div className="col-12">
                      <table className="table col-12" style={{ fontSize: '20px' }}>
                        <thead className="bg-light-1">
                          <tr>
                            <th className="fw-700">Flight</th>
                            <th className="fw-500">Departure</th>
                            <th className="fw-500">Arrival</th>
                            <th className="fw-500">Duration</th>
                            <th className="fw-500">Price</th>
                            <th className="fw-500">Transportation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flight.itineraries.map((itinerary, idx) => (
                            <tr key={idx}>
                              <td>
                                {itinerary?.segments[0]?.carrierCode || "N/A"}
                                {itinerary?.segments[0]?.number || ""}
                              </td>
                              <td>
                                {itinerary?.segments[0]?.departure?.iataCode} 
                                <br />
                                {new Date(itinerary?.segments[0]?.departure?.at).toLocaleString()}
                              </td>
                              <td>
                                {itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode}
                                <br />
                                {new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at).toLocaleString()}
                              </td>
                              <td>{parseDuration(itinerary?.segments[0]?.duration || "PT0H0M")}</td>
                              <td>
                                {currency} {convertPrice(flight.price.total)}
                              </td>
                              <td>
                                {(isBookedAccepted && isBookedOriginatingTransportation && idx === 0) || 
                                (isBookedAccepted && isBookedReturnTransportation && idx === 1) ? 
                                "FREE TRANSPORTATION" : "N/A"}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="4" className="text-18 fw-500 text-right">Total Due</td>
                            <td colSpan="2" className="text-18 fw-500">
                              {currency} {convertPrice(flight.price.total)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer with Print Button
                <div className="border-1-top py-40 text-center">
                  <div className="print-hide mb-4">
                    <button 
                      onClick={handlePrintClick} 
                      className="btn btn-lg"
                      style={{
                        backgroundColor: '#8f5774',
                        color: 'white',
                        padding: '10px 30px',
                        borderRadius: '5px',
                        fontSize: '18px'
                      }}
                    >
                      Print Boarding Pass
                    </button>
                  </div>
                  <div className="row x-gap-60 y-gap-10 justify-center">
                    <div className="col-auto">
                      <a href="#" className="text-14">www.tripal.com</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="text-14">invoice@tripal.com</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="text-14">(+20) 123-456-789</a>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterThree />
    </>
  );
};

export default FlightInvoice;
