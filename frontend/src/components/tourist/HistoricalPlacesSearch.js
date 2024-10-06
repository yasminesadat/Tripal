import React, { useState } from "react";

const HistoricalPlacesSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  return (
    <input
      className="search-bar"
      type="text"
      placeholder="Search for historical places..."
      value={searchTerm}
      onChange={handleInputChange}
    />
  );
};

export default HistoricalPlacesSearch;
