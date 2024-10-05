import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdvertiserActivities } from "../../api/ActivityService";
import ActivitiesList from "../../components/tourist/ActivitiesList.js";


const AdvertiserActivitiesPage = () => {
  const { id } = useParams(); // Get advertiserId from the URL params
  console.log("Advertiser ID:", id);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="advertiser-activities-page">
      <h1>Your Activities </h1>
      <ActivitiesList activities={activities} />
    </div>
  );
};

export default AdvertiserActivitiesPage;