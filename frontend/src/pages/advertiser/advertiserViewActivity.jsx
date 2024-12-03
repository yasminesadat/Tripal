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
import { useNavigate } from "react-router-dom";
import { Button, notification } from "antd";
import { deleteActivity } from "../../api/ActivityService";
import { DollarOutlined ,TagOutlined,PartitionOutlined ,WalletOutlined,PercentageOutlined } from '@ant-design/icons';
import AdvertiserGallery from "../../components/tourSingle/Galleries/AdvertiserGallery";
import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";


export default function AdvertiserActivityDetails() {
  const location = useLocation();
  const activity = location.state?.activity;
  console.log(activity)
  const navigate = useNavigate();

  if (!activity) return <div>Activity not found.</div>;

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      notification.success({
        message: 'Success',
        description: 'Activity deleted successfully!',
        placement: 'topRight',
      });
      setTimeout(() => navigate(`/advertiser/activities`), 1000);
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };

  return (
    <div>
            <AdvertiserHeader />

      <div class="dashboard__content_content" style={{ marginTop: "70px" }}>

       <AdvertiserGallery />
        <section className="">
          <div className="container">
            <h2 className="text-40 sm:text-30 lh-14 mt-20">
              {activity?.title.split(" ").slice(0, 7).join(" ")}

              <br />
              {activity?.title.split(" ").slice(7).join(" ")}
            </h2>
            <br />
            <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <i className="icon-pin mr-5"></i>
              <div className="text-20"> {activity?.location}</div>
            </div>
            <div className="d-flex align-items-center">
              <i className="icon-clock mr-5"></i>
              <div className="text-20">Date: {new Date(activity.date).toLocaleDateString()}</div>
              <span className="mx-2">•</span>
              <div className="text-20">Time: {activity.time}</div>
            </div>
          </div>

          </div>
        </section>

        <section className="layout-pt-md js-pin-container">
          <div className="container">
            <div className="row y-gap-30 justify-between">
              <div className="col-lg-12">


                <div className="row y-gap-20 col-lg-8 justify-between items-center layout-pb-md" style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
                  <div className="col-lg-3 col-6">
                    <div className="d-flex items-center">
                      <div className="flex-center size-50 rounded-12 border-1">
                        <DollarOutlined />
                      </div>
                      <div className="ml-10">
                        <div className="lh-16">Price</div>
                        <div className="text-14 text-light-2 lh-16">EGP {activity.price}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-6">
                    <div className="d-flex items-center">
                      <div className="flex-center size-50 rounded-12 border-1">
                      <PartitionOutlined />
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
                      <WalletOutlined />
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
                      <PercentageOutlined />
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
                <p className="col-lg-8 mt-20 text-20">
                  {activity.description}
                </p>
                <br/>

                  <div >
                    <div className="d-flex items-center">
                      <div className="flex-center size-50 rounded-12 border-1">
                      <TagOutlined />
                      </div>
                      <div className="ml-10">
                        <div className="lh-16">Tags</div>
                        <div className="text-14 text-light-2 lh-16">
                          {activity?.tags && activity?.tags.length > 0 ? (
                            activity.tags.map((tag) => tag.name).join(",   ")
                          ) : (
                            "No tags available"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                {/* <div className="line mt-60 mb-60"></div>

              <h2 className="text-30">Customer Reviews</h2>

              <div className="mt-30">
                <Rating />
              </div>

              <ActivityReviews activityId={activityId} /> */}

              </div>


              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <Button
                  className="button -md -outline-accent-1 text-accent-1 "
                  onClick={() => navigate(`/update-activity/${activity._id}`, { state: { activity } })}
                >
                  Update
                  <i className="icon-arrow-top-right text-16 ml-10"></i>
                </Button>
                <Button
                 className="button -md -dark-1 bg-accent-1 text-white"
                  onClick={() => handleDeleteActivity(activity._id)}

                >
                  Delete Activity
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}