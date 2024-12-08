import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdvertiserActivities, getActivityById } from "../../api/ActivityService";
import { message} from 'antd';
import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";
import FooterThree from "@/components/layout/footers/FooterThree";


const AdvertiserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getAdvertiserActivities();
        setActivities(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

 
  
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="advertiser-activities-page">
        <AdvertiserHeader />
      <div class="dashboard__content_content" style={{ backgroundColor: '#f0f0f0', marginTop: "70px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 class="text-30">Activity Management</h1>
      </div>
      <div class="rounded-12 bg-white shadow-2 px-10 pt-10 pb-30 md:px-20 md:pt-20 md:pb-20 mt-20 md:mt-30">
      <div class="row y-gap-30 pt-30">
        <div class="row x-gap-20 y-gap-20 items-center">
        {activities?.map((activity) => (
         <div data-anim-child="slide-up delay-3" class="col-lg-3 col-sm-6 is-in-view">
          <div class="tourCard -type-1 border-1 rounded-12 px-20 py-20 -hover-shadow" key={activity._id}>
            <div class="row x-gap-20 y-gap-20 items-center" style={{
                      height: "210px",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}>
            <div class="col">
              
                <div class="text-18 lh-15 fw-500 mt-5">{activity.title}</div>
                <div class="d-flex items-center" style={{ maxWidth: '400px', }}> <i class="icon-pin mr-5"></i> {activity.location}</div>
                <div class="text-right md:text-left">
                  <i class="icon-clock mr-5"></i>
                  <div class="text-14">Date: {new Date(activity.date).toLocaleDateString()}</div>
                  <div class="text-14">Time: {activity.time}</div>
                </div>
              
            </div>
            </div>
                <button
                 className="button -md -dark-1 bg-accent-1 text-white"
                 style={{
                  padding: "6px 12px", 
                  fontSize: "12px",    
                }}
                 onClick={async () => {
                    try {
                      // Fetch the full activity details
                      const id=activity._id;
                      const response = await getActivityById(id);
                      console.log(response)
                      navigate(`/advertiser-view-activity/${id}`, { state: { activity: response.data } });
                      console.log(response.data)
                    } catch (error) {
                      message.error(error.response.data.error)
                      console.error("Failed to load activity details:", error);
                    }
                  }}
                >
                  View More
                  <i className="icon-arrow-top-right text-16 ml-10"></i>

                </button>
            
          </div>
          </div>
        ))}
      </div>

    </div>
    </div>
    </div>
    <FooterThree />

    </div>
  );
};

export default AdvertiserActivities;