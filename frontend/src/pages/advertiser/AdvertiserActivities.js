import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAdvertiserActivities, deleteActivity } from "../../api/ActivityService";
import { Tag, Button, notification } from 'antd';
import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar";

const AdvertiserActivitiesPage = () => {
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
      <AdvertiserNavBar />
      <div class="dashboard__content_content" style={{ backgroundColor: '#f0f0f0' }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 class="text-30">Your Activities</h1>
      </div>
      <div class="rounded-12 bg-white shadow-2 px-10 pt-10 pb-30 md:px-20 md:pt-20 md:pb-20 mt-20 md:mt-30">
      <div class="row y-gap-30">
      <div class="col-lg-6">
      <div class="border-1 rounded-12 px-20 py-20">
        <div class="row x-gap-20 y-gap-20 items-center">
        <div class="col">
        {activities.map((activity) => (
          <div class="border-1 rounded-12 px-20 py-20" key={activity._id}>
            <div class="text-18 lh-15 fw-500 mt-5">{activity.title}</div>
            <div class="d-flex items-center"> <i class="icon-pin mr-5"></i> Location: {activity.location}</div>
            <div class="text-right md:text-left">
              <i class="icon-clock mr-5"></i>
              <div class="text-14">Date: {new Date(activity.date).toLocaleDateString()}</div>
              <div class="text-14">Time: {activity.time}</div>
            </div>
          
            <div className="list-item-attributes">
              {/* <div className="list-item-attribute">{activity.description}</div>
              <div className="list-item-attribute">Price: {activity.price}</div>
              <div className="list-item-attribute">Category: {activity.category ? activity.category.Name : "N/A"}</div>
              <div className="list-item-attribute">
                Tags: {activity.tags.map((tag) => (
                  <Tag key={tag._id} color="geekblue">
                    {tag.name}
                  </Tag>
                ))}
              </div>
              <div className="list-item-attribute">Rating: {activity.averageRating}</div>
              <div className="list-item-attribute">Special Discounts: {activity.specialDiscounts || "N/A"}</div>
              <div className="list-item-attribute">Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</div> */}

              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <Button
                  type="default"
                  style={{
                    backgroundColor: "#003DA5",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                  onClick={() => navigate(`/update-activity/${activity._id}`, { state: { activity } })}
                >
                  Update
                </Button>
                <Button
                  type="danger"
                  style={{
                    backgroundColor: "#f08080",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "12px 20px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleDeleteActivity(activity._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div> 
      </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AdvertiserActivitiesPage;
