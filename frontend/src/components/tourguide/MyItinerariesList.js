import React from 'react';

const MyItinerariesList = ({ itineraries, onUpdate, onDelete }) => {
    if (!itineraries) return null;
    return (
        
        <div className="list">
            {itineraries.map(itinerary => (
                <div className="list-item" key={itinerary._id}>
                    <div className="list-item-header">{itinerary.title}</div>
                    <div className="list-item-attributes">
                        <div className="list-item-attribute">{itinerary.description}</div>
                        <div className="list-item-attribute-sublist">
                            {/*<div className="list-item-attribute-sublist-header">Activities:</div>*/}
                            {/*<div className="list-item-attribute-sublist-component">
                                {itinerary.activities.map(activityId => (
                                    <div className="list-item-attribute-sublist-component" key={activityId}>
                                        <div>Activity: {activityId}</div>
                                    </div>
                                ))}
                            </div>*/}
                        </div>
                        <div className="list-item-attribute-sublist">
                            <div>Locations:</div>
                            <div className="list-item-attribute-sublist-component">
                                {itinerary.locations.length > 0 ? itinerary.locations.join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div className="list-item-attribute-sublist">
                            <div>Timeline:</div>
                            <div className="list-item-attribute-sublist-component">
                                {itinerary.timeline.map((entry, index) => (
                                    <div key={index} className="list-item-attribute-sublist-component">
                                        <div>Activity: {entry.activityName}, Time: {entry.time}</div>
                                    </div>
                                ))}
                                <br></br>
                            </div>
                        </div>
                        <div className="list-item-attribute">Language: {itinerary.language}</div>
                        <div className="list-item-attribute">Price: {itinerary.price}</div>
                        <div className="list-item-attribute-sublist">
                            
                            <div className="list-item-attribute-sublist-component">
                            <div>Available Dates:</div>
                                {itinerary.availableDates.length > 0 ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div className="list-item-attribute-sublist">
                          
                            <div className="list-item-attribute-sublist-component">
                            Available Times: { itinerary.availableTime.length > 0 ? itinerary.availableTime.join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div className="list-item-attribute-sublist">
                            <div>Accessibility:</div>
                            <div className="list-item-attribute-sublist-component">
                                {itinerary.accessibility.length > 0 ? itinerary.accessibility.join(', ') : 'N/A'}
                            </div>
                        </div>
                        <div className="list-item-attribute">Pickup Location: {itinerary.pickupLocation}</div>
                        <div className="list-item-attribute">Dropoff Location: {itinerary.dropoffLocation}</div>
                        <div className="list-item-attribute-sublist">
                            <div className="list-item-attribute-sublist-component">Tags: {itinerary.tags.length > 0 ? itinerary.tags.join(', ') : 'N/A'}</div>
                        </div>
                    </div>
                    <div className="list-item-actions">
                        <button onClick={() => onUpdate(itinerary._id)}>Edit</button>
                        <button onClick={() => onDelete(itinerary._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyItinerariesList;