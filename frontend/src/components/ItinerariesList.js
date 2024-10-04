import React from 'react';

const ItinerariesList = ({ itineraries = [] }) => {
    return (
        <div class="list" >
            {itineraries.map(itinerary => (
                <div class="list-item" key={itinerary._id}>
                    <div class="list-item-header">{itinerary.title}</div>
                    <div class="list-item-attributes">
                        <div class="list-item-attribute">{itinerary.description}</div>
                        <div class="list-item-attribute">Language: {itinerary.language}</div>
                        <div class="list-item-attribute">Price: ${itinerary.price}</div>
                        <div class="list-item-attribute">Available Dates: {itinerary.availableDates.join(', ')}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItinerariesList;