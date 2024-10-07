import React, { useEffect, useState } from "react";
import HistoricalPlacesList from "../../components/tourist/HistoricalPlacesList";
import HistoricalPlacesSearch from "../../components/tourist/HistoricalPlacesSearch";
import { getAllHistoricalPlaces } from "../../api/HistoricalPlaceService";
import TouristNavBar from "../../components/tourist/TouristNavBar";

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
        setError(
          err.response?.data?.error || "Error fetching historical places"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleSearch = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = places.filter((place) => {
      const matchesName = place.name
        .toLowerCase()
        .includes(lowerCaseSearchTerm);

      const matchesTags =
        place.tags &&
        place.tags.some(
          (tag) =>
            tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm)
        );

      return matchesName || matchesTags;
    });
    setFilteredPlaces(results);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div class="page-container">
      <TouristNavBar/>
      <div class="page-title">Historical Places</div>
      <HistoricalPlacesSearch onSearch={handleSearch} />
      <div class="filter-sort-list">
        <div class="filter-sort">
          {/* <HistoricalPlacesFilter onFilter={handleFilter} /> */} 
        </div>
        <HistoricalPlacesList places={filteredPlaces} />
      </div>
    </div>
  );
};

export default HistoricalPlacesPage;
