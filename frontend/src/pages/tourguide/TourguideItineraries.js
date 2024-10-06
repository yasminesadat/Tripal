import {useState, useEffect} from 'react';
import { getItineraries,deleteItinerary } from '../../api/ItineraryService';
import { Empty, message} from "antd";
import MyItinerariesList from '../../components/tourguide/MyItinerariesList.js';
import UpdateItineraryForm from '../../components/tourguide/UpdateItineraryForm.js'; 
import TourguideNavBar from "../../components/tourguide/TourguideNavBar";

const tourGuide = "6700780a15fe2c9f96f1a96e";

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await getItineraries(tourGuide);
                setItineraries(response);
            } catch (error) {
                console.log('Error fetching itineraries', error);
            }
        };

        fetchItineraries();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteItinerary(id);
            setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
            message.success('Itinerary deleted successfully');
        } catch (error) {
            message.error('Error deleting itinerary');
        }
    };

    const handleUpdate = async (id) => {
        // Logic for updating the itinerary (you need to implement this)
        // Example: Navigate to a form for updating the itinerary
        console.log(`Update itinerary with ID: ${id}`);
        // You can implement navigation or show a modal for updating the itinerary
    };
    return (
        <div style={{alignContent:'center', alignSelf:'center',}}>
            <TourguideNavBar />
            <h1>My Itineraries</h1>
            {itineraries.length > 0 ? (
                <MyItinerariesList itineraries={itineraries} onUpdate={handleUpdate} onDelete={handleDelete} />
            ) : (
                <Empty />
            )}
        </div>
    );
};

export default ItinerariesPage;