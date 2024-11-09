import React, { useState, useEffect, useRef } from "react";
import MainInformation from "./Components/MainInformation";
import OthersInformation from "./Components/OthersInformation";
import Overview from "./Components/Overview";
import Included from "./Components/Included";
import Map from "./Components/Map";
import Faq from "./Components/Faq";
import Rating from "./Components/Rating";
import Reviews from "./Components/Reviews";
import TourSingleSidebar from "./Components/TourSingleSidebar";
import Gallery1 from "./Components/Gallery1";
import DateCalender from "./Components/DateCalendar";
import RoadMap2 from "./Components/Roadmap2";
import CommentBox from "./Components/CommentBox";
import { useParams } from "react-router-dom";



export default function HotelDetails() {
    const {cityCode,name,hotelID}  = useParams();
    console.log("1111",name);

  return (
    <>
      <section>
                <div className="container">
                    <MainInformation name={name} /> {/* Pass hotelID as a prop */}
                    <Gallery1 />
                </div>
            </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                <OthersInformation />
              </div>

              <Overview />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">What's included</h2>

              <Included />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Itinerary</h2>

              <RoadMap2 />

              {/* <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
              <div className="mapTourSingle">
                <Map />
              </div> */}

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Availability Calendar</h2>
              <DateCalender />

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">FAQ</h2>

              <div className="accordion -simple row y-gap-20 mt-30 js-accordion">
                <Faq />
              </div>

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                <Rating />
              </div>

              <Reviews />

              <button className="button -md -outline-accent-1 text-accent-1 mt-30">
                See more reviews
                <i className="icon-arrow-top-right text-16 ml-10"></i>
              </button>
              <CommentBox />
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-end js-pin-content">
                <TourSingleSidebar cityCode={cityCode} hotelID={hotelID} name={name} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
