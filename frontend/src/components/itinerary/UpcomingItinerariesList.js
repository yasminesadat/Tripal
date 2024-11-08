import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message, Modal, Select } from 'antd';
import { touristId, touristId2 } from '../../IDs';
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpcomingItinerariesList = ({ itineraries, onBook, book, onCancel, cancel, curr = "EGP",
  page, isAdmin, isTourguide, onAdminFlag, onItineraryDelete, onItineraryUpdate, onToggleStatus }) => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const errorDisplayedRef = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const handleBookClick = (itinerary) => {
    if (!touristId) {
      message.warning("Please sign up or log in to book an itinerary.");
      return;
    }
    setSelectedItinerary(itinerary);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (selectedDate && selectedTime) {
      onBook({
        itineraryId: selectedItinerary._id,
        touristId,
        resourceType: "itinerary",
        selectedDate,
        selectedTime,
      });
      setIsModalVisible(false);
      setSelectedDate("");
      setSelectedTime("");
    } else {
      message.error("Please select both a date and time.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

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
            <button className="list-item-header">
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
                  onClick={() => onToggleStatus(itinerary._id)}
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
              <strong>Rating:</strong> {itinerary.averageRating || 'N/A'}
            </div>
            {itinerary.ratings && itinerary.ratings.length > 0 ? (
              <div className="list-item-attribute">
                <h3>Ratings & Reviews:</h3>
                <ul>
                  {itinerary.ratings.map((rating, index) => (
                    <li key={index}>
                      <p><strong>Rating:</strong> {rating.rating} / 5</p>
                      <p><strong>Review:</strong> {rating.review}</p>
                      <p><strong>By User ID:</strong> {rating.userID}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="list-item-attribute">No ratings yet.</div>
            )}
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
            {/* onClick={() => handleBookClick(itinerary)} */}
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
      <Modal
        title="Select Date and Time"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div>
          <strong>Select Date:</strong>
          <Select
            style={{ width: "100%", marginBottom: "1rem" }}
            placeholder="Select a date"
            onChange={(value) => setSelectedDate(value)}
            value={selectedDate || undefined}
          >
            {selectedItinerary &&
              selectedItinerary.availableDates.map((date) => (
                <Option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </Option>
              ))}
          </Select>
        </div>
        <div>
          <strong>Select Time:</strong>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a time"
            onChange={(value) => setSelectedTime(value)}
            value={selectedTime || undefined}
          >
            {selectedItinerary &&
              selectedItinerary.availableTime.map((time) => (
                <Option key={time} value={time}>
                  {time}
                </Option>
              ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default UpcomingItinerariesList;