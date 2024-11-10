import { useLocation } from "react-router-dom";
// import ActivityMainInformation from "./ActivityMainInformation";
// import OthersInformation from "./OthersInformation";
// import Overview from "./Overview";
// import MapComponent from "../../common/MapComponent";
// import Rating from "./Rating";
// import TourSingleSidebar from "./TourSingleSidebar";
// import Gallery1 from "./Gallery1";
// import DateCalender from "./DateCalender";
// import ReviewBox from "../../common/reviewBox";
// import ActivityReviews from "./ActivityReviews";
import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Button, notification } from "antd";
import { deleteActivity } from "../../api/ActivityService";
import {advertiserID} from "../../IDs"
import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar"

export default function AdvertiserActivityDetails() {
  const location = useLocation();
  const activity = location.state?.activity;
  console.log(activity)
  const navigate = useNavigate();
console.log(advertiserID)

  if (!activity) return <div>Activity not found.</div>;
  
  const handleDeleteActivity = async (id) => {  
    try {
      await deleteActivity(id);
      notification.success({
        message: 'Success',
        description: 'Activity deleted successfully!',
        placement: 'topRight',
      });
      setTimeout(() => navigate(`/advertiser/activities/${advertiserID}`), 1000);
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };

  return (
    <div class="dashboard__content_content" >
      <AdvertiserNavBar /> {/*to be removed just for the ease of navigation*/}
      <section className="">
        <div className="container">
            <h2 className="text-40 sm:text-30 lh-14 mt-20">
            {activity?.title.split(" ").slice(0, 7).join(" ")}

            <br />
            {activity?.title.split(" ").slice(7).join(" ")}
            </h2>

            <div className="row x-gap-20 y-gap-20 items-center pt-20">

                <div className="col-auto">
                    <div className="d-flex items-center">
                    <i className="icon-pin text-16 mr-5"></i>
                    {activity?.location}
                    </div>
                </div>
                <div class="text-right md:text-left">
                <i class="icon-clock mr-5"></i>
                <div class="text-14">Date: {new Date(activity.date).toLocaleDateString()}</div>
                <div class="text-14">Time: {activity.time}</div>
              </div>

            </div>
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <div className="row y-gap-20 justify-between items-center layout-pb-md">
                <div className="col-lg-3 col-6">
                  <div className="d-flex items-center">
                    <div className="flex-center size-50 rounded-12 border-1">
                      <i className="text-20 icon-money"></i>
                    </div>
                    <div className="ml-10">
                      <div className="lh-16">Price</div>
                      <div className="text-14 text-light-2 lh-16">${activity.price}</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="d-flex items-center">
                    <div className="flex-center size-50 rounded-12 border-1">
                      <i className="text-20 icon-tag"></i>
                    </div>
                    <div className="ml-10">
                      <div className="lh-16">Tags</div>
                      <div className="text-14 text-light-2 lh-16">
                        {activity?.tags && activity?.tags.length > 0 ? (
                          activity.tags.map((tag) => tag.name).join(", ")
                        ) : (
                          "No tags available"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="d-flex items-center">
                    <div className="flex-center size-50 rounded-12 border-1">
                      <i className="text-20 icon-category"></i>
                    </div>
                    <div className="ml-10">
                      <div className="lh-16">Category</div>
                      <div className="text-14 text-light-2 lh-16">
                          {activity.category ? activity.category.Name : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="d-flex items-center">
                    <div className="flex-center size-50 rounded-12 border-1">
                      <i className="text-20 icon-ticket"></i>
                    </div>
                    <div className="ml-10">
                      <div className="lh-16">Booking Status</div>
                      <div className="text-14 text-light-2 lh-16">
                        {activity.isBookingOpen ? "Open" : "Closed"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="d-flex items-center">
                    <div className="flex-center size-50 rounded-12 border-1">
                      <i className="text-20 icon-ticket"></i>
                    </div>
                    <div className="ml-10">
                      <div className="lh-16">Discounts</div>
                      <div className="text-14 text-light-2 lh-16">
                          {activity.specialDiscounts || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>

              <h2 className="text-30">Activity Description</h2>
                <p className="mt-20">
                  {activity.description}
                </p>

              {/* <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                <Rating />
              </div>

              <ActivityReviews activityId={activityId} /> */}

            </div>


            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <Button
                  type="default"
                  style={{
                    backgroundColor: "#003DA5",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                  onClick={() => navigate(`/update-activity/${activity._id}`, { state: { activity } })}
                >
                  Update
                </Button>
                <Button
                  type="danger"
                  style={{
                    backgroundColor: "#f08080",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "12px 20px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleDeleteActivity(activity._id)}
                  
                >
                  Delete
                </Button>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}