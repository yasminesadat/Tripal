import React, { useEffect, useState } from "react";
import { Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { getUserData } from "@/api/UserService";
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

const UpcomingActivities = ({
  activities,
  book,
  onCancel,
  cancel,
  curr = "EGP",
  page,
  onAdminFlag,
}) => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
          setUserId(response.data.id); 
        } else {
          message.error(response.data.message); 
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (curr) {
        try {
          const rate = await getConversionRate(curr);
          setExchangeRate(rate);
        } catch (error) {
          console.error("Failed to fetch exchange rate.");
        }
      }
    };

    fetchExchangeRate();
  }, [curr]);

  const formatPrice = (price) => {
    const convertedPrice = (price * exchangeRate).toFixed(2);
    return convertedPrice;
  };

  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch((error) => {
        message.error("Failed to copy link");
      });
  };

  const handleShare = (link) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this activity!",
          url: link,
        })
        .catch((error) => {
          message.error("Failed to share");
        });
    } else {
      window.location.href = `mailto:?subject=Check out this activity!&body=Check out this link: ${link}`;
    }
  };

  const navigate = useNavigate();
  const handleRedirect = (activityId) => {
    navigate(`/activity/${activityId}`, { state: { page } });
  };


  return (
    <div className="list">
      {activities.map((activity) => (
        <div className="list-item" key={activity._id}>
          <button
            onClick={() => handleRedirect(activity._id)}
            className="list-item-header"
          >
            {activity.title}
          </button>
          
          <div className="list-item-attributes">
            
            {userRole==='Admin' &&<button style={{background:'red', color:'white'}} 
            onClick={() => onAdminFlag(activity._id)}>Flag as inappropriate</button>}

            <div className="list-item-attribute">{activity.description}</div>
            <div className="list-item-attribute">
              <b>Date:</b> {new Date(activity.date).toLocaleDateString()}
            </div>
            <div className="list-item-attribute"><b>Time:</b> {activity.time}</div>
            <div className="list-item-attribute">
              <b>Location:</b> {activity.location}
            </div>
            <div className="list-item-attribute">
              <b>Price:</b> {curr} {formatPrice(activity.price)}
            </div>
            <div className="list-item-attribute">
              <b>Category:</b> {activity.category ? activity.category.Name : "N/A"}
            </div>
            <div className="list-item-attribute">
              <b>Tags:{" "}</b>
              {activity.tags.map((tag) => (
                <Tag key={tag._id} color="geekblue">
                  {tag.name}
                </Tag>
              ))}
            </div>
            {!cancel && <div className="list-item-attribute">
              <b>Rating:</b> {activity.averageRating.toFixed(2)}
            </div>}
            {!cancel && <div className="list-item-attribute">
              <b>Special Discounts:</b> {activity.specialDiscounts || "N/A"}
            </div>}
            {cancel && (
                <div className="list-item-attribute">
                  {
                    activity.bookings
                      .filter(booking => booking.userId === userId) 
                      .map(filteredBooking => (
                        <p key={filteredBooking._id}><b>Number of Tickets:</b> {filteredBooking.tickets}</p> // Access tickets from the filtered booking
                      ))
                  }
                </div>
                    )}

            {userRole!=='Admin' &&<div className="list-item-attribute">
              <CopyOutlined
                onClick={() =>
                  handleCopyLink(
                    `${window.location.origin}/activities/${activity._id}`
                  )
                }
                style={{ marginRight: "10px", cursor: "pointer" }}
              />
              <ShareAltOutlined
                onClick={() =>
                  handleShare(
                    `${window.location.origin}/activities/${activity._id}`
                  )
                }
                style={{ cursor: "pointer" }}
              />
            </div>}

          </div>
          {book && userRole==='Tourist'&& (
            <button
            onClick={() => handleRedirect(activity._id)}
            >
              Book Now
            </button>
          )}
          {cancel && userRole==='Tourist'&& (
            <button
              style={{ background: "#b0091a" }}
              onClick={() =>
                onCancel({
                  activityId: activity._id,
                  userId,
                  resourceType: "activity",
                })
              }
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpcomingActivities;