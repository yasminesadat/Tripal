import React, { useEffect, useState } from "react";
import { getTouristActivities } from "../../api/TouristService";
import UpcomingActivitiesList from "../../components/activity/UpcomingActivities";
import ActivitySearch from "../../components/activity/ActivitySearch";
import ActivityFilter from "../../components/activity/ActivityFilter";
import ActivitySort from "../../components/activity/ActivitySort";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import Footer from "../../components/common/Footer";
import { message } from "antd";
import { touristId } from "../../IDs";
import { getConversionRate } from "../../api/ExchangeRatesService"; 
import { cancelResource } from '../../api/BookingService';

const BookedActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("EGP");
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchCurrency = async () => {
      const curr = sessionStorage.getItem("currency");
      if (curr) {
        setCurrency(curr);
        await fetchExchangeRate(curr);
      }
    };
    fetchCurrency();
  }, []);

  const fetchExchangeRate = async (curr) => {
    try {
      const rate = await getConversionRate(curr);
      setExchangeRate(rate);
    } catch (error) {
      message.error("Failed to fetch exchange rate.");
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getTouristActivities(touristId);
        const activitiesWithAvgRatings = response.map(activity => ({
          ...activity,
          averageRating: calculateAverageRating(activity.ratings),
        }));

        setActivities(activitiesWithAvgRatings);
        setFilteredActivities(activitiesWithAvgRatings);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching activitiesssss");
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
      const activityBudget = activity.price * exchangeRate; 
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
        aValue = a.price * exchangeRate;
        bValue = b.price * exchangeRate;
      } else if (field === "ratings") {
        aValue = a.averageRating;
        bValue = b.averageRating;
      }

      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
    setFilteredActivities(sortedActivities);
  };

  const handleCancelActivity = async ({ activityId, touristId }) => {
    try {
        console.log('Canceling activity', activityId, touristId);
        await cancelResource('activity', activityId, touristId);
        console.log("The activity booking has been canceled successfully!");
        message.success("Activity booking canceled successfully!");
        setActivities(prevActivities =>
            prevActivities.filter(activity => activity._id !== activityId)
          );
          setFilteredActivities(prevFiltered =>
            prevFiltered.filter(activity => activity._id !== activityId)
          );
    } catch (error) {
        console.log("Error details:", error);
        message.error('Failed to cancel booking');
        
    };
    };  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div class="page-container2">
      <TouristNavBar />
      <div class="page-title">Booked Activities</div>
      <ActivitySearch onSearch={handleSearch} />
      <div class="filter-sort-list">
        <div class="filter-sort">
          <ActivityFilter onFilter={handleFilter} />
          <ActivitySort onSort={handleSort} />
        </div>
        <UpcomingActivitiesList activities={filteredActivities} curr={currency} onCancel ={handleCancelActivity} cancel={"diana"} />
      </div>
      <Footer />
    </div>
  );
};

export default BookedActivitiesPage;