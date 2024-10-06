import React, { useEffect, useRef, useState } from 'react';
import { Modal, message, Input, Tag, DatePicker, TimePicker, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateItinerary } from '../../api/ItineraryService.js';
import  languages  from '../../assets/constants/Languages.js';

const UpdateItineraryForm = ({ itinerary, onUpdate, isVisible, onClose }) => {
    const { token } = theme.useToken();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [updatedItinerary, setUpdatedItinerary] = useState(itinerary);
    const [tags, setTags] = useState(['Wheelchair', 'Pet Friendly', 'Family Friendly', 'Senior Friendly', 'Elevator Access', 'Sign Language Interpretation']);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        if (itinerary) {
            setUpdatedItinerary(itinerary);
            setSelectedTags(itinerary.accessibility || []);
            setAvailableDates(itinerary.availableDates || []);
            setAvailableTimes(itinerary.availableTimes || []);
        }
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [itinerary, inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = selectedTags.filter((tag) => tag !== removedTag);
        setSelectedTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        const trimmedInputValue = inputValue.trim(); 
    
        if (trimmedInputValue && !tags.includes(trimmedInputValue)) {
            setTags(prevTags => [...prevTags, trimmedInputValue]);
            setSelectedTags(prevSelectedTags => [...prevSelectedTags, trimmedInputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };
    
    const handleTagChange = (tag, checked) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter(t => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        updatedItinerary.accessibility = selectedTags;
        updatedItinerary.availableDates = availableDates;
        updatedItinerary.availableTimes = availableTimes;

        try {
            await updateItinerary(updatedItinerary._id, updatedItinerary);
            message.success('Itinerary updated successfully!');
            onUpdate(updatedItinerary);
        } catch (error) {
            console.error('Error updating itinerary:', error);
            message.error('Error updating itinerary');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDateChange = (date, dateString) => {
        if (date && !availableDates.includes(dateString)) {
            setAvailableDates([...availableDates, dateString]);
        }
    };

    const handleTimeChange = (time, timeString) => {
        if (time && !availableTimes.includes(timeString)) {
            setAvailableTimes([...availableTimes, timeString]);
        }
    };

    const removeDate = (dateToRemove) => {
        setAvailableDates(availableDates.filter(date => date !== dateToRemove));
    };

    const removeTime = (timeToRemove) => {
        setAvailableTimes(availableTimes.filter(time => time !== timeToRemove));
    };

    return (
        <Modal
            title="Update Itinerary"
            open={isVisible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={onClose}
        >
            <div>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={updatedItinerary.title || ''}
                        onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, title: e.target.value })}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Description:
                    <input
                        type="text"
                        name="description"
                        value={updatedItinerary.description || ''}
                        onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, description: e.target.value })}
                        required
                    />
                </label>
                <br /><br />
                <label> Select your Language: </label>
                <label>
                    <select 
                        name="language" 
                        value={updatedItinerary.language || ''}
                        onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, language: e.target.value })} 
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
                    Service Fee: 
                    <input
                        type="number"
                        name="serviceFee"
                        value={updatedItinerary.serviceFee || ''}
                        onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, serviceFee: e.target.value })}
                    />
                </label>
                <br /><br />

                <label>
                    Pickup Location: 
                    <input
                        type="text"
                        name="pickupLocation"
                        value={updatedItinerary.pickupLocation || ''}
                        onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, pickupLocation: e.target.value })}
                        required
                    />
                </label>
                <br /><br />

                <label>
                    Dropoff Location:
                    <input
                        type="text"
                        name="dropoffLocation"
                        value={updatedItinerary.dropoffLocation || ''}
                        onChange={(e) => setUpdatedItinerary({ ...updatedItinerary, dropoffLocation: e.target.value })}
                        required
                    />
                </label>
                <br /><br />

                <div>
                    <label>Available Dates:</label>
                    <DatePicker onChange={handleDateChange} />
                    <div>
                        {availableDates.map(date => (
                            <Tag key={date} closable onClose={() => removeDate(date)}>
                                {date}
                            </Tag>
                        ))}
                    </div>
                </div>
                <br />
                <div>
                    <label>Available Times:</label>
                    <TimePicker 
                        onChange={handleTimeChange} 
                        format="HH:mm" 
                    />
                    <div>
                        {availableTimes.map(time => (
                            <Tag key={time} closable onClose={() => removeTime(time)}>
                                {time}
                            </Tag>
                        ))}
                    </div>
                </div>
                <br />
                <label>Accessibility:</label>
                
                <div>
       
                    {tags.map(tag => (
                        <Tag.CheckableTag
                            key={tag}
                            checked={selectedTags.includes(tag)}
                            onChange={checked => handleTagChange(tag, checked)}
                        >
                            {tag}
                        </Tag.CheckableTag>
                    ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                    {selectedTags.map((tag) => (
                        <span key={tag} style={{ display: 'inline-block', marginRight: 8 }}>
                            <Tag
                                closable
                                onClose={(e) => {
                                    e.preventDefault();
                                    handleClose(tag);
                                }}
                            >
                                {tag}
                            </Tag>
                        </span>
                    ))}
                    {inputVisible ? (
                        <Input
                            ref={inputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                        />
                    ) : (
                        <Tag onClick={showInput} style={{ background: token.colorBgContainer, borderStyle: 'dashed' }}>
                            <PlusOutlined /> New Tag
                        </Tag>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default UpdateItineraryForm;