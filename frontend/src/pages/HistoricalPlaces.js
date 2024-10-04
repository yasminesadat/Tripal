import React, { useEffect, useState } from 'react';
import HistoricalPlacesList from '../components/HistoricalPlacesList';
import HistoricalPlacesSearch from '../components/HistoricalPlacesSearch';
import { getAllHistoricalPlaces } from '../api/HistoricalPlaceService';

const HistoricalPlacesPage = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await getAllHistoricalPlaces();
                setPlaces(response);
                setFilteredPlaces(response);
            } catch (err) {
                setError(err.response?.data?.error || "Error fetching historical places");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    useEffect(() => {
        console.log('Updated places:', places); // Log when places is updated
    }, [places]);

    const handleSearch = (searchTerm) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = places.filter(place => {
            const matchesName = place.name.toLowerCase().includes(lowerCaseSearchTerm);
    
            const matchesTags = place.tags && place.tags.some(tag => 
                tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm)
            );
    
            return matchesName || matchesTags;
        });
        setFilteredPlaces(results);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Historical Places</h1>
            <HistoricalPlacesSearch onSearch={handleSearch} />
            <HistoricalPlacesList places={filteredPlaces} />
        </div>
    );
};

export default HistoricalPlacesPage;
