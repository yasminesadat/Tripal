import Stars from "../../common/Stars";
import { message } from "antd";
import { Flag } from 'lucide-react';
import { flagActivity } from "@/api/AdminService";

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

const handleFlag = async (activityId) => {
  try {
    await flagActivity(activityId);
    message.success("Activity has been flagged successfully");
    
  } catch (error) {
    message.error("Failed to flag activity");
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');  
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export default function ActivityMainInformation({ activity, role }) {
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

        {role ==='Tourist' ? (<div className="col-auto">
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

            <a
              href="#"
              className="d-flex items-center"
              style={{ color: "grey" }}
            >
              <i className="icon-heart flex-center text-16 mr-10"></i>
              Wishlist
            </a>
          </div>
        </div>):role === 'Admin' ? (
      <div className="col-auto">
        <button className="flag-button" onClick={() => handleFlag(activity._id)}>
          <Flag size={16} />
          Flag
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
        `}
      </style>
    </>
  );
}
