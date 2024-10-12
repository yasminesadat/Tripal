import { useState } from 'react';  
import { createItinerary } from '../../api/ItineraryService.js';
import { message, Tag, Input, Button } from "antd";
import  languages  from '../../assets/constants/Languages.js';
import ActivitySelectionModal from './ActivitySelectionModal';

const tagsData = ['Wheelchair', 'Pet Friendly', 'Family Friendly', 'Senior Friendly', 'Elevator Access', 'Sign Language Interpretation'];

const ItinerariesForm = () => {
    const [itinerary, setItinerary] = useState({
        title: '',
        description: '',
        tourGuide: '6700780a15fe2c9f96f1a96e',
        activities: [],
        serviceFee: 0,
        language: '',
        availableDates: [],
        availableTimes: [],
        accessibility: [],
        pickupLocation: '',
        dropoffLocation: '',
    });
    const [customAccessibility, setCustomAccessibility] = useState('');
    const [selectedTags, setSelectedTags] = useState([...tagsData]);

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
        const datePattern = /^20\d{2}-\d{2}-\d{2}$/; 
        if (datePattern.test(newDate)) {
            handleArrayChange('availableDates', newDate);
        }
    };

    const handleTimeChange = (e) => {
        handleArrayChange('availableTime', e.target.value);
    };

    const handleTagChange = (tag, checked) => {
        const nextSelectedTags = checked
            ? [...itinerary.accessibility, tag] 
            : itinerary.accessibility.filter(t => t !== tag); 

        setItinerary(prev => ({
            ...prev,
            accessibility: Array.from(new Set(nextSelectedTags))
        }));
    };

    const handleCustomTagSubmit = () => {
        const trimmedTag = customAccessibility.trim();
        if (trimmedTag !== '' && !itinerary.accessibility.includes(trimmedTag)) {
            setItinerary(prev => ({
                ...prev,
                accessibility: [...prev.accessibility, trimmedTag]
            }));
            setCustomAccessibility(''); 
        }
    };

    const removeTag = (tag) => {
        setItinerary(prev => ({
            ...prev,
            accessibility: prev.accessibility.filter(t => t !== tag) 
        }));
    };
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleSelectActivities = (selectedActivities) => {
        setItinerary(prev => ({ ...prev, activities: selectedActivities }));
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
        <div className='signUpUsersForm-container'> {/*will fix this lol*/}
              <h1 className='signUpUsersForm-title'>Create an Itinerary</h1>
              <br></br>
            <form onSubmit={handleSubmit}>
                <label>
                    Title: <input
                        type="text"
                        name="title"
                        value={itinerary.title}
                        onChange={handleChange}
                        required/>
                </label>
                <br /><br />
                <label>Description: <input 
                        type="text"
                        name="description"
                        value={itinerary.description}
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br /><br />
                <div><Button onClick={() => setIsModalVisible(true)}>Select Activities</Button>
                 {/* leave this commented ill fix later <div>
                  Selected Activities: <p>
                    {itinerary.activities.join(', ')}         
                    </p>
                </div>*/}
                    <ActivitySelectionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectActivities={handleSelectActivities}
            /></div>
            <br/>
                 <label>Select a Language: </label>
                <label>
                    <select 
                        name="language" 
                        value={itinerary.language}
                        onChange={handleChange} 
                        required
                    >
                        <option value="" disabled>Select a language</option>
                        {languages.map((lang, index) => (
                            <option key={index} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </label>
                <br /><br />
                <label>
                    Service Fee: <input
                        type="number"
                        name="serviceFee"
                        value={itinerary.serviceFee}
                        onChange={handleChange}
                    />
                </label>
                <br /><br />
                <label>
                    Available Dates: <input
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
                    Selected Times: {itinerary.availableTimes.join(', ')}
                </div>
                <br />
                <div>
                    <label>Accessibility: </label>
                    {selectedTags.map(tag => (
                        <Tag.CheckableTag
                            key={tag}
                            checked={itinerary.accessibility.includes(tag)}
                            onChange={checked => handleTagChange(tag, checked)}
                        >
                            {tag}
                        </Tag.CheckableTag>
                    ))}
                    {itinerary.accessibility.filter(tag => !selectedTags.includes(tag)).map(tag => (
                        <Tag 
                            key={tag} 
                            closable 
                            onClose={() => removeTag(tag)}
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
                    Pickup Location: <input
                        type="text"
                        name="pickupLocation"
                        value={itinerary.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Dropoff Location: <input
                        type="text"
                        name="dropoffLocation"
                        value={itinerary.dropoffLocation}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br /><br />
                <button type="submit">Create Itinerary</button>
                <br /><br />
            </form>
        </div>
    );
};

export default ItinerariesForm;
