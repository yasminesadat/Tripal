import React from 'react';

const ItinerariesList = ({ itineraries }) => {
    return (
        <div class="list">
            {itineraries.map(itinerary => (
                <div class="list-item" key={itinerary._id}>
                    <div class="list-item-header">{itinerary.title}</div>
                    <div class="list-item-attributes">
                        <div class="list-item-attribute">{itinerary.description}</div>
                        {/* <div className="list-item-attribute">Tour Guide ID: {itinerary.tourGuide}</div> */}
                        <div class="list-item-attribute-sublist">
                            <div class="list-item-attribute-sublist-header">Activities:</div>
                            <div class="list-item-attribute-sublist-component">
                                {itinerary.activities.map(activityId => (
                                    <div class="list-item-attribute-sublist-component" key={activityId}>
                                        <div>Activity: {activityId}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="list-item-attribute-sublist">
                            <div>Locations:</div>
                            <div class="list-item-attribute-sublist-component">
                                {itinerary.locations.length > 0 ? itinerary.locations.join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div class="list-item-attribute-sublist">
                            <div>Timeline:</div>
                            <div class="list-item-attribute-sublist-component">
                                {itinerary.timeline.map((entry, index) => (
                                    <div key={index} class="list-item-attribute-sublist-component">
                                        <div>Activity: {entry.activityName}, Time: {entry.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="list-item-attribute">Service Fee: ${itinerary.serviceFee}</div>
                        <div class="list-item-attribute">Language: {itinerary.language}</div>
                        <div class="list-item-attribute">Price: {itinerary.price}</div>
                        <div class="list-item-attribute-sublist">
                            <div>Available Dates:</div>
                            <div class="list-item-attribute-sublist-component">
                                {itinerary.availableDates.length > 0 ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div class="list-item-attribute-sublist">
                            <div>Available Times:</div>
                            <div class="list-item-attribute-sublist-component">
                                {itinerary.availableTime.length > 0 ? itinerary.availableTime.join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div class="list-item-attribute-sublist">
                            <div>Accessibility:</div>
                            <div className="list-item-attribute-sublist-component">
                                {itinerary.accessibility.length > 0 ? itinerary.accessibility.join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div class="list-item-attribute">Pickup Location: {itinerary.pickupLocation}</div>
                        <div class="list-item-attribute">Dropoff Location: {itinerary.dropoffLocation}</div>
                        <div class="list-item-attribute-sublist">
                            <div class="list-item-attribute-sublist-component">Tags: {itinerary.tags.length > 0 ? itinerary.tags.join(', ') : 'N/A'}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItinerariesList;
