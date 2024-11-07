import { useState, useEffect } from 'react';
import { getItinerariesByTourGuide, deleteItinerary } from '../../api/ItineraryService';
import { Empty, message } from "antd";
import MyItinerariesList from '../../components/itinerary/TourguideItinerariesList.js';
import UpdateItineraryForm from '../../components/itinerary/UpdateItineraryForm.js';
import TourguideNavBar from '../../components/navbar/TourguideNavBar.js';
import Footer from '../../components/common/Footer.js';
import {tourGuideID} from "../../IDs";

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await getItinerariesByTourGuide(tourGuideID);
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

    const handleUpdate = (id) => {
        const itineraryToUpdate = itineraries.find(itinerary => itinerary._id === id);
        setSelectedItinerary(itineraryToUpdate);
        setIsModalOpen(true);
    };

    const handleFormUpdate = (updatedId) => {
        const fetchItineraries = async () => {
            try {
                const response = await getItinerariesByTourGuide(tourGuideID);
                setItineraries(response);
            } catch (error) {
                console.log('Error fetching itineraries', error);
            }
        };

        fetchItineraries();
        setSelectedItinerary(null);
        setIsModalOpen(false);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedItinerary(null);
    };

    return (
        <div>
            <TourguideNavBar />
            <div style={{ alignContent: 'center', alignSelf: 'center' }}>
                {itineraries.length > 0 ? (
                    <MyItinerariesList 
                        itineraries={itineraries} 
                        onUpdate={handleUpdate} 
                        onDelete={handleDelete} 
                    />
                ) : (
                    <Empty />
                )}


                {selectedItinerary && (
                    <UpdateItineraryForm 
                        itinerary={selectedItinerary} 
                        onUpdate={handleFormUpdate} 
                        isVisible={isModalOpen}
                        onClose={handleModalClose} 
                    />
                )}
                <Footer />
            </div>
        </div>
    );
};

export default ItinerariesPage;
