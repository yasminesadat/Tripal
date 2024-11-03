import React, { useEffect, useState } from "react";
import { viewUpcomingActivities, bookActivity } from "../../api/ActivityService";
import UpcomingActivitiesList from "../../components/activity/UpcomingActivitiesList";
import ActivitySearch from "../../components/activity/ActivitySearch";
import ActivityFilter from "../../components/activity/ActivityFilter";
import ActivitySort from "../../components/activity/ActivitySort";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import Footer from "../../components/common/Footer";
import { message } from "antd";

const UpcomingActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await viewUpcomingActivities();
        const activitiesWithAvgRatings = response.data.map(activity => ({
          ...activity,
          averageRating: calculateAverageRating(activity.ratings),
        }));

        setActivities(activitiesWithAvgRatings);
        setFilteredActivities(activitiesWithAvgRatings);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const handleSearch = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = activities.filter((activity) => {
      const hasMatchingTitle = activity.title
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
      const hasMatchingCategory =
        activity.category &&
        activity.category.Name &&
        activity.category.Name.toLowerCase().includes(lowerCaseSearchTerm);
      const hasMatchingTags =
        activity.tags &&
        activity.tags.some(
          (tag) =>
            tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm)
        );

      return hasMatchingTitle || hasMatchingCategory || hasMatchingTags;
    });
    setFilteredActivities(results);
  };

  const handleFilter = (filters) => {
    const { startDate, endDate, budgetMin, budgetMax, category, rating } = filters;

    const filtered = activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      const activityBudget = activity.price;
      const activityCategory = activity.category;
      const activityRating = activity.averageRating;

      const isDateValid =
        (!startDate || activityDate >= new Date(startDate)) &&
        (!endDate || activityDate <= new Date(endDate));
      const isBudgetValid =
        (!budgetMin || activityBudget >= budgetMin) &&
        (!budgetMax || activityBudget <= budgetMax);
      const isCategoryValid =
        !category ||
        (activityCategory && 
          activityCategory.Name &&
          activityCategory.Name.toLowerCase() === category.toLowerCase());
      const isRatingValid =
        !rating || (activityRating >= rating);

      return isDateValid && isBudgetValid && isCategoryValid && isRatingValid;
    });

    setFilteredActivities(filtered);
  };


  const handleSort = (field, order) => {
    const sortedActivities = [...filteredActivities].sort((a, b) => {
      let aValue, bValue;

      if (field === "price") {
        aValue = a.price;
        bValue = b.price;
      } else if (field === "ratings") {
        aValue = a.averageRating;
        bValue = b.averageRating;
      }

      if (order === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    setFilteredActivities(sortedActivities);
  };

  const handleBookActivity = async ({ activityId, touristId }) => {
    try {
      console.log('Booking', activityId, touristId);
        const response = await bookActivity(activityId, touristId);
        message.success(response.message);
    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    message.error(error.response.data.error); // Activity or tourist not found
                    break;
                case 400:
                    message.success(error.response.data.error); // Booking closed or already booked
                    break;
                default:
                    message.error("An unexpected error occurred. Please try again."); // General error
            }
        } else {
            message.error("Failed to book activity. Please check your network and try again.");
        }
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div class="page-container">
      <TouristNavBar />
      <div class="page-title">Upcoming Activities</div>
      <ActivitySearch onSearch={handleSearch} />
      <div class="filter-sort-list">
        <div class="filter-sort">
          <ActivityFilter onFilter={handleFilter} />
          <ActivitySort onSort={handleSort} />
        </div>
        <UpcomingActivitiesList activities={filteredActivities} onBook ={handleBookActivity} />
      </div>
      <Footer />
    </div>
  );
};

export default UpcomingActivitiesPage;