import React, { useEffect, useState } from "react";
import { viewUpcomingActivities, getAdvertiserActivities, getAllActivities } from "../../api/ActivityService";
import UpcomingActivities from "../../components/activity/UpcomingActivities";
import ActivitySearch from "../../components/activity/ActivitySearch";
import ActivityFilter from "../../components/activity/ActivityFilter";
import ActivitySort from "../../components/activity/ActivitySort";
// import GuestNavBar from "../../components/navbar/GuestNavBar";
// import TouristNavBar from "../../components/navbar/TouristNavBar";
// import AdminNavBar from "../../components/navbar/AdminNavBar";
//import Footer from "../../components/common/Footer";
import { message } from "antd";
import { getConversionRate } from "../../api/ExchangeRatesService";
// import { touristId, touristId } from "../../IDs";
//import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar";
import AdvertiserActivities from "../../components/activity/AdvertiserActivities";
import { getAdminActivities, flagActivity } from "@/api/AdminService";
import { getTouristTags, getTouristCategories } from "@/api/TouristService";
import { getUserData } from "@/api/UserService";

// advertiser activities or tourist upcoming activities 
const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("EGP");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
          setUserId(response.data.id); 
        } else {
          message.error(response.data.message); 
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  // i think checking on the userRole is enough just leaving them rn for dependencies or just use them instead of userRole===blabla
  const isAdvertiser = (userRole==='Advertiser');
  const isTourist = (userRole==='Tourist');

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
        if (userRole === 'Advertiser') {
          response = await getAdvertiserActivities();
        } else if (userRole === 'Tourist') {
          response = await viewUpcomingActivities();
        } else if (userRole === 'Admin') {
          response = await getAdminActivities();
        }
        else { response = await getAllActivities(); }
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
  }, [userId, isAdvertiser, isTourist]);


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

  const handleForYouFilter = async () => {
    try {
      const tags = await getTouristTags(touristId);
      const categories = await getTouristCategories(touristId);
      
      const filtered = activities.filter((activity) => {
        const hasMatchingTag = activity.tags && tags.some((tag) => 
          activity.tags.some((activityTag) => activityTag.name === tag.name)
        );
        
        const hasMatchingCategory = activity.category && categories.some((category) => 
          activity.category.Name === category.Name
        );
        
        return hasMatchingTag || hasMatchingCategory;
      });
      
      setFilteredActivities(filtered);
    } catch (error) {
      message.error("Failed to fetch 'For You' activities.");
    }
  };
  
  const handleAdminFlag = async (activityId) => {
    try {
      await flagActivity(activityId);
      message.success("Activity has been flagged successfully");
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to flag activity");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="page-container2">
      {/* {userRole === 'Admin' && <AdminNavBar />} */}
      {/* {isTourist ? (touristId ? <TouristNavBar onCurrencyChange={setCurrency} /> : <GuestNavBar />) : null} */}
      {/* {isAdvertiser ? <AdvertiserNavBar /> : null} */}

      {userRole === 'Tourist' && <div className="page-title">Upcoming Activities</div>}

      {userRole === 'Admin' && <div className="page-title">View All Activities</div>}

      {isTourist ? <ActivitySearch onSearch={handleSearch} /> : null}

      {userRole === 'Tourist' && (
        <button onClick={handleForYouFilter} className="for-you-button">
          For You
        </button>
      )}

      {(userRole === 'Tourist' || userRole == 'Admin') &&
        <div className="filter-sort-list">
          {isTourist && <div className="filter-sort">
            <ActivityFilter onFilter={handleFilter} />
            <ActivitySort onSort={handleSort} />
          </div>}
          <UpcomingActivities activities={filteredActivities}
            curr={currency}
            book={"diana"}
            page={"upcoming"}
            onAdminFlag={handleAdminFlag}
          />
        </div>}

      {userRole === 'Advertiser' && <AdvertiserActivities activities={activities} />}


      {/* <Footer /> */}
    </div>
  );
};

export default Activities;