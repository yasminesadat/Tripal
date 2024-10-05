import React, { useEffect, useState } from 'react';
import ItinerariesList from '../../components/tourist/ItinerariesList';
import ItinerarySearch from '../../components/tourist/ItinerarySearch';
// import ItineraryFilter from '../../components/tourist/ItineraryFilter';
import ItinerarySort from '../../components/tourist/ItinerarySort';
import { viewItineraries } from "../../api/ItineraryService";

const ItineraryPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await viewItineraries();
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div class="page-container">
            <div class="page-title">Itineraries</div>
            <ItinerarySearch onSearch={handleSearch} />
            <div class="filter-sort-list">
                <div class="filter-sort">
                    {/* <ItineraryFilter onFilter={handleFilter} /> */}
                    <ItinerarySort onSort={handleSort} />
                </div>    
                <ItinerariesList itineraries={filteredItineraries} />
            </div>
        </div>
    );
};

export default ItineraryPage;
