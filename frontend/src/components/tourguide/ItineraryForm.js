import { useState } from 'react';
import { createItinerary } from '../../api/ItineraryService.js';
import { message } from "antd";

const activities = ["670000464e4bb1fd7e91b628"];
const tourGuide = "6700780a15fe2c9f96f1a96e";
const accessibilityOptions = [
    "Wheelchair",
    "Pet Friendly",
    "Family Friendly",
    "Senior Friendly",
    "Elevator Access",
    "Sign Language Interpretation"
];

const ItinerariesForm = () => {
    const [itinerary, setItinerary] = useState({
        title: '',
        description: '',
        tourGuide: tourGuide,
        activities: activities,
        serviceFee: 0,
        language: '',
        availableDates: [],
        availableTime: [],
        accessibility: [],
        pickupLocation: '',
        dropoffLocation: '',
    });
    const [customAccessibility, setCustomAccessibility] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItinerary(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, newItem) => {
        setItinerary(prevState => ({
            ...prevState,
            [field]: [...prevState[field], newItem]
        }));
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        const datePattern = /^20\d{2}-\d{2}-\d{2}$/;  // Regular expression to check full YYYY-MM-DD format starting with year 2000    
        if (datePattern.test(newDate)) {
            handleArrayChange('availableDates', newDate);  // Update array only when full date is entered
        }
    };

    const handleTimeChange = (e) => {
        handleArrayChange('availableTime', e.target.value);
    };

    const handleAccessibilityChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            handleArrayChange('accessibility', value);
        } else {
            setItinerary(prevState => ({
                ...prevState,
                accessibility: prevState.accessibility.filter(option => option !== value)
            }));
        }
    };

    const handleCustomAccessibilityChange = (e) => {
        setCustomAccessibility(e.target.value);
    };

    const handleAddCustomAccessibility = () => {
        if (customAccessibility) {
            handleArrayChange('accessibility', customAccessibility);
            setCustomAccessibility('');  // Reset input
        }
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
        <div style={{ alignContent: 'center', alignSelf: 'center' }}>
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
                <br /><br />
                <label>Description: 
                    <input 
                        type="text"
                        name="description"
                        value={itinerary.description}
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br /><br />
                <label>
                    Language: 
                    <input 
                        type="text" 
                        name="language" 
                        value={itinerary.language}
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br /><br />
                <label>
                    Service Fee:
                    <input
                        type="number"
                        name="serviceFee"
                        value={itinerary.serviceFee}
                        onChange={handleChange}
                    />
                </label>
                <br /><br />
                <label>
                    Available Dates:
                    <input
                        type="date"
                        onChange={handleDateChange}
                    />
                </label>
                <div>
                    Selected Dates: {itinerary.availableDates.join(', ')}
                </div>
                <br />
                <label>
                    Available Times:
                    <input
                        type="time"
                        onChange={handleTimeChange}
                    />
                </label>
                <div>
                    Selected Times: {itinerary.availableTime.join(', ')}
                </div>
                <br />
                <label>Accessibility:</label>
                <div>
                    {accessibilityOptions.map(option => (
                        <div key={option}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={option}
                                    onChange={handleAccessibilityChange}
                                />
                                {option}
                            </label>
                        </div>
                    ))}
                    <div>
                        <label>
                            Custom Accessibility:
                            <input
                                type="text"
                                value={customAccessibility}
                                onChange={handleCustomAccessibilityChange}
                            />
                        </label>
                        <button type="button" onClick={handleAddCustomAccessibility}>
                            Add
                        </button>
                    </div>
                    <div>
                        Selected Accessibility: {itinerary.accessibility.join(', ')}
                    </div>
                </div>
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
                <br /><br />
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
                <br /><br />
                <button type="submit">Create Itinerary</button>
            </form>
        </div>
    );
};

export default ItinerariesForm;
