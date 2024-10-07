import React, { useState } from "react";

const HistoricalPlacesFilter = ({ onFilter }) => {
    const [historicType, setPreferences] = useState("");
    const [historicalTagPeriod, setHistorical] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        onFilter({
            historicType,
            historicalTagPeriod
        });
    };

    return (
        <form id="itinerary-filter" onSubmit={handleSubmit}>
            <div>
                <label>Historic type :</label>
                <input
                    type="text"
                    placeholder="e.g. Museums"
                    value={historicType}
                    onChange={(e) => setPreferences(e.target.value)}
                />
            </div>
            <div>
                <label>Historic period :</label>
                <input
                    type="text"
                    placeholder="e.g. Classical"
                    value={historicalTagPeriod}
                    onChange={(e) => setHistorical(e.target.value)}
                />
            </div>
            <button type="submit">Filter</button>
        </form>
    );
};

export default HistoricalPlacesFilter;
