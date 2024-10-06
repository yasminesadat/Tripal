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
        // Set selectedActivities based on preSelectedActivities prop whenever the modal is opened
        if (isVisible) {
            setSelectedActivities(preSelectedActivities || []); // Default to empty array if preSelectedActivities is undefined
        }
    }, [preSelectedActivities, isVisible]);

    const handleSelect = (activityId, checked) => {
        const updatedSelected = checked 
            ? [...selectedActivities, activityId]
            : selectedActivities.filter(id => id !== activityId);

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
                            checked={selectedActivities.includes(activity._id)}
                            onChange={(e) => handleSelect(activity._id, e.target.checked)}
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
