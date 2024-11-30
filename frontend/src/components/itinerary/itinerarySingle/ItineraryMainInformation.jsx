import Spinner from "@/components/common/Spinner";
import Stars from "../../common/Stars";
import { message } from "antd";
import { Flag, Pencil,CircleX,ShieldMinus,ShieldCheck } from 'lucide-react';
import { flagItinerary } from "@/api/AdminService";
import { deleteItinerary, getItinerariesByTourGuide, toggleItineraryStatus,updateItinerary } from "@/api/ItineraryService";
import  { useState, useEffect } from "react";
import AreYouSure from "@/components/common/AreYouSure";
import { useNavigate } from "react-router-dom";
import UpdateItineraryModal from "../UpdateItineraryForm";

//#region 1. methods
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
//#endregion

export default function ItineraryMainInformation({
  itinerary: initialItinerary,
  userRole,
   }) {

    //#region 1. Variables
    const [itinerary, setItinerary] = useState(initialItinerary);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [itineraryToDelete, setItineraryToDelete] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [itineraryToEdit, setItineraryToEdit] = useState(null);
    const navigate = useNavigate();
    //#endregion

    //#region 2. event handlers
  const handleDeactivateItinerary = async (itineraryId, currentStatus) => {
    const updatedStatus = !currentStatus;
    setLoading(true);
    try {
        await toggleItineraryStatus(itineraryId);
        setItinerary((prevItinerary) => ({
          ...prevItinerary,
          isActive: updatedStatus,
        }));
        message.success(`Itinerary ${updatedStatus ? "activated" : "deactivated"} successfully.`);
    } catch (error) {
        message.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchItineraries = async () => {
    try {
      if(userRole !== "Tour Guide") return;
      const response = await getItinerariesByTourGuide();
      setItineraries(response.data);
    } catch (error) {
      message.error("Failed to fetch itineraries");
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDeleteItinerary = (id) => {
    setItineraryToDelete(id);
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteItinerary(itineraryToDelete);
      message.success("Itinerary deleted successfully.");
      setItinerary(null);
      setModalVisible(false);
      setTimeout(() => {
        setLoading(true);
      }, 2000);
      navigate("/my-itineraries");
    } catch (error) {
      message.error("Failed to delete itinerary.");
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);  // Close the modal without deleting
  };

  const onEditItinerary = (id) => {
    const itinerary = itineraries.find((itinerary) => itinerary._id === id);
    setItineraryToEdit(itinerary);
    setModalVisible2(true);  // Show the modal
  };

  const handleSaveChanges = async (updatedItinerary) => {
    setModalVisible2(false);
    try {
      const response = await updateItinerary(itinerary._id,updatedItinerary);
      if (response.ok) {
        fetchItineraries();
      } 
      message.success("Itinerary updated successfully!");

    } catch (error) {
      message.error(error.response.data.error);
    }
  };
  //#endregion
  
  if (loading || !itinerary) return <div><Spinner/></div>; 

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
                <Pencil size={16} className="mr-10" color='#8f5774'/>
                Edit Details
              </button>
              
              <button
                className="action-button deactivate"
                style={{ color: "grey" }}
                onClick={() =>
                  handleDeactivateItinerary(itinerary._id,itinerary.isActive)
                }
              >
               {!itinerary.isActive? 
               <ShieldCheck size={16} className="mr-10" color="#5a9ea0" />:
                <ShieldMinus size={16} color="#05073c" className="mr-10" />}
                {itinerary.isActive ? 
                "Deactivate" :
                 "Activate"}
              </button>

              <button
                className="action-button delete"
                style={{ color: "red" }}
                onClick={() =>
                  handleDeleteItinerary(itinerary._id)
                }
              >
                <CircleX size={16} className="mr-10" />
                Delete
              </button>
            </div>
          </div>
        )}

        <AreYouSure
        visible={modalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this itinerary?"
      />
    {itineraryToEdit && (
        <UpdateItineraryModal
          visible={modalVisible2}
          itinerary={itineraryToEdit}
          onCancel={() => setModalVisible2(false)}
          onUpdate={handleSaveChanges}
        />
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
        .button-custom {
          background-color: var(--color-stone-light);
          color: white; 
          border: 1px solid var(--color-stone-light);
          transition: background-color 0.3s, color 0.3s;
        }
        .button-custom:hover {
          background-color: var(--color-stone);
          border: 1px solid var(--color-stone);
          color: white;
        }
      `}
    </style>
    </>
  );
}