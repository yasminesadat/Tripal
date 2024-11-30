import Stars from "../../common/Stars";
import { message } from "antd";
import { Flag,FlagOff  } from 'lucide-react';
import { flagActivity } from "@/api/AdminService";
import {bookmarkEvent} from "@/api/TouristService";
import { useState,useEffect } from "react";
import Spinner from "@/components/common/Spinner";
import { getActivityById } from "@/api/ActivityService";

//const [isBookmarked, setIsBookmarked] = useState(false);

//#region 1. functions
const handleShare = (link) => {
  if (navigator.share) {
    navigator
      .share({
        title: "Check out this itinerary!",
        url: link,
      })
      .catch((error) => {
        message.error("Failed to share");
      });
  } else {
    window.location.href = `mailto:?subject=Check out this itinerary!&body=Check out this link: ${link}`;
  }
};

const handleBookmark = async (eventId, eventType) => {
  try {
    const data = await bookmarkEvent(eventId, eventType);
    //setIsBookmarked(true);
    message.success("Added to Bookmarked Events")
  } catch (error) {
    console.error('Error bookmarking event:', error);
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');  
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
//#endregion

export default function ActivityMainInformation({ activity: initialActivity, userRole }) {
  
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState(initialActivity);
  
  //#region 2. useEffect/methods
  const handleFlag = async (activityId, currentFlagStatus) => {
    const updatedFlagStatus = !currentFlagStatus;
    setLoading(true);
    try {
      await flagActivity(activityId);
      setActivity((prevActivity) =>( { 
        ...prevActivity, 
        flagged: updatedFlagStatus 
      }));
      message.success(`Activity ${updatedFlagStatus ? "flagged" : "unflagged"} successfully.`);
    } catch (error) {
      message.error(error.response?.data?.message ||error.response?.data?.error|| "Failed to update activity flag status.");
    } finally {
      //having the effect of reloading page
      fetchActivities(activityId);
      setLoading(false);     
    }
  };
  
  const fetchActivities = async (activityId) => {
    try {
      if(userRole !== "Admin") return;
      const response = await getActivityById(activityId);
      setActivity(response.data);
    } catch (error) {
      message.error("Failed to fetch activities.");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);
  //#endregion
  
  if (loading || !activity) return <div><Spinner/></div>; 

  return (
    <>
      <div className="row y-gap-20 justify-between items-end">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10 items-center">
          <div className="col-auto">
              <button className="button-custom text-14 py-5 px-15 rounded-200">
                Bestseller
              </button>
            </div>
            <div className="col-auto">
              <button className="button-custom text-14 py-5 px-15 rounded-200">
                Free cancellation
              </button>
            </div>
          </div>

          <h2 className="text-40 sm:text-30 lh-14 mt-20">
            {activity?.title}

            <br />
            {activity?.title.split(" ").slice(7).join(" ")}
          </h2>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={activity?.averageRating} font={12} />
                </div>
                {activity?.averageRating.toFixed(2)} ({activity.totalRatings}
                )
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-pin text-16 mr-5"></i>
                {activity?.location}
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-calendar mr-10"></i> 
                {formatDate(activity?.date)}
              </div>
            </div>
          </div>
        </div>

        {userRole ==='Tourist' ? (<div className="col-auto">
          <div className="d-flex x-gap-30 y-gap-10">
            <a
              className="d-flex items-center"
              style={{ color: "grey" }}
              onClick={() =>
                handleShare(
                  `${window.location.origin}/activities/${activity._id}`
                )
              }
            >
              <i className="icon-share flex-center text-16 mr-10"></i>
              Share
            </a>

            <div
              className="d-flex items-center"
              style={{ color: "grey" }}
            >
              <i
                className="icon-heart flex-center text-16 mr-10"
                style={{ cursor: "pointer" }}
                onClick={() => handleBookmark(activity._id, "activity")}
              ></i>
              Add to Wishlist
            </div>
          </div>
        </div>)
        :userRole === 'Admin' ? (
      <div className="col-auto">
        <button className="flag-button" onClick={() => handleFlag(activity._id, activity.flagged)}>
               {!activity.flagged? 
               <FlagOff  size={16} className="mr-10" />:
                <Flag size={16} className="mr-10" />}
                {activity.flagged ? 
                "Unflag" :
                 "Flag"}
              </button>
        </div>
      ) : null}
                
      </div>
      <style>
        {`
          .flag-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ff4d4f;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 15px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .flag-button:hover {
            background-color: #d9363e;
          }

          .flag-icon {
            margin-right: 8px;
          }

          .flag-button:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.5);
          }
          .button-custom {
            background-color: var(--color-stone-light);
            color: white; 
            border: 1px solid var(--color-stone-light);
            transition: background-color 0.3s, color 0.3s;
          }

          .button-custom:hover {
            background-color: var(--color-stone);
            border: 1px solid var(--color-stone);
            color: white;`
        }
      </style>
    </>
  );
}