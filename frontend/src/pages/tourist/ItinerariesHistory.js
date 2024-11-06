import React, { useEffect, useState } from 'react';
import ItineraryHistory from '../../components/itinerary/ItineraryHistory';
import ItinerarySearch from '../../components/itinerary/ItinerarySearch';
import ItineraryFilter from '../../components/itinerary/ItineraryFilter';
import ItinerarySort from '../../components/itinerary/ItinerarySort';
import { viewPaidItineraries } from "../../api/ItineraryService";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import { getConversionRate } from '../../api/ExchangeRatesService'; 
import { message } from 'antd';

const ItinerariesHistoryPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState("EGP"); // Add currency state
    const [exchangeRate, setExchangeRate] = useState(1); // Add exchange rate state

    useEffect(() => {
        const curr = sessionStorage.getItem("currency");
        if (curr) {
            setCurrency(curr);
            fetchExchangeRate(curr);
        }
    }, []);

    const fetchExchangeRate = async (curr) => {
        try {
            const rate = await getConversionRate(curr);
            setExchangeRate(rate);
        } catch (error) {
            message.error("Failed to fetch exchange rate.");
        }
    };

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await viewPaidItineraries();
                setItineraries(response);
                setFilteredItineraries(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    const handleSort = (sortOption) => {
        let sortedItineraries = [...filteredItineraries];

        switch (sortOption) {
            case 'priceAsc':
                sortedItineraries.sort((a, b) => (a.price * exchangeRate) - (b.price * exchangeRate));
                break;
            case 'priceDesc':
                sortedItineraries.sort((a, b) => (b.price * exchangeRate) - (a.price * exchangeRate));
                break;
            case 'ratingAsc':
                sortedItineraries.sort((a, b) => a.averageRating - b.averageRating);
                break;
            case 'ratingDesc':
                sortedItineraries.sort((a, b) => b.averageRating - a.averageRating);
                break;
            default:
                break;
        }

        setFilteredItineraries(sortedItineraries);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <TouristNavBar />
            <div className="page-title">My Paid Itineraries History</div>
            <div className ="list-item">
                click on an itinerary to view details or to rate them
            </div>
            <div className="filter-sort-list">
                <div className="filter-sort">
                    <ItinerarySort onSort={handleSort} />
                </div>    
                <ItineraryHistory itineraries={filteredItineraries} curr={currency} page={"history"}/>
            </div>
        </div>
    );
};

export default ItinerariesHistoryPage;