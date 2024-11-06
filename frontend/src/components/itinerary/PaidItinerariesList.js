import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message } from 'antd';

const touristId = '6724842b5831eed787083b57';

const PaidItinerariesList = ({ itineraries, curr = "EGP", page }) => {
    const [exchangeRate, setExchangeRate] = useState(1);
    const errorDisplayedRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExchangeRate = async () => {
            setLoading(true);
            if (curr) {
                try {
                    const rate = await getConversionRate(curr);
                    setExchangeRate(rate);
                } catch (error) {
                    if (!errorDisplayedRef.current) {
                        message.error("Failed to fetch exchange rate.");
                        errorDisplayedRef.current = true;
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchExchangeRate();
    }, [curr]);

    const formatPrice = (price) => {
        const convertedPrice = (price * exchangeRate).toFixed(2);
        return `${curr} ${convertedPrice}`;
    };

    const handleNavigate = (itineraryId) => {
        navigate(`/itinerary/view/${itineraryId}`, { state: { page } });
    };

    return (
        <div className="list">
            {loading ? (
                <p>Loading exchange rates...</p>
            ) : (
                itineraries.map(itinerary => {
                    const formattedServiceFee = formatPrice(itinerary.serviceFee);
                    const formattedPrice = formatPrice(itinerary.price);

                    return (
                        <div className="list-item" key={itinerary._id} onClick={() => handleNavigate(itinerary._id)}>
                            <div className="list-item-header">
                                {itinerary.title}
                            </div>
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
                                    <strong>Service Fee:</strong> {formattedServiceFee}
                                </div>
                                <div className="list-item-attribute">
                                    <strong>Language:</strong> {itinerary.language}
                                </div>
                                <div className="list-item-attribute">
                                    <strong>Price:</strong> {formattedPrice}
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
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default PaidItinerariesList;
