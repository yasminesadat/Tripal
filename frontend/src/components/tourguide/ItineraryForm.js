import { useState } from 'react';  
import { createItinerary } from '../../api/ItineraryService.js';
import { message, Tag, Input, Button } from "antd";

const tagsData = ['Wheelchair', 'Pet Friendly', 'Family Friendly', 'Senior Friendly', 'Elevator Access', 'Sign Language Interpretation'];

const ItinerariesForm = () => {
    const [itinerary, setItinerary] = useState({
        title: '',
        description: '',
        tourGuide: '6700780a15fe2c9f96f1a96e',
        activities: ["670000464e4bb1fd7e91b628"],
        serviceFee: 0,
        language: '',
        availableDates: [],
        availableTime: [],
        accessibility: [],
        pickupLocation: '',
        dropoffLocation: '',
    });
    const [customAccessibility, setCustomAccessibility] = useState('');
    const [selectedTags, setSelectedTags] = useState([...tagsData]); // Initialize with predefined tags

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

    const handleTagChange = (tag, checked) => {
        const nextSelectedTags = checked
            ? [...itinerary.accessibility, tag] // Add tag
            : itinerary.accessibility.filter(t => t !== tag); // Remove tag

        setItinerary(prev => ({
            ...prev,
            accessibility: Array.from(new Set(nextSelectedTags)) // Remove duplicates
        }));
    };

    const handleCustomTagSubmit = () => {
        const trimmedTag = customAccessibility.trim();
        if (trimmedTag !== '' && !itinerary.accessibility.includes(trimmedTag)) {
            setItinerary(prev => ({
                ...prev,
                accessibility: [...prev.accessibility, trimmedTag] // Add custom tag if it doesn't exist
            }));
            setCustomAccessibility(''); // Clear the input field
        }
    };

    const removeTag = (tag) => {
        setItinerary(prev => ({
            ...prev,
            accessibility: prev.accessibility.filter(t => t !== tag) // Remove selected tag
        }));
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
                <div>
                    <label>Accessibility:</label>
                    {selectedTags.map(tag => (
                        <Tag.CheckableTag
                            key={tag}
                            checked={itinerary.accessibility.includes(tag)}
                            onChange={checked => handleTagChange(tag, checked)}
                        >
                            {tag}
                        </Tag.CheckableTag>
                    ))}
                    {/* Display custom tags as well */}
                    {itinerary.accessibility.filter(tag => !selectedTags.includes(tag)).map(tag => (
                        <Tag 
                            key={tag} 
                            closable 
                            onClose={() => removeTag(tag)} // Remove tag on close
                            style={{ margin: '4px' }}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
                <br />
                <Input
                    value={customAccessibility}
                    onChange={(e) => setCustomAccessibility(e.target.value)}
                    placeholder="Add custom tag"
                    style={{ width: 200, marginRight: 8 }}
                />
                <Button onClick={handleCustomTagSubmit} type="primary">Add Tag</Button>
                <br /><br />
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
