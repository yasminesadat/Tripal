import Spinner from "@/components/common/Spinner";
import Stars from "../../common/Stars";
import { message } from "antd";
import { Flag, Pencil,CircleX,ShieldMinus,ShieldCheck } from 'lucide-react';
import { flagItinerary } from "@/api/AdminService";

const handleShare = (link) => {
  if (navigator.share) {
    navigator
      .share({
        title: "Check out this itinerary!",
        url: link,
      })
      .catch(() => {
        message.error("Failed to share");
      });
  } else {
    window.location.href = `mailto:?subject=Check out this itinerary!&body=Check out this link: ${link}`;
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const handleFlag = (id) => {
  console.log(`Flagging itinerary with ID: ${id}`);
};


export default function ItineraryMainInformation({
  itinerary,
  userRole,
  onDeactivateItinerary,
  onDeleteItinerary,
  onEditItinerary,
   }) {

  if (!itinerary) return <div><Spinner/></div>;

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
            {itinerary?.title}
          </h2>
          <h3 className="text-20 sm:text-16 text-light-2 mt-10">
            {itinerary?.description}
          </h3>

          <div className="row x-gap-20 y-gap-20 items-center pt-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={itinerary?.averageRating} font={12} />
                </div>
                {itinerary?.averageRating.toFixed(2)} (
                {itinerary.bookings.length})
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-calendar mr-10"></i>
                {formatDate(itinerary?.startDate)}
              </div>
            </div>
          </div>
        </div>

        {userRole === "Tourist" && (
          <div className="col-auto">
            <div className="d-flex x-gap-30 y-gap-10">
              <a
                className="d-flex items-center"
                style={{ color: "grey" }}
                onClick={() =>
                  handleShare(
                    `${window.location.origin}/itinerary/${itinerary._id}`
                  )
                }
              >
                <i className="icon-share flex-center text-16 mr-10"></i>
                Share
              </a>
              <a href="#" className="d-flex items-center" style={{ color: "grey" }}>
                <i className="icon-heart flex-center text-16 mr-10"></i>
                Wishlist
              </a>
            </div>
          </div>
        )}

        {userRole === "Tour Guide" && (
          <div className="col-auto">
            <div className="d-flex x-gap-30 y-gap-10">
              <button
                className="action-button edit"
                style={{ color: "grey" }}
                onClick={() =>
                  onEditItinerary(itinerary._id)
                }
              >
                <Pencil size={16} className="mr-10" />
                Edit Details
              </button>
              <button
                className="action-button deactivate"
                style={{ color: "grey" }}
                onClick={() =>
                  onDeactivateItinerary(itinerary._id)
                }
              >
                <ShieldMinus size={16} className="mr-10" />
                Deactivate
              </button>
              <button
                className="action-button delete"
                style={{ color: "red" }}
                onClick={() =>
                  onDeleteItinerary(itinerary._id)
                }
              >
                <CircleX size={16} className="mr-10" />
                Delete
              </button>
            </div>
          </div>
        )}

        {userRole === "Admin" && (
          <div className="col-auto">
            <button
              className="flag-button"
              onClick={() => handleFlag(itinerary._id)}
            >
              <Flag size={16} className="mr-10"/>
              Flag
            </button>
          </div>
        )}
      </div>
      <style>
      {`
        .action-button {
          display: flex;
          align-items: center;
          font-size: 14px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        .action-button.edit {
          color: #007BFF;
          background-color: transparent;
        }

        .action-button.edit:hover {
          color: #007BFF;
          background-color: #e7f3ff;
        }

        .action-button.deactivate {
          color: #FFC107; /* Yellow/Orange for deactivate */
          background-color: transparent;
        }

        .action-button.deactivate:hover {
          background-color: #fff4d1; /* Light yellow on hover */
          color: #FFC107;
        }

        .action-button.delete {
          color: red; /* Red for delete */
          background-color: transparent;
        }

        .action-button.delete:hover {
          background-color: #ffe6e6;

        }
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
