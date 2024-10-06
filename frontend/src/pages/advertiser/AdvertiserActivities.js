// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getAdvertiserActivities } from "../../api/ActivityService";
// import ActivitiesList from "../../components/tourist/ActivitiesList.js";


// const AdvertiserActivitiesPage = () => {
//   const { id } = useParams(); // Get advertiserId from the URL params
//   console.log("Advertiser ID:", id);

//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await getAdvertiserActivities(id);
//         setActivities(response.data);
//       } catch (err) {
//         setError(err.response?.data?.error || "Error fetching activities");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="advertiser-activities-page">
//       <h1>Your Activities </h1>
//       <ActivitiesList activities={activities} />
//     </div>
//   );
// };

// export default AdvertiserActivitiesPage;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdvertiserActivities, deleteActivity } from "../../api/ActivityService";
import { Tag, Button, notification } from 'antd';

const AdvertiserActivitiesPage = () => {
  const { id } = useParams(); // Get advertiserId from the URL params
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Handle delete activity for advertisers
  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter(activity => activity._id !== id));
      notification.success({
        message: 'Success',
        description: 'Activity deleted successfully!',
        placement: 'topRight', // Position of the notification
      });
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="advertiser-activities-page">
      <h1>Your Activities</h1>
      <div className="list">
        {activities.map((activity) => (
          <div className="list-item" key={activity._id}>
            <div className="list-item-header">{activity.title}</div>
            <div className="list-item-attributes">
              <div className="list-item-attribute">{activity.description}</div>
              <div className="list-item-attribute">Date: {new Date(activity.date).toLocaleDateString()}</div>
              <div className="list-item-attribute">Time: {activity.time}</div>
              <div className="list-item-attribute">Location: {activity.location}</div>
              <div className="list-item-attribute">Price: {activity.price}</div>
              <div className="list-item-attribute">Category: {activity.category ? activity.category.name : "N/A"}</div>
              <div className="list-item-attribute">
                Tags: {activity.tags.map((tag) => (
                  <Tag key={tag._id} color="geekblue">
                    {tag.name}
                  </Tag>
                ))}
              </div>
              <div className="list-item-attribute">Rating: {activity.averageRating}</div>
              <div className="list-item-attribute">Special Discounts: {activity.specialDiscounts || "N/A"}</div>
              <div className="list-item-attribute">Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</div>

              {/* Delete button for advertisers */}
              <Button 
                  type="danger" 
                  style={{
                    backgroundColor: "#f08080", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "5px", 
                    padding: "8px 12px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleDeleteActivity(activity._id)}
              >
              Delete
            </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvertiserActivitiesPage;
