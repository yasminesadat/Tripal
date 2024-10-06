import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { updateItinerary } from '../../api/ItineraryService.js'; // Assuming you have an updateItinerary function

const UpdateItineraryForm = ({ itinerary, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [updatedItinerary, setUpdatedItinerary] = useState(itinerary);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            await updateItinerary(updatedItinerary); // Call your update function
            message.success('Itinerary updated successfully!');
            onUpdate(updatedItinerary._id); // Call onUpdate to refresh the list or perform any other action
            setOpen(false);
        } catch (error) {
            message.error('Error updating itinerary');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItinerary(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        if (newDate.length === 10) {
            setUpdatedItinerary(prevState => ({
                ...prevState,
                availableDates: [...prevState.availableDates, newDate] // Update the dates array
            }));
        }
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Update
            </Button>
            <Modal
                title="Update Itinerary"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={updatedItinerary.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Description:
                        <input
                            type="text"
                            name="description"
                            value={updatedItinerary.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Language:
                        <input
                            type="text"
                            name="language"
                            value={updatedItinerary.language}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <br />
                    <label>
                        Service Fee:
                        <input
                            type="number"
                            name="serviceFee"
                            value={updatedItinerary.serviceFee}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <br />
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
                        Pickup Location:
                        <input
                            type="text"
                            name="pickupLocation"
                            value={updatedItinerary.pickupLocation}
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
                            value={updatedItinerary.dropoffLocation}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
            </Modal>
        </>
    );
};

export default UpdateItineraryForm;
