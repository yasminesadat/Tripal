import React from "react";
import Stars from "../../common/Stars";

export default function ItineraryMainInformation({ itinerary }) {
  return (
    <>
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
            <div className="col-auto">
              <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                Bestseller
              </button>
            </div>
            <div className="col-auto">
              <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                Free cancellation
              </button>
            </div>
          </div>

          <h2 className="text-40 sm:text-30 lh-14 mt-20">
          {itinerary?.title} </h2>
          <h3 className="text-20 sm:text-16 text-light-2 mt-10">
            {itinerary?.description}
          </h3>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={itinerary?.averageRating} font={12} />
                </div>
                {itinerary?.averageRating} ({itinerary.bookings.length})
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-pin text-16 mr-5"></i>
                {itinerary?.locations[0].split(",")[0]}  
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-reservation text-16 mr-5"></i>
                20K+ booked
              </div>
            </div>
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex x-gap-30 y-gap-10">
            <a href="#" className="d-flex items-center" style={{color: 'grey'}}>
              <i className="icon-share flex-center text-16 mr-10"></i>
              Share
            </a>

            <a href="#" className="d-flex items-center" style={{color: 'grey'}}>
              <i className="icon-heart flex-center text-16 mr-10" ></i>
              Wishlist
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
