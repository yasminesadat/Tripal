import { Modal, List, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { viewUpcomingActivities } from '../../api/ActivityService';

const ActivitySelectionModal = ({ isVisible, onClose, onSelectActivities, preSelectedActivities }) => {
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
                            {activity.title}
                        </Checkbox>
                    </List.Item>
                    )}
                />
        </Modal>
    );
};

export default ActivitySelectionModal;
