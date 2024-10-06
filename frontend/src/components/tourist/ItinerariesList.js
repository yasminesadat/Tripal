import React from 'react';

const ItinerariesList = ({ itineraries }) => {
    return (
        <div class="list">
            {itineraries.map(itinerary => (
                <div className="list-item" key={itinerary._id}>
                    <div className="list-item-header">{itinerary.title}</div>
                    <div className="list-item-attributes">
                        <div className="list-item-attribute">{itinerary.description}</div>
                        <div className="list-item-attribute">Rating: {itinerary.averageRating || 'N/A'}</div>
                        {/* <div className="list-item-attribute">Tour Guide ID: {itinerary.tourGuide}</div> */}
                        
                        <h3>Activities:</h3>
                        <ul>
                            {itinerary.activities.map(activity => (
                                <li key={activity._id} className="list-item-attribute">
                                    <p>Activity: {activity.title} - {activity.description}</p>
                                    <h4>Tags:</h4>
                                    <div>
                                        {activity.tags && activity.tags.length > 0 
                                            ? activity.tags.map(tag => tag.name).join(', ')
                                            : 'No tags available'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        
                        <h3>Locations:</h3>
                        <div className="list-item-attribute">{itinerary.locations.length > 0 ? itinerary.locations.join(', ') : 'N/A'}</div>

                        <h3>Timeline:</h3>
                        <ul>
                            {itinerary.timeline.map((entry, index) => (
                                <li key={index} className="list-item-attribute">
                                    <p>Activity: {entry.activityName}, Time: {entry.time}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="list-item-attribute">Service Fee: ${itinerary.serviceFee}</div>
                        <div className="list-item-attribute">Language: {itinerary.language}</div>
                        <div className="list-item-attribute">Price: {itinerary.price}</div>

                        <h3>Available Dates:</h3>
                        <div className="list-item-attribute">
                            {itinerary.availableDates.length > 0 ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'N/A'}
                        </div>

                        <h3>Available Times:</h3>
                        <div className="list-item-attribute">
                            {itinerary.availableTime.length > 0 ? itinerary.availableTime.join(', ') : 'N/A'}
                        </div>
                        <div class="list-item-attribute-sublist">
                            <h3>Accessibility:</h3>
                            <div className="list-item-attribute-sublist-component">
                                {itinerary.accessibility.length > 0 ? itinerary.accessibility.join(', ') : 'N/A'}
                            </div>
                        </div>

                        <div className="list-item-attribute">Pickup Location: {itinerary.pickupLocation}</div>
                        <div className="list-item-attribute">Dropoff Location: {itinerary.dropoffLocation}</div>

                        {/* <h3>Itinerary Tags:</h3>
                        <div className="list-item-attribute">{itinerary.tags.length > 0 ? itinerary.tags.map(tag => tag.name).join(', ') : 'N/A'}</div> */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItinerariesList;
