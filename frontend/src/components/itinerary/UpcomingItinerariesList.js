import React, { useEffect, useState, useRef } from "react";
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message, Modal, Select, Button, Tag } from "antd";
import { touristId } from "../../IDs";
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpcomingItinerariesList = ({
  itineraries,
  onBook,
  book,
  onCancel,
  cancel,
  curr = "EGP",
}) => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const errorDisplayedRef = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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

  const handleBookClick = (itinerary) => {
    setSelectedItinerary(itinerary);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (selectedItinerary && selectedDate && selectedTime) {
      onBook({
        itineraryId: selectedItinerary._id,
        touristId,
        date: selectedDate,
        time: selectedTime,
      });
      setIsModalVisible(false);
    } else {
      message.error("Please select a date and time.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="list">
      {itineraries.map((itinerary) => (
        <div className="list-item" key={itinerary._id}>
          <div className="list-item-header">{itinerary.title}</div>
          <div className="list-item-attributes">
            <div className="list-item-attribute">{itinerary.description}</div>
            <div className="list-item-attribute">
              Date: {new Date(itinerary.date).toLocaleDateString()}
            </div>
            <div className="list-item-attribute">Time: {itinerary.time}</div>
            <div className="list-item-attribute">
              Location: {itinerary.location}
            </div>
            <div className="list-item-attribute">
              Price: {curr} {formatPrice(itinerary.price)}
            </div>
            <div className="list-item-attribute">
              Category: {itinerary.category ? itinerary.category.Name : "N/A"}
            </div>
            <div className="list-item-attribute">
              Tags:{" "}
              {itinerary.tags.map((tag) => (
                <Tag key={tag._id} color="geekblue">
                  {tag.name}
                </Tag>
              ))}
            </div>
            <div className="list-item-attribute">
              Rating: {itinerary.averageRating}
            </div>
            <div className="list-item-attribute">
              Special Discounts: {itinerary.specialDiscounts || "N/A"}
            </div>
            <div className="list-item-attribute">
              Booking Open: {itinerary.isBookingOpen ? "Yes" : "No"}
            </div>
            <div className="list-item-attribute">
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
            </div>
          </div>
          {book && (
            <button onClick={() => handleBookClick(itinerary)}>Book Now</button>
          )}
          {cancel && (
            <button
              style={{ background: "#b0091a" }}
              onClick={() =>
                onCancel({
                  itineraryId: itinerary._id,
                  touristId,
                  resourceType: "itinerary",
                })
              }
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}
      <Modal
        title="Book Itinerary"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Select
          placeholder="Select Date"
          onChange={setSelectedDate}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {/* Add date options here */}
        </Select>
        <Select
          placeholder="Select Time"
          onChange={setSelectedTime}
          style={{ width: "100%" }}
        >
          {/* Add time options here */}
        </Select>
      </Modal>
    </div>
  );
};

export default UpcomingItinerariesList;
