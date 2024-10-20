import React, { useState } from "react";

const ItineraryFilter = ({ onFilter }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budgetMin, setBudgetMin] = useState("");
    const [budgetMax, setBudgetMax] = useState("");
    const [preferences, setPreferences] = useState("");
    const [language, setLanguage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        onFilter({
            startDate,
            endDate,
            budgetMin,
            budgetMax,
            preferences,
            language
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
                <label>Preferences (comma-separated):</label>
                <input
                    type="text"
                    placeholder="e.g. historic,beaches,family-friendly,shopping"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                />
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
