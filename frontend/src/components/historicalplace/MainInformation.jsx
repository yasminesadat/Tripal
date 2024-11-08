
import React from "react";
// import Stars from "../common/Stars";
import { useParams } from "react-router-dom";

export default function MainInformation({historicalPlace}) {
  
  return (
    <>
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
            {historicalPlace?.tags?.map((tag)=>
            <div className="col-auto">
              <button className="button -accent-1 text-14 py-5 px-15 bg-light-1 rounded-200">
               {tag?.name}
              </button>
            </div>
            )}
             {historicalPlace?.historicalPeriod?.map((tag)=>
            <div className="col-auto">
              <button className="button -accent-1 text-14 py-5 px-15 bg-light-1 rounded-200">
               {tag?.name}
              </button>
            </div>
            )}
            </div>
          <h2 className="text-40 sm:text-30 lh-14 mt-20">
            {historicalPlace?.name?.split(" ").slice(0, 7).join(" ")}

            <br />
            {historicalPlace?.name?.split(" ").slice(7).join(" ")}
          </h2>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            {/* <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={tour?.rating} font={12} />
                </div>
                {tour?.rating} ({tour.ratingCount})
              </div>
            </div> */}

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-pin text-16 mr-5"></i>
                {historicalPlace?.location?.address}
              </div>
            </div>

            {/* <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-reservation text-16 mr-5"></i>
                30K+ booked
              </div>
            </div>*/}
          </div>
        </div> 

        <div className="col-auto">
          <div className="d-flex x-gap-30 y-gap-10">
            <a href="#" className="d-flex items-center">
              <i className="icon-share flex-center text-16 mr-10"></i>
              Share
            </a>

            {/* <a href="#" className="d-flex items-center">
              <i className="icon-heart flex-center text-16 mr-10"></i>
              Wishlist
            </a> */}
          </div>
        </div>
      </div>
    </>
  );
}


