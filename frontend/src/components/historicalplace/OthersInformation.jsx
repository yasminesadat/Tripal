
import React from "react";

export default function OthersInformation({ OpeningHours, ticketPrices }) {
  return (
    <>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-clock"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Weekdays Timings</div>
            <div className="text-14 text-light-2 lh-16">{OpeningHours?.weekdays?.openingTime} - {OpeningHours?.weekdays?.closingTime}</div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-clock"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">WeekEnds Timings</div>
            <div className="text-14 text-light-2 lh-16">{OpeningHours?.weekends?.openingTime} - {OpeningHours?.weekends?.closingTime}</div>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Foreigner ticket Price</div>
            <div className="text-14 text-light-2 lh-16">EGP {ticketPrices?.foreigner} </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Native ticket Price</div>
            <div className="text-14 text-light-2 lh-16">EGP {ticketPrices?.native} </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-teamwork"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Student ticket Price</div>
            <div className="text-14 text-light-2 lh-16">EGP {ticketPrices?.student} </div>
          </div>
        </div>
      </div>

      {/* <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-birthday-cake"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Ages</div>
            <div className="text-14 text-light-2 lh-16">18-99 yrs</div>
          </div>
        </div>
      </div> */}

      {/* <div className="col-lg-3 col-6">
        <div className="d-flex items-center">
          <div className="flex-center size-50 rounded-12 border-1">
            <i className="text-20 icon-translate"></i>
          </div>

          <div className="ml-10">
            <div className="lh-16">Languages</div>
            <div className="text-14 text-light-2 lh-16">English, Japanese</div>
          </div>
        </div>
      </div> */}
    </>
  );
}

