import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { viewPaidItineraries } from "../../api/ItineraryService";
import ItineraryDetails from "../../components/itinerary/itinerarySingle/ItineraryDetails";
import TouristNavbar from "../../components/navbar/TouristNavBar";
import TourguideNavBar from "../../components/navbar/TourguideNavBar";
import AdminNavbar from "../../components/navbar/AdminNavBar";
import { userRole } from "../../IDs";

const ItineraryDetailsPage = () => {
    const { itineraryId } = useParams();
    console.log(itineraryId)
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await viewPaidItineraries();
                console.log(response);
                setItineraries(response);
            } catch (err) {
                setError(err.response?.error || "Error fetching itineraries");
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    const itinerary = Array.isArray(itineraries) ? itineraries.find(itinerary => itinerary._id === itineraryId) : null;
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!itinerary) return <div>Itinerary not found.</div>;

    return (
        <div>
            {userRole==='Tourist'&& <TouristNavbar />}
            {userRole==='Tour Guide'&& <TourguideNavBar />}
            {userRole==='Admin'&& <AdminNavbar />}
            <ItineraryDetails itinerary={itinerary} />
        </div>
    );
};

export default ItineraryDetailsPage;
