import React from 'react';
import './Itineraries.css';
const MyItinerariesList = ({ itineraries, onUpdate, onDelete }) => {
    if (!itineraries) return null;
        return (
            <div className="list">
                <h1>My Itineraries</h1>
                {itineraries.map(itinerary => (
                    <div className="list-item" key={itinerary._id}>
                        <div className="list-item-header">{itinerary.title}</div>
                        <div className="list-item-attributes">
                            <div><strong>Description:</strong> {itinerary.description}</div>
                            
                            <div><strong>Locations:</strong> {itinerary.locations.length > 0 ? itinerary.locations.join(', ') : 'N/A'}</div>
    
                            <div><strong>Timeline:</strong></div>
                            {itinerary.timeline.map((entry, index) => (
                                <div key={index}>Activity: {entry.activityName}, Time: {entry.time}</div>
                            ))}
    
                            <div><strong>Language:</strong> {itinerary.language}</div>
                            <div><strong>Price:</strong> {itinerary.price}</div>
    
                            <div><strong>Available Dates:</strong> {itinerary.availableDates.length > 0 ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'N/A'}</div>
                            
                            <div><strong>Available Times:</strong> {itinerary.availableTime.length > 0 ? itinerary.availableTime.join(', ') : 'N/A'}</div>
    
                            <div><strong>Accessibility:</strong> {itinerary.accessibility.length > 0 ? itinerary.accessibility.join(', ') : 'N/A'}</div>
    
                            <div><strong>Pickup Location:</strong> {itinerary.pickupLocation}</div>
                            <div><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</div>
    
                            <div><strong>Tags:</strong> {itinerary.tags.length > 0 ? itinerary.tags.join(', ') : 'N/A'}</div>
                        </div>
    
                        <div className="list-item-actions">
                            <button onClick={() => onUpdate(itinerary._id)}>Edit Details</button>
                            <button onClick={() => onDelete(itinerary._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

export default MyItinerariesList;