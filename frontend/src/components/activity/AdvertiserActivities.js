import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdvertiserActivities, deleteActivity } from "../../api/ActivityService";
import { Button, notification } from 'antd';

const AdvertiserActivities = () => {
  const { id } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getAdvertiserActivities(id);
        setActivities(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [id]);

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter(activity => activity._id !== id));
      notification.success({
        message: 'Success',
        description: 'Activity deleted successfully!',
        placement: 'topRight',
      });
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="activities-list">
      {activities.map((activity) => (
        <div key={activity._id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>{activity.title}</h3>
          <p><strong>Location:</strong> {activity.location}</p>
          <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {activity.time}</p>

          <div style={{ marginTop: "10px" }}>
            <Button
              type="default"
              style={{ marginRight: "10px" }}
              onClick={() => navigate(`/update-activity/${activity._id}`, { state: { activity } })}
            >
              Update
            </Button>
            <Button
              type="danger"
              onClick={() => handleDeleteActivity(activity._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvertiserActivities;
