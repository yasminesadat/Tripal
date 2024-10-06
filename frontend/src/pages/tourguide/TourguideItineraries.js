import { useState, useEffect } from 'react';
import { getItineraries, deleteItinerary } from '../../api/ItineraryService';
import { Empty, message } from "antd";
import MyItinerariesList from '../../components/tourguide/MyItinerariesList.js';
import UpdateItineraryForm from '../../components/tourguide/UpdateItineraryForm.js';
import TourguideNavBar from '../../components/tourguide/TourguideNavBar.js';

const tourGuide = "6700780a15fe2c9f96f1a96e"; // Tour guide ID

const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

    const handleUpdate = (id) => {
        const itineraryToUpdate = itineraries.find(itinerary => itinerary._id === id);
        setSelectedItinerary(itineraryToUpdate);
        setIsModalOpen(true); // Open the modal when an itinerary is selected
    };

    const handleFormUpdate = (updatedId) => {
        const fetchItineraries = async () => {
            try {
                const response = await getItineraries(tourGuide);
                setItineraries(response);
            } catch (error) {
                console.log('Error fetching itineraries', error);
            }
        };

        fetchItineraries();
        setSelectedItinerary(null);
        setIsModalOpen(false); // Close the modal after updating
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedItinerary(null); // Reset selected itinerary when closing the modal
    };

    return (
        <div>
            <TourguideNavBar />
            <div style={{ alignContent: 'center', alignSelf: 'center' }}>
                <h1>My Itineraries</h1>
                {itineraries.length > 0 ? (
                    <MyItinerariesList 
                        itineraries={itineraries} 
                        onUpdate={handleUpdate} 
                        onDelete={handleDelete} 
                    />
                ) : (
                    <Empty />
                )}

                {/* Render the UpdateItineraryForm if an itinerary is selected */}
                {selectedItinerary && (
                    <UpdateItineraryForm 
                        itinerary={selectedItinerary} 
                        onUpdate={handleFormUpdate} 
                        isVisible={isModalOpen} // Control modal visibility
                        onClose={handleModalClose} // Handle closing modal
                    />
                )}
            </div>
        </div>
    );
};

export default ItinerariesPage;
