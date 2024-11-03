import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { viewPaidActivities } from "../../api/ActivityService";
import ActivityDetails from "../../components/activity/ActivityDetails";
import TouristNavbar from "../../components/navbar/TouristNavBar";

const ActivityDetailsPage = () => {
    const { activityId } = useParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await viewPaidActivities(); 
                setActivities(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "Error fetching activities");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const activity = activities.find(activity => activity._id === activityId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!activity) return <div>Activity not found.</div>;

    return (
        <div>
            <TouristNavbar />
            <ActivityDetails activity={activity} />
        </div>
    );
};

export default ActivityDetailsPage;
