import React, { useEffect, useState } from "react";
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import { getConversionRate } from "../../api/ExchangeRatesService";
// import ReviewBox from '../common/ReviewBox';

const PaidActivitiesList = ({ activities, curr = "EGP" }) => {
  
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedActivity, setSelectedActivity] = useState(null);

  // const showCommentModal = (activity) => {
  //   setSelectedActivity(activity);
  //   setIsModalVisible(true);
  // };

  // const handleClose = () => {
  //   setIsModalVisible(false);
  //   setSelectedActivity(null); 
  // };
  
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

  return (
    <div className="list">
      {activities.map((activity) => (
        <div className="list-item" key={activity._id}>
          <Link to={`/activity/${activity._id}`} className="list-item-header">
            {activity.title}
          </Link>
          <div className="list-item-attributes">
            <div className="list-item-attribute">{activity.description}</div>
            <div className="list-item-attribute">Date: {new Date(activity.date).toLocaleDateString()}</div>
            <div className="list-item-attribute">Time: {activity.time}</div>
            <div className="list-item-attribute">Location: {activity.location}</div>
            <div className="list-item-attribute">Price: {curr} {formatPrice(activity.price)}</div>
            <div className="list-item-attribute">Category: {activity.category ? activity.category.Name : "N/A"}</div>
            <div className="list-item-attribute">
              Tags: {activity.tags.map((tag) => (
                <Tag key={tag._id} color="geekblue">
                  {tag.name}
                </Tag>
              ))}
            </div>
            <div className="list-item-attribute">Rating: {activity.averageRating}</div>
            <div className="list-item-attribute">Special Discounts: {activity.specialDiscounts || "N/A"}</div>
            <div className="list-item-attribute">Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</div>
          </div>
          {/* <button onClick={() => showCommentModal(activity)}>
            Review
          </button> */}
        </div>
      ))}
      {/* <Modal
        title="Leave a Comment"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        <ReviewBox activity={selectedActivity} type="activity"/>
      </Modal> */}
    </div>
  );
};

export default PaidActivitiesList;
