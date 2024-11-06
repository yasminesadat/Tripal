import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UpcomingItinerariesList from '../../components/itinerary/UpcomingItinerariesList';
import ItinerarySearch from '../../components/itinerary/ItinerarySearch';
import ItineraryFilter from '../../components/itinerary/ItineraryFilter';
import ItinerarySort from '../../components/itinerary/ItinerarySort';
import { viewUpcomingItineraries } from "../../api/ItineraryService";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import GuestNavBar from "../../components/navbar/GuestNavBar";
import AdminNavBar from "../../components/navbar/AdminNavBar";  
import { message } from 'antd';
import { getConversionRate } from '../../api/ExchangeRatesService'; 
import { bookResource,cancelResource } from "../../api/BookingService";
import { touristId } from '../../IDs';
import { getTouristItineraries } from '../../api/TouristService';
import {flagItinerary} from "../../api/AdminService";

const ItineraryPage = ({isAdmin, isTourist,touristBook,touristCancel}) => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState("EGP");
    const [exchangeRate, setExchangeRate] = useState(1); 
    const location = useLocation();

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
                //im rendering part of the page upon the user type if it is an admin or a tourist i want to show every upcoming itinerary but if it a tourist
                //trying to see their booked itineraries they should only see their booked itineraries
                const response = touristBook||isAdmin? await viewUpcomingItineraries(): await getTouristItineraries(touristId);
                setItineraries(response);
                setFilteredItineraries(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, [location]);

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredItineraries(itineraries);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = itineraries.filter(itinerary =>
            itinerary.title.toLowerCase().includes(lowercasedTerm) ||
            itinerary.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
        );

        setFilteredItineraries(filtered);
    };

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

    const handleFilter = (filters) => {
        const { startDate, endDate, budgetMin, budgetMax, tag, language } = filters;

        if (!startDate && !endDate && !budgetMin && !budgetMax && !tag && !language) {
            setFilteredItineraries(itineraries);
            return;
        }

        const filtered = itineraries.filter(itinerary => {
            const itineraryDates = itinerary.availableDates.map(date => new Date(date));
            const itineraryBudget = itinerary.price * exchangeRate; 
            const itineraryLanguage = itinerary.language;

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const isDateValid = itineraryDates.some(date => {
                const isWithinStart = !start || date >= start;
                const isWithinEnd = !end || date <= end;
                return isWithinStart && isWithinEnd;
            });

            const isBudgetValid =
                (!budgetMin || itineraryBudget >= budgetMin) &&
                (!budgetMax || itineraryBudget <= budgetMax);
            
                const isPreferencesValid =
                !tag ||
                itinerary.activities.some((activity) =>
                  activity.tags.some((activityTag) => activityTag.name=== tag)
                );
            
            const isLanguageValid = 
                !language || 
                (itineraryLanguage && itineraryLanguage.toLowerCase() === language.toLowerCase());

            return isDateValid && isBudgetValid && isPreferencesValid && isLanguageValid;
        });

        setFilteredItineraries(filtered);
    };

    const handleBookTicket = async ({ itineraryId, touristId, selectedDate, selectedTime }) => {
        try {
            console.log('Booking', itineraryId, touristId, selectedDate, selectedTime);
            await bookResource('itinerary', itineraryId, touristId,  selectedDate,  selectedTime );
            
            console.log("This Itinerary has been booked successfully!");
            message.success("Ticket booked successfully!");
            
        } catch (error) {
            console.log("Error details:", error);

            if (error.response) {
                message.error(error.response.data.error);   
            } else {
                message.error("An error occurred. Please try again later.");
            }
        }
    };

    const handleCancelBooking = async ({ itineraryId, touristId }) => {
        try {
            await cancelResource('itinerary', itineraryId, touristId);
            message.success('Booking cancelled successfully');
            
            setItineraries(itineraries.filter(itinerary => itinerary._id !== itineraryId));
            setFilteredItineraries(filteredItineraries.filter(itinerary => itinerary._id !== itineraryId));
        } catch (err) {
            message.error('Failed to cancel booking');
        }
    };

    const handleAdminFlag = async (itineraryId) => {
        console.log('Flagging itinerary', itineraryId);
        try {
            await flagItinerary(itineraryId);
            message.success('Itinerary flagged successfully');
        } catch (error) {
            message.error(error.response.data.error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div >
            {isTourist ? (touristId ? <TouristNavBar onCurrencyChange={setCurrency} /> : <GuestNavBar />) : null}
            {isAdmin ? <AdminNavBar /> : null}   

            <div className="page-title">All Upcoming Itineraries</div>
            <ItinerarySearch onSearch={handleSearch} />
            <div className="filter-sort-list">
                <div className="filter-sort">
                    <ItineraryFilter onFilter={handleFilter} />
                    <ItinerarySort onSort={handleSort} />
                </div>  
                {/*in each route im passing the suitable page props to decide what button or what things to show*/}
                <UpcomingItinerariesList itineraries={filteredItineraries} 
                curr={currency} onBook={handleBookTicket} 
                book ={touristBook} isAdmin={isAdmin} cancel={touristCancel}
                onCancel={handleCancelBooking}
                page={"upcoming"}
                onAdminFlag={handleAdminFlag}/>

            </div>
        </div>
    );
};

export default ItineraryPage;