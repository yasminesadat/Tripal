import React, { useEffect, useState } from 'react';
import UpcomingItinerariesList from '../../components/itinerary/UpcomingItinerariesList';
import ItinerarySearch from '../../components/itinerary/ItinerarySearch';
 import ItineraryFilter from '../../components/itinerary/ItineraryFilter';
import ItinerarySort from '../../components/itinerary/ItinerarySort';
import { viewUpcomingItineraries } from "../../api/ItineraryService";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import {bookItinerary} from "../../api/TouristService";
import { message } from 'antd';

const UpcomingItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await viewUpcomingItineraries();
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
                sortedItineraries.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                sortedItineraries.sort((a, b) => b.price - a.price);
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
        const { startDate, endDate, budgetMin, budgetMax, preferences, language } = filters;
    
        if (!startDate && !endDate && !budgetMin && !budgetMax && !preferences && !language) {
            setFilteredItineraries(itineraries);
            return;
        }
    
        const filtered = itineraries.filter(itinerary => {
            const itineraryDates = itinerary.availableDates.map(date => new Date(date));
            const itineraryBudget = itinerary.price;
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
            
                const isPreferencesValid = !preferences || 
                preferences.split(',').some(pref => {
                    const normalizedPref = pref.trim().toLowerCase();
                    return itinerary.activities.some(activity => 
                        activity.tags.some(tag => tag.name.toLowerCase() === normalizedPref)
                    );
                });
            
            const isLanguageValid = 
                !language || 
                (itineraryLanguage && itineraryLanguage.toLowerCase() === language.toLowerCase());
    
            return isDateValid && isBudgetValid && isPreferencesValid && isLanguageValid;
        });
    
        setFilteredItineraries(filtered);
    };
    
    const handleBookTicket = async ({ itineraryId, touristId })  => {
        try {
            console.log('Booking', itineraryId, touristId);
            await bookItinerary(itineraryId, touristId);
            console.log("This Itinerary has been booked successfully!");
            message.success("Ticket booked successfully!");
        } catch (error) {
            console.log("Error details:", error);
    
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400 && data.message === 'You have already booked this itinerary.') {
                    message.success("You have already booked this itinerary.");
                } else if (status === 404) {
                    message.error("Itinerary not found.");
                } else {
                    message.error("Failed to book ticket. Please try again later.");
                }
            }
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <TouristNavBar />
            <div class="page-title">Upcoming Itineraries</div>
            <ItinerarySearch onSearch={handleSearch} />
            <div class="filter-sort-list">
                <div class="filter-sort">
                    <ItineraryFilter onFilter={handleFilter} />
                    <ItinerarySort onSort={handleSort} />
                </div>    
                <UpcomingItinerariesList itineraries={filteredItineraries} onBook={handleBookTicket} book ={'diana'}/>
            </div>
        </div>
    );
};

export default UpcomingItinerariesPage;