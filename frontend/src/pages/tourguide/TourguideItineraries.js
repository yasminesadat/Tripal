import {useState, useEffect} from 'react';
import { getItineraries,deleteItinerary } from '../../api/ItineraryService';
import { message} from "antd";
import MyItinerariesList from '../../components/tourguide/MyItinerariesList.js';
import ItinerariesForm from '../../components/tourguide/ItineraryForm.js';


const tourGuide = "6700780a15fe2c9f96f1a96e";

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await getItineraries(tourGuide);
                setItineraries(response);
            } catch (error) {
                message.error('Failed to fetch itineraries');
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
    return (
        <div style={{alignContent:'center', alignSelf:'center',}}>
            <h1>Create your Itinerary</h1>
            <ItinerariesForm />
            <h1>My Itineraries</h1>
            <MyItinerariesList itineraries={itineraries} onDelete={handleDelete} />
        </div>
    );
};

export default ItinerariesPage;