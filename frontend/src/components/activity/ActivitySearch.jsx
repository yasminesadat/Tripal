import React, { useState } from "react";

const ActivitySearch = ({ onSearch }) => {
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
      placeholder="Search for activities by name, category, or tags..."
      value={searchTerm}
      onChange={handleInputChange} 
    />
  );
};

export default ActivitySearch;
