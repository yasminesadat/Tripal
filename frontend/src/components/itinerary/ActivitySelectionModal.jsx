import { Modal, List, Checkbox, message } from 'antd';
import { useEffect, useState } from 'react';
import { viewUpcomingActivities } from '../../api/ActivityService';

const ActivitySelectionModal = ({ isVisible, onClose, onSelectActivities, preSelectedActivities, maxActivities }) => {
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await viewUpcomingActivities();
            setActivities(response.data);
        };

        fetchActivities();
    }, []);

    useEffect(() => {
        if (isVisible) {
            setSelectedActivities(preSelectedActivities || []);
        }
    }, [preSelectedActivities, isVisible]);

    const handleSelect = (activity, checked) => {
        const updatedSelected = checked 
            ? [...selectedActivities, activity] // Store the full activity object
            : selectedActivities.filter(a => a._id !== activity._id);
    
        // Ensure maxActivities is respected
        if (checked && maxActivities && updatedSelected.length > maxActivities) {
            message.warning(`You can only select up to ${maxActivities} activities`);
            return;
        }

        setSelectedActivities(updatedSelected);
    };

    const handleOk = () => {
        onSelectActivities(selectedActivities);
        onClose();
    };

    return (
        <Modal
            title="Select Activities"
            visible={isVisible}
            onCancel={onClose}
            onOk={handleOk}
        >
            <List
                dataSource={activities}
                renderItem={activity => (
                    <List.Item>
                        <Checkbox
                            checked={selectedActivities.some(a => a._id === activity._id)}
                            onChange={(e) => handleSelect(activity, e.target.checked)}
                        >
                            <div>
                                <strong>{activity.title}</strong>
                                <div>{`Price: ${activity.price}`}</div>
                            </div>
                        </Checkbox>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default ActivitySelectionModal;