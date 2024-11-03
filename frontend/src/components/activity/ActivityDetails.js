import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import MainInformation from "./MainInformation";
import OthersInformation from "./OthersInformation";
import Overview from "./Overview";
import MapComponent from "../common/MapComponent";
import Rating from "./Rating";
import Reviews from "./Reviews";
import TourSingleSidebar from "./TourSingleSidebar";
import Gallery1 from "./Gallery1";
import DateCalender from "./DateCalender";
import CommentBox from "../common/CommentBox";
import ActivityComments from "./ActivityComments"; 

export default function ActivityDetails({ activity }) {
  if (!activity) return <div>Activity not found.</div>;
  const activityId = activity._id;
  const userId = '670d4e900cb9ea7937cc9968';

  return (
    <>
      <section className="">
        <div className="container">
          <MainInformation activity={activity} />
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

              <h2 className="text-30 mt-60 mb-30">Tour Map</h2>
              <div className="mapTourSingle">
                <MapComponent />
              </div>

              <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Availability Calendar</h2>
              <DateCalender />

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

              <div className="line mt-60 mb-60"></div>

              <CommentBox activityId={activityId} userId={userId}/>

              <div className="line mt-60 mb-60"></div>

              <ActivityComments activityId={activityId} />
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-end js-pin-content">
                <TourSingleSidebar />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
