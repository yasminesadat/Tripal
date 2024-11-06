import React, { useEffect, useState } from "react";
import { getTags } from '../../api/PreferenceTagService';

const ItineraryFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [preferencesTags, setPreferencesTags] = useState([]); 
  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getTags(); 
          setPreferencesTags(response.data);
        }
      catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      startDate,
      endDate,
      budgetMin,
      budgetMax,
      tag,
      language,
    });
  };

  return (
    <form id="itinerary-filter" onSubmit={handleSubmit}>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label>Min Price:</label>
        <input
          type="number"
          value={budgetMin}
          onChange={(e) => setBudgetMin(e.target.value)}
        />
      </div>
      <div>
        <label>Max Price:</label>
        <input
          type="number"
          value={budgetMax}
          onChange={(e) => setBudgetMax(e.target.value)}
        />
      </div>
      <div>
        <label>Preferences tags:</label>
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Select tag</option>
          {preferencesTags && preferencesTags.length > 0 ? (
            preferencesTags.map((pref) => (
              <option key={pref._id} value={pref.name}>
                {pref.name}
              </option>
            ))
          ) : (
            <option disabled>No tags available</option>
          )}
        </select>
      </div>
      <div>
        <label>Language:</label>
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>
      <button type="submit">Filter</button>
    </form>
  );
};

export default ItineraryFilter;