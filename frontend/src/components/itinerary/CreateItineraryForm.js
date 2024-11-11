import { useState } from 'react';  
import { createItinerary } from '../../api/ItineraryService.js';
import { message, Tag, Input, Button } from "antd";
import  languages  from '../../assets/constants/Languages.js';
import ActivitySelectionModal from '../activity/ActivitySelectionModal.js';
import MapPopUp from '../common/MapPopUp.js';
import { tourGuideID } from '../../IDs.js';
const tagsData = ['Wheelchair', 'Pet Friendly', 'Family Friendly', 'Senior Friendly', 'Elevator Access', 'Sign Language Interpretation'];

const ItinerariesForm = () => {
    const [itinerary, setItinerary] = useState({
        title: '',
        description: '',
        tourGuide: tourGuideID,
        activities: [],
        serviceFee: 0,
        language: '',
        availableDates: [],
        availableTime: [],
        accessibility: [],
        pickupLocation: '',
        dropoffLocation: '',
    });
    const [customAccessibility, setCustomAccessibility] = useState('');
    const [selectedTags, setSelectedTags] = useState([...tagsData]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    // State to hold selected activities in case of openeing the modal again
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [markerPosition, setMarkerPosition] = useState(null);
    const [selectedPickupLocation, setSelectedPickupLocation] = useState('');
    const [selectedDropoffLocation, setSelectedDropoffLocation] = useState('');
    
    const handleSelectActivities = (activities) => {
        setSelectedActivities(activities); // Update selected activities
        setItinerary(prev => ({ ...prev, activities })); // Also update itinerary
    };
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
        if (datePattern.test(newDate) && !itinerary.availableDates.includes(newDate)) {
            handleArrayChange('availableDates', newDate);
            // Clear the selected date after adding it to available dates
            setSelectedDate(''); // Clear the selected date after it's used
        } else {
            setSelectedDate(newDate); // Set the selected date if it’s valid but not added
        }
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        if (!itinerary.availableTime.includes(newTime)) {
            handleArrayChange('availableTime', newTime);
            setSelectedTime('');
        }
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
    
    const removeDate = (date) => {
        setItinerary(prev => ({
            ...prev,
            availableDates: prev.availableDates.filter(d => d !== date)
        }));
    };

    const removeTime = (time) => {
        setItinerary(prev => ({
            ...prev,
            availableTime: prev.availableTime.filter(t => t !== time)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedItinerary = {
            ...itinerary,
            pickupLocation: selectedPickupLocation,
            dropoffLocation: selectedDropoffLocation,
        };
        
        try {
            const response = await createItinerary(updatedItinerary);
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
                    Title: <Input
                        type="text"
                        name="title"
                        value={itinerary.title}
                        onChange={handleChange}
                        required/>
                </label>
                <br /><br />
                <label>Description: <Input 
                        type="text"
                        name="description"
                        value={itinerary.description}
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br /><br />
                <div><Button onClick={() => setIsModalVisible(true)}>Select Activities</Button>
      
                    <ActivitySelectionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectActivities={handleSelectActivities}
                preSelectedActivities={itinerary.activities}
            /></div>

             <div>
             <h3>Selected Activities:</h3>
                    {selectedActivities.length > 0 ? (
                        selectedActivities.map(activity => (
                            <Tag key={activity._id}>{activity.title}</Tag>
                        ))
                    ) : (
                        <p>No activities selected.</p>
                    )}



                </div>
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
                    Service Fee: <Input
                        type="number"
                        name="serviceFee"
                        value={itinerary.serviceFee}
                        onChange={handleChange}
                    />
                </label>
                <br /><br />
                <label>
                    Available Dates: <Input
                        type="date"
                        onChange={handleDateChange}
                        value={selectedDate}
                    />
                </label>
                <div>
                    <h3>Selected Dates:</h3>
                    {itinerary.availableDates.length > 0 ? (
                        itinerary.availableDates.map(date => (
                            <Tag key={date} closable onClose={() => removeDate(date)}>
                                {date}
                            </Tag>
                        ))
                    ) : (
                        <p>No dates selected.</p>
                    )}
                </div>
                <br />
                <label>
                    Available Times:
                    <Input
                        type="time"
                        onChange={handleTimeChange}
                    />
                </label>
                <div>
                    <h3>Selected Times:</h3>
                    {itinerary.availableTime.length > 0 ? (
                        itinerary.availableTime.map(time => (
                            <Tag key={time} closable onClose={() => removeTime(time)}>
                                {time}
                            </Tag>
                        ))
                    ) : (
                        <p>No times selected.</p>
                    )}
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
                    placeholder="Add custom accessibility tag"
                    style={{ width: 200, marginRight: 8 }}
                />
                <Button onClick={handleCustomTagSubmit} type="primary">Add</Button>
                <br /><br />
                <div>
                <MapPopUp
                    markerPosition={markerPosition}
                    setMarkerPosition={setMarkerPosition}
                    setSelectedLocation={setSelectedPickupLocation}
                    selectedLocation={selectedPickupLocation}
                />
                <div style={{ marginTop: '10px' }}>
                    <strong>Selected Pickup Location:</strong> {selectedPickupLocation || 'No location selected yet'}
                </div>
            </div>
            <br />
            <div>
                <MapPopUp
                    markerPosition={markerPosition}
                    setMarkerPosition={setMarkerPosition}
                    setSelectedLocation={setSelectedDropoffLocation}
                    selectedLocation={selectedDropoffLocation}
                />
                <div style={{ marginTop: '10px' }}>
                    <strong>Selected Dropoff Location:</strong> {selectedDropoffLocation || 'No location selected yet'}
                </div>
            </div>
                <br /><br />
                <button type="submit">Create Itinerary</button>
                <br /><br />
            </form>
        </div>
    );
};

export default ItinerariesForm;
