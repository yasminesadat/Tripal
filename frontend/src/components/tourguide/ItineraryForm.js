import { useState} from 'react';
import { createItinerary} from '../../api/ItineraryService.js';
import {  message } from "antd";

const activities = ["670000464e4bb1fd7e91b628"];
const tourGuide = "6700780a15fe2c9f96f1a96e";
const accessibilityOptions = [
    "Wheelchair",
    "Pet Friendly",
    "Family Friendly",
    "Senior Friendly",
];
const ItinerariesForm = () => {
    const [itinerary, setItinerary] = useState({
        title: '',
        description: '',
        tourGuide: tourGuide,
        activities: activities,
        serviceFee:0,
        language: '',
        availableDates: [],
        availableTime: [],
        accessibility: [],
        pickupLocation: '',
        dropoffLocation: '',
    });
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setItinerary(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (name, value) => {
        setItinerary(prev => ({ ...prev, [name]: [...prev[name], value] }));
    };

    const handleDateChange = (e) => {
        handleArrayChange('availableDates', e.target.value);
    };

    const handleTimeChange = (e) => {
        handleArrayChange('availableTime', e.target.value);
    };

    const handleAccessibilityChange = (e) => {
        handleArrayChange('accessibility', e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createItinerary(itinerary);
            console.log('Itinerary created:', response);
            message.success('Itinerary created successfully!');
        } catch (error) {
            console.error('Error creating itinerary:', error);
            message.error('Error creating itinerary');
        }
    };
    return (
        <div style={{alignContent:'center', alignSelf:'center',}}>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={itinerary.title}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <br />
                <label>Description: <input type="text"name="description"
                value={itinerary.description}
                onChange={handleChange} required />
                </label>
                <br />
                <br />
                <label>
                Language: <input type="text" name="language" 
                value={itinerary.language}
                onChange={handleChange} required />
                </label>
                <br />
                <br />
                <label>
                    Service Fee:
                    <input
                        type="number"
                        name="serviceFee"
                        value={itinerary.serviceFee}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Available Dates:
                    <input
                        type="date"
                        onChange={handleDateChange}
                    />
                </label>
                <br />
                <br />
                <label>
                    Available Times:
                    <input
                        type="time"
                        onChange={handleTimeChange}
                    />
                </label>
                <br />
                <br />
                <label>
                    Accessibility:
                    <select onChange={handleAccessibilityChange}>
                        <option value="">Select Accessibility Option</option>
                        {accessibilityOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <br />
                <br />
                <label>
                    Pickup Location:
                    <input
                        type="text"
                        name="pickupLocation"
                        value={itinerary.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <br />
                <label>
                    Dropoff Location:
                    <input
                        type="text"
                        name="dropoffLocation"
                        value={itinerary.dropoffLocation}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <br />
                <button type="submit">Create Itinerary</button>
            </form>

        </div>
    );
};

export default ItinerariesForm;