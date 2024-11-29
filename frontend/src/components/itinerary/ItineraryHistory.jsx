import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversionRate } from "../../api/ExchangeRatesService";
import { message } from 'antd';

const ItineraryHistory = ({ itineraries, curr = "EGP", page }) => {
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
        navigate(`/itinerary/${itineraryId}`, { state: { page } });
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
                        
                        <div className="list-item">
                            <button className="list-item-header" key={itinerary._id} onClick={() => handleNavigate(itinerary._id)}>
                                {itinerary.title}
                            </button>
                            <div className="list-item-attributes">
                                <div className="list-item-attribute">
                                    <strong>Description:</strong> {itinerary.description}
                                </div>
                                <div className="list-item-attribute">
                                    <strong>Rating:</strong> {itinerary.averageRating || 'N/A'}
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
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ItineraryHistory;
