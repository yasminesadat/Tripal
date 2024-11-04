import React, { useEffect, useState } from "react";
import { Tag } from 'antd';
import { getConversionRate } from "../../api/ExchangeRatesService";

const touristId = '670d4e900cb9ea7937cc9968';
const UpcomingActivitiesList = ({ activities, onBook, curr = "EGP" }) => {
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
          <div className="list-item-header">{activity.title}</div>
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
          <button onClick={() => onBook({ activityId: activity._id, touristId })}>
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingActivitiesList;