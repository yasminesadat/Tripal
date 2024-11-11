import React, { useState } from 'react';

const ItinerarySearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); 
    };

    return (
            <input
                className="search-bar"
                type="text"
                placeholder="Search by title or tags..."
                value={searchTerm}
                onChange={handleChange}
            />
    );
};

export default ItinerarySearch;
