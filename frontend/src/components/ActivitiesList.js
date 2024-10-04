import React from 'react';

const ActivitiesList = ({ activities }) => {
    return (
        <ul>
            {activities.map(activity => (
                <li key={activity._id}>
                    <h2>{activity.title}</h2>
                    <p>{activity.description}</p>
                    <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                    <p>Time: {activity.time}</p>
                    <p>Location: {activity.location}</p>
                    <p>Price: {activity.price}</p>
                    <p>Category: {activity.category ? activity.category.Name : 'N/A'}</p>
                    <p>Tags: {activity.tags.map(tag => tag.name).join(', ')}</p>
                    <p>Special Discounts: {activity.specialDiscounts || 'N/A'}</p>
                    <p>Booking Open: {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                </li>
            ))}
        </ul>
    );
};

export default ActivitiesList;
