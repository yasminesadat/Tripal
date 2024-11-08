import React, { useEffect, useState } from "react";

import { Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { touristId } from "../../IDs";
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

const UpcomingActivities = ({
  activities,
  onBook,
  book,
  onCancel,
  cancel,
  curr = "EGP",
  page,
}) => {
  const [exchangeRate, setExchangeRate] = useState(1);

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
            <div className="list-item-attribute">{activity.description}</div>
            <div className="list-item-attribute">
              Date: {new Date(activity.date).toLocaleDateString()}
            </div>
            <div className="list-item-attribute">Time: {activity.time}</div>
            <div className="list-item-attribute">
              Location: {activity.location}
            </div>
            <div className="list-item-attribute">
              Price: {curr} {formatPrice(activity.price)}
            </div>
            <div className="list-item-attribute">
              Category: {activity.category ? activity.category.Name : "N/A"}
            </div>
            <div className="list-item-attribute">
              Tags:{" "}
              {activity.tags.map((tag) => (
                <Tag key={tag._id} color="geekblue">
                  {tag.name}
                </Tag>
              ))}
            </div>
            <div className="list-item-attribute">
              Rating: {activity.averageRating}
            </div>
            <div className="list-item-attribute">
              Special Discounts: {activity.specialDiscounts || "N/A"}
            </div>
            <div className="list-item-attribute">
              Booking Open: {activity.isBookingOpen ? "Yes" : "No"}
            </div>
            <div className="list-item-attribute">
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
            </div>
          </div>
          {book && (
            <button
            onClick={() => handleRedirect(activity._id)}
            >
              Book Now
            </button>
          )}
          {cancel && (
            <button
              style={{ background: "#b0091a" }}
              onClick={() =>
                onCancel({
                  activityId: activity._id,
                  touristId,
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
