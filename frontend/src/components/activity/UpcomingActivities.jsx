import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { speedFeatures } from "./tourFilteringOptions";
import Stars from "../common/Stars";
import Pagination from "../common/Pagination";
import { Link } from "react-router-dom";
import { Tag, message } from "antd";
// import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

import { getUserData } from "@/api/UserService";
import { viewUpcomingActivities, getAdvertiserActivities, getAllActivities } from "@/api/ActivityService";
import AdvertiserActivities from "@/components/activity/AdvertiserActivities";
import { getAdminActivities, flagActivity } from "@/api/AdminService";

export default function ActivitiesList({
  // activities,
  book,
  onCancel,
  cancel,
  curr = "EGP",
  page,
  onAdminFlag
}) {
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef();

  const [userRole, setUserRole] = useState(null); 
  const [userId, setUserId] = useState(null); 

  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState(activities);

  const [startDate, setStartDate] = useState(null); 
  const [endDate, setEndDate] = useState(null); 
  const [ratingFilter, setRatingFilter] = useState([]);  
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter state

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        let response;
        if (userRole === "Advertiser") {
          response = await getAdvertiserActivities();
        } else if (userRole === "Tourist") {
          response = await viewUpcomingActivities();
        } else if (userRole === "Admin") {
          response = await getAdminActivities();
        } else {
          response = await getAllActivities();
        }
        const activitiesData = Array.isArray(response?.data) ? response?.data : [];
        console.log(activitiesData)
        setActivities(activitiesData);
        setFilteredActivities(activitiesData); 
      } catch (err) {
        const errorMessage = err?.response?.data?.error || err?.message || "Error fetching activities";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchActivities();
    }
  }, [userRole]);  

  useEffect(() => {
    const filtered = activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      const activityRating = activity.averageRating;
      const activityCategory = activity.category; 
  
      // Date Filter
      const isDateValid =
        !startDate || !endDate ||
        (activityDate >= (new Date(startDate.setHours(0, 0, 0, 0))) &&
          activityDate <= (new Date(endDate.setHours(23, 59, 59, 999))));
  
      // Rating Filter
      const isRatingValid =
        ratingFilter.length === 0 || ratingFilter.some((rating) => activityRating >= rating);
  
      // Category Filter
      const isCategoryValid = !categoryFilter || activityCategory === categoryFilter;
  
      // Combine all filters
      return isDateValid && isRatingValid && isCategoryValid;
    });
  
    setFilteredActivities(filtered);
  }, [startDate, endDate, activities, ratingFilter, categoryFilter]);
  
  
  // useEffect(() => {
  //   console.log("Filtered Activities: ", filteredActivities);
  // }, [filteredActivities]);

  // const handleSort = (field, order) => {
  //   const sortedActivities = [...activities].sort((a, b) => {
  //     let aValue, bValue;
  
  //     if (field === "price") {
  //       aValue = a.price * exchangeRate;
  //       bValue = b.price * exchangeRate;
  //     } else if (field === "ratings") {
  //       aValue = a.averageRating;
  //       bValue = b.averageRating;
  //     }
  
  //     return order === "asc" ? aValue - bValue : bValue - aValue;
  //   });
  //   setFilteredActivities(sortedActivities);
  // };

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="lg:d-none">
            <Sidebar setStartDate={setStartDate} setEndDate={setEndDate} setRatingFilter={setRatingFilter} setCategoryFilter={setCategoryFilter} />
            </div>

            <div className="accordion d-none mb-30 lg:d-flex js-accordion">
              <div
                className={`accordion__item col-12 ${
                  sidebarActive ? "is-active" : ""
                } `}
              >
                <button
                  className="accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1 rounded-12"
                  onClick={() => setSidebarActive((pre) => !pre)}
                >
                  <i className="icon-sort-down mr-10 text-16"></i>
                  Filter
                </button>

                <div
                  className="accordion__content"
                  style={sidebarActive ? { maxHeight: "2000px" } : {}}
                >
                  <div className="pt-20">
                    <Sidebar setStartDate={setStartDate} setEndDate={setEndDate} setRatingFilter={setRatingFilter} setCategoryFilter={setCategoryFilter} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="row y-gap-5 justify-between">
              <div className="col-auto">
                <div>1362 results</div>
              </div>

              <div ref={dropDownContainer} className="col-auto">
                <div
                  className={`dropdown -type-2 js-dropdown js-form-dd ${
                    ddActives ? "is-active" : ""
                  } `}
                  data-main-value=""
                >
                  <div
                    className="dropdown__button js-button"
                    onClick={() => setDdActives((pre) => !pre)}
                  >
                    <span>Sort by: </span>
                    <span className="js-title">
                      {sortOption ? sortOption : ""}
                    </span>
                    <i className="icon-chevron-down"></i>
                  </div>

                  <div className="dropdown__menu js-menu-items">
                    {speedFeatures.map((elm, i) => (
                      <div
                        onClick={() => {
                          setSortOption((pre) => (pre == elm ? "" : elm));
                          setDdActives(false);
                        }}
                        key={i}
                        className="dropdown__item"
                        data-value="fast"
                      >
                        {elm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row y-gap-30 pt-30">
              {filteredActivities?.map((elm, i) => (
                <div className="col-12" key={i}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                      <img src="/img/activities/touristsGroup1.jpg" alt="image" />

                      {elm.badgeText && (
                        <div className="tourCard__badge">
                          <div className="bg-accent-1 rounded-12 text-white lh-11 text-13 px-15 py-10">
                            {/* {elm.badgeText} */}
                            {elm.specialDiscounts}
                          </div>
                        </div>
                      )}

                      {elm.featured && (
                        <div className="tourCard__badge">
                          <div className="bg-accent-2 rounded-12 text-white lh-11 text-13 px-15 py-10">
                            FEATURED
                          </div>
                        </div>
                      )}

                      <div className="tourCard__favorite">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center">
                          <i className="icon-heart text-15"></i>
                        </button>
                      </div>
                    </div>

                    <div className="tourCard__content">
                      <div className="tourCard__location">
                        <i className="icon-pin"></i>
                        {elm.location}
                      </div>

                      <h3 className="tourCard__title mt-5">
                        <span>{elm.title}</span>
                      </h3>

                      <div className="d-flex items-center mt-5">
                        <div className="d-flex items-center x-gap-5">
                          <Stars star={elm.rating} font={12} />
                        </div>

                        <div className="text-14 ml-10">
                          <span className="fw-500">{elm.averageRating.toFixed(2)}</span> 
                          {/* ({elm.ratingCount}) */}
                        </div>
                      </div>

                      <p className="tourCard__text mt-5">{elm.description}</p>

                      <div className="row x-gap-20 y-gap-5 pt-30">
                        {elm.tags?.map((elm2, i2) => (
                          <div key={i2} className="col-auto">
                            <div className="text-14 text-accent-1">
                              {/* <i className={`${elm2.icon} mr-10`}></i> */}
                              {elm2.name}                          
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="tourCard__info">
                      <div>
                        <div className="d-flex items-center text-14">
                          <i className="icon-clock mr-10"></i>
                          {elm.time}
                        </div>

                        <div className="tourCard__price">
                        {elm.price}
                          <div className="d-flex items-center">
                            <span className="text-20 fw-500 ml-5">
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="button -outline-accent-1 text-accent-1">
                        <Link to={`/activity-details/${elm.id}`}>
                          View Details
                          <i className="icon-arrow-top-right ml-10"></i>
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-center flex-column mt-60">
              <Pagination />

              <div className="text-14 text-center mt-20">
                Showing results 1-30 of 1,415
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
