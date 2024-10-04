import React from 'react';

const ItinerariesList = ({ itineraries }) => {
    return (
        <ul>
            {itineraries.map(itinerary => (
                <li key={itinerary._id}>
                    <h2>{itinerary.title}</h2>
                    <p>{itinerary.description}</p>
                    <p>Tour Guide ID: {itinerary.tourGuide}</p>
                    
                    <h3>Activities:</h3>
                    <ul>
                        {itinerary.activities.map(activityId => (
                            <li key={activityId}>
                                <p>Activity: {activityId}</p>
                            </li>
                        ))}
                    </ul>
                    
                    <h3>Locations:</h3>
                    <p>{itinerary.locations.length > 0 ? itinerary.locations.join(', ') : 'N/A'}</p>

                    <h3>Timeline:</h3>
                    <ul>
                        {itinerary.timeline.map((entry, index) => (
                            <li key={index}>
                                <p>Activity: {entry.activityName}, Time: {entry.time}</p>
                            </li>
                        ))}
                    </ul>

                    <p>Service Fee: ${itinerary.serviceFee}</p>
                    <p>Language: {itinerary.language}</p>
                    <p>Price: {itinerary.price}</p>

                    <h3>Available Dates:</h3>
                    <p>{itinerary.availableDates.length > 0 ? itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'N/A'}</p>

                    <h3>Available Times:</h3>
                    <p>{itinerary.availableTime.length > 0 ? itinerary.availableTime.join(', ') : 'N/A'}</p>

                    <h3>Accessibility:</h3>
                    <p>{itinerary.accessibility.length > 0 ? itinerary.accessibility.join(', ') : 'N/A'}</p>

                    <p>Pickup Location: {itinerary.pickupLocation}</p>
                    <p>Dropoff Location: {itinerary.dropoffLocation}</p>

                    <h3>Tags:</h3>
                    <p>{itinerary.tags.length > 0 ? itinerary.tags.join(', ') : 'N/A'}</p>
                </li>
            ))}
        </ul>
    );
};

export default ItinerariesList;
