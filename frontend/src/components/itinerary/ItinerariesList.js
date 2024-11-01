import React from 'react';

const touristId = '670d4e900cb9ea7937cc9968';
const ItinerariesList = ({ itineraries,onBook  }) => {
    
    return (
        <div className="list">
            {itineraries.map(itinerary => (
                <div className="list-item" key={itinerary._id}>
                    <div className="list-item-header">{itinerary.title}</div>
                    <div className="list-item-attributes">
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
                            <strong>Service Fee:</strong> ${itinerary.serviceFee}
                        </div>
                        <div className="list-item-attribute">
                            <strong>Language:</strong> {itinerary.language}
                        </div>
                        <div className="list-item-attribute">
                            <strong>Price:</strong> {itinerary.price}
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
                        <button onClick={() => onBook({ itineraryId: itinerary._id, touristId })}>
                                Book Now
                                </button>
                        {console.log(itinerary._id ," ", touristId)}

                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItinerariesList;