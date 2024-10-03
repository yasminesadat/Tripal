import React, { useState } from 'react';

const ActivitySearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm); 
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search for activities by name, category or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default ActivitySearch;