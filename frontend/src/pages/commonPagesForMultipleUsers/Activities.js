import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  
import { viewUpcomingActivities, getAdvertiserActivities } from "../../api/ActivityService";
import UpcomingActivities from "../../components/activity/UpcomingActivities";
import ActivitySearch from "../../components/activity/ActivitySearch";
import ActivityFilter from "../../components/activity/ActivityFilter";
import ActivitySort from "../../components/activity/ActivitySort";
import GuestNavBar from "../../components/navbar/GuestNavBar";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import Footer from "../../components/common/Footer";
import { message } from "antd";
import { getConversionRate } from "../../api/ExchangeRatesService"; 
import { bookResource } from "../../api/BookingService";
import { touristId } from "../../IDs";
import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar";
import AdvertiserActivities from "../../components/activity/AdvertiserActivities";

// advertiser activities or tourist upcoming activities 
const Activities = ({isAdvertiser, isTourist}) => {
    const { id } = useParams();
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
        let response;
        if (isAdvertiser) {
          response = await getAdvertiserActivities(id);
        } else if (isTourist) {
          response = await viewUpcomingActivities();
        }
  
        console.log(response); 
  
        const activitiesData = response?.data || response || [];
        setActivities(activitiesData);
        setFilteredActivities(activitiesData);
      } catch (err) {
        const errorMessage = err?.response?.data?.error || err?.message || "Error fetching activities";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    fetchActivities();
  }, [id, isAdvertiser, isTourist]);
  

  const handleSearch = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = activities.filter((activity) => {
      const hasMatchingTitle = activity.title.toLowerCase().includes(lowerCaseSearchTerm);
      const hasMatchingCategory =
        activity.category &&
        activity.category.Name &&
        activity.category.Name.toLowerCase().includes(lowerCaseSearchTerm);
      const hasMatchingTags =
        activity.tags &&
        activity.tags.some(
          (tag) => tag.name && tag.name.toLowerCase().includes(lowerCaseSearchTerm)
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

  const handleBookActivity = async ({ activityId, touristId }) => {
    if (!touristId) {
      message.warning("Please sign up or log in to book an activity.");
      return;
    }
    try {
      await bookResource('activity', activityId, touristId);
            message.success("Activity booked successfully!");
    } catch (error) {
      console.log("Error details:", error);
      
      if (error.response) {
        const { status } = error.response;
        if (status === 400) 
          message.warning(error.response.data.error);             
        else 
          message.error(error.response.data.error);  
      } else {
        message.error("Network error. Please try again later.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
        { isTourist ? (touristId ? <TouristNavBar onCurrencyChange={setCurrency} /> : <GuestNavBar />) : null}
        { isAdvertiser ? <AdvertiserNavBar/> : null }
        {isTourist && <div className="page-title">Upcoming Activities</div>}
        
        { isTourist ? <ActivitySearch onSearch={handleSearch} /> : null}
        
        { isTourist ? 
            <div className="filter-sort-list">
                <div className="filter-sort">
                    <ActivityFilter onFilter={handleFilter} />
                    <ActivitySort onSort={handleSort} />
                </div>
                <UpcomingActivities activities={filteredActivities} curr={currency} onBook={handleBookActivity} book={"diana"} page={"upcoming"}/>
            </div>
            :
            <AdvertiserActivities />
        }
        
        <Footer />
    </div>
  );
};

export default Activities;