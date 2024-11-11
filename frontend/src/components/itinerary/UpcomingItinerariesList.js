import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message } from 'antd';
import { touristId, touristId2 } from '../../IDs';
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

const UpcomingItinerariesList = ({ itineraries, onBook, book, onCancel, cancel, curr = "EGP",
  page, isAdmin, isTourguide, onAdminFlag, onItineraryDelete, onItineraryUpdate, onToggleStatus }) => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const errorDisplayedRef = useRef(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (curr) {
        try {
          const rate = await getConversionRate(curr);
          setExchangeRate(rate);
        } catch (error) {
          if (!errorDisplayedRef.current) {
            message.error("Failed to fetch exchange rate.");
            errorDisplayedRef.current = true;
          }
        }
      }
    };

    fetchExchangeRate();
  }, [curr]);

  const formatPrice = (price) => {
    const convertedPrice = (price * exchangeRate).toFixed(2);
    return `${curr} ${convertedPrice}`;
  };

  const handleNavigate = (itineraryId) => {
    navigate(`/itinerary/${itineraryId}`, { state: { page } });
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

  return (
    <div className="list">
      {itineraries.map(itinerary => (
        <div className="list-item">
          <div
            className="list-item-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "2rem",
            }}
          >
            <button className="list-item-header" key={itinerary._id} onClick={() => handleNavigate(itinerary._id)} >
              {itinerary.title}
            </button>
            {!isAdmin && !isTourguide && <div>
              <CopyOutlined
                onClick={() =>
                  handleCopyLink(
                    `${window.location.origin}/itineraries/${itinerary._id}`
                  )
                }
                style={{ marginRight: "10px", cursor: "pointer" }}
              />
              <ShareAltOutlined
                onClick={() =>
                  handleShare(
                    `${window.location.origin}/itineraries/${itinerary._id}`
                  )
                }
                style={{ cursor: "pointer" }}
              />
            </div>}
            {isTourguide && (
              <button
                  onClick={() => onToggleStatus(itinerary._id,itinerary.isActive)}
                  style={{ marginBottom: "10px" }}
              >
                  {itinerary.isActive ? "Deactivate" : "Activate"}
              </button>
                        )}
          </div>

          <div className="list-item-attributes">
            {isAdmin && <button className="list-item-attribute" key={itinerary._id} onClick={() => onAdminFlag(itinerary._id)}><b>Flag as inappropriate</b></button>}
            <div className="list-item-attribute">
              <strong>Description:</strong> {itinerary.description}
            </div>
            <div className="list-item-attribute">
              <strong>Rating:</strong> {itinerary.averageRating.toFixed(2) || 'N/A'}
            </div>
            
            <div className="list-item-attribute">
                            <strong>Activities:</strong>
                            <div className="list-item-attribute-sublist">
                                {itinerary.activities.map(activity => (
                                    <div key={activity._id} className="list-item-attribute-sublist-component">
                                        <strong>Activity:</strong> {activity.title} - {activity.description}
                                        <div>
                                            <strong>Tags:</strong> 
                                            {activity.tags && activity.tags.length > 0 
                                                ? activity.tags.map(tag => tag.name).join(', ')
                                                : 'No tags available'}
                                        </div>
                                        <div>
                                        <p>Category: {activity?.category?.Name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
            <div className="list-item-attribute">
              <strong>Locations:</strong> {itinerary.locations.length > 0 ? itinerary.locations.join(', ') : 'N/A'}
            </div>
            <div className="list-item-attribute">
              <strong>Timeline:</strong>
              <div className="list-item-attribute-sublist">
                {itinerary.timeline.map((entry, index) => (
                  <div key={index} className="list-item-attribute-sublist-component">
                    <strong>Activity:</strong> {entry.activityName}, <strong>Time:</strong> {entry.time}
                  </div>
                ))}
              </div>
            </div>
            <div className="list-item-attribute">
              <strong>Language:</strong> {itinerary.language}
            </div>
            <div className="list-item-attribute">
              <strong>Price:</strong> {formatPrice(itinerary.price)}
            </div>
            <div className="list-item-attribute">
              <strong>Available Dates:</strong>
              {itinerary.availableDates.length > 0
                ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ')
                : 'N/A'}
            </div>
            <div className="list-item-attribute">
              <strong>Available Times:</strong>
              {itinerary.availableTime.length > 0 ? itinerary.availableTime.join(', ') : 'N/A'}
            </div>
            <div className="list-item-attribute">
              <strong>Accessibility:</strong>
              {itinerary.accessibility.length > 0 ? itinerary.accessibility.join(', ') : 'N/A'}
            </div>
            <div className="list-item-attribute">
              <strong>Pickup Location:</strong> {itinerary.pickupLocation}
            </div>
            <div className="list-item-attribute">
              <strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
            </div>
            {book && (
              <button key={itinerary._id} onClick={() => handleNavigate(itinerary._id)} >
                Book Now
              </button>
            )}
            {cancel && (
              <button
                style={{ background: '#b0091a' }}
                onClick={() => onCancel({ itineraryId: itinerary._id, touristId, resourceType: 'itinerary' })}>
                Cancel Booking
              </button>
            )}
            {isTourguide && (<div className="list-item-actions">
              <button onClick={() => onItineraryUpdate(itinerary._id)}>Edit Details</button>
              <button onClick={() => onItineraryDelete(itinerary._id)}>Delete</button>
            </div>)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingItinerariesList;