import React, { useEffect, useState, useRef } from 'react';
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message } from 'antd';

const touristId = "6724842b5831eed787083b57"; //>18 dude
//const touristId = '6727661b46a8937e2e821782'; //kiddo

const UpcomingItinerariesList = ({ itineraries,onBook, book, onCancel, cancel, curr = "EGP" }) => {
    const [exchangeRate, setExchangeRate] = useState(1);
    const errorDisplayedRef = useRef(false);

    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (curr) {
                try {
                    const rate = await getConversionRate(curr); // Fetch the exchange rate
                    setExchangeRate(rate);
                } catch (error) {
                    if (!errorDisplayedRef.current) {
                        message.error("Failed to fetch exchange rate.");
                        errorDisplayedRef.current = true;
                    }
                }
            }
        };

        fetchExchangeRate();
    }, [curr]);

    const formatPrice = (price) => {
        const convertedPrice = (price * exchangeRate).toFixed(2);
        return `${curr} ${convertedPrice}`; // Format price with currency
    };

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
                            <strong>Service Fee:</strong> {formatPrice(itinerary.serviceFee)}
                        </div>
                        <div className="list-item-attribute">
                            <strong>Language:</strong> {itinerary.language}
                        </div>
                        <div className="list-item-attribute">
                            <strong>Price:</strong> {formatPrice(itinerary.price)}
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
                        {book&& <button onClick={() => onBook({ itineraryId: itinerary._id, touristId })}>
                                Book Now
                                </button>}
                        {console.log(itinerary._id ,"lollll ", touristId)}
                        {cancel&& <button style={{ background: '#b0091a' }}  onClick={() => onCancel({ itineraryId: itinerary._id, touristId })}>
                                Cancel Booking
                                </button>}  

                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpcomingItinerariesList;