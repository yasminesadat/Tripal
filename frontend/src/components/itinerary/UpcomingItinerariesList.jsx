import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Stars from "../common/Stars";
import Pagination from "@/components/activity/Pagination";
import {message } from "antd";

import { getUserData } from "@/api/UserService";
import { viewUpcomingItineraries } from "@/api/ItineraryService";
import { getAdminItineraries} from "@/api/AdminService";

export default function ItinerariesList({
  searchTerm,
  book,
  onCancel,
  cancel,
  curr = "EGP",
  page,
}) {
  //#region States
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef();

  const [userRole, setUserRole] = useState(null);

  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState(itineraries);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ratingFilter, setRatingFilter] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000000]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itinerariesPerPage = 2;

  const sortOptions = [
    { label: "Price: Low to High", field: "price", order: "asc" },
    { label: "Price: High to Low", field: "price", order: "desc" },
    { label: "Rating: Low to High", field: "ratings", order: "asc" },
    { label: "Rating: High to Low", field: "ratings", order: "desc" },
  ];

  const errorDisplayed = useRef(false);
  //#endregion

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {
          setUserRole(response.data.role);
        } else if (response.data.message === "No token found.") {
          setUserRole("Guest");
        } else {
          if (!errorDisplayed.current) {
            message.error(response.data.message);
            errorDisplayed.current = true;
          }
        }
      } catch (error) {
        if (!errorDisplayed.current) {
          message.error("Failed to fetch user data.");
          errorDisplayed.current = true;
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        let response;
        if (userRole === "Tourist" || userRole === "Guest") {
          response = await viewUpcomingItineraries();
        } else if (userRole === "Admin") {
          response = await getAdminItineraries();
          console.log(userRole)
        }
        const itinerariesData = Array.isArray(response?.data)
          ? response?.data
          : [];
        setItineraries(itinerariesData);
        setFilteredItineraries(itinerariesData);
      } catch (err) {
        const errorMessage =
          err?.response?.data?.error ||
          err?.message ||
          "Error fetching activities";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchItineraries();
    }
  }, [userRole]);

  useEffect(() => {
    const filtered = itineraries.filter((itinerary) => {
      const itineraryStartDate = new Date(itinerary.startDate);
      const itineraryRating = itinerary.averageRating;
      // const activityCategory = itinerary.category.Name.toLowerCase();
      const activityPrice = itinerary.price;

      const isDateValid =
        !startDate ||
        !endDate ||
        (itineraryStartDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
          itineraryStartDate <= new Date(endDate.setHours(23, 59, 59, 999)));

      const isRatingValid =
        ratingFilter.length === 0 ||
        ratingFilter.some((rating) => itineraryRating >= rating);

      const isCategoryValid =1
        // selectedCategories.length === 0 ||
        // selectedCategories.some(
        //   (cat) => cat.toLowerCase() === activityCategory
        // );

      const isPriceValid =
        activityPrice >= priceRange[0] && activityPrice <= priceRange[1];

      const isSearchValid =
        itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return (
        isDateValid &&
        isRatingValid &&
        isCategoryValid &&
        isPriceValid &&
        isSearchValid
      );
    });

    setFilteredItineraries(filtered);
  }, [
    startDate,
    endDate,
    itineraries,
    ratingFilter,
    selectedCategories,
    priceRange,
    searchTerm,
  ]);

  useEffect(() => {}, [filteredItineraries]);

  const handleSort = (field, order) => {
    const sortedActivities = [...filteredItineraries].sort((a, b) => {
      let aValue, bValue;

      if (field === "price") {
        // aValue = a.price * exchangeRate;
        // bValue = b.price * exchangeRate;
        aValue = a.price;
        bValue = b.price;
      } else if (field === "ratings") {
        aValue = a.averageRating;
        bValue = b.averageRating;
      }

      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
    setFilteredItineraries(sortedActivities);
  };

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const indexOfLastItinerary = currentPage * itinerariesPerPage;
  const indexOfFirstItinerary = indexOfLastItinerary - itinerariesPerPage;
  const currentItineraries = filteredItineraries.slice(
    indexOfFirstItinerary,
    indexOfLastItinerary
  );

  const navigate = useNavigate();
  const handleRedirect = (itineraryId) => {
    if (userRole === "Tourist"|| userRole === "Admin")
      navigate(`/itinerary/${itineraryId}`, { state: { page } });
    else navigate(`/itineraries/${itineraryId}`, { state: { page } });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');  
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
    const year = d.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  return (
    <section className="layout-pb-xl">
      <div className="container">
        <div className="row">
          {userRole !== "Admin" && (
            <div className="col-xl-3 col-lg-4">
              {(userRole === "Tourist" || userRole === "Guest") && (
                <>
                  <div className="lg:d-none">
                    <Sidebar
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      setRatingFilter={setRatingFilter}
                      setCategoryFilter={setSelectedCategories}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                    />
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
                          <Sidebar
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            setRatingFilter={setRatingFilter}
                            setCategoryFilter={setSelectedCategories}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div
            className={`col-xl-${userRole === "Admin" ? "12" : "9"} col-lg-${
              userRole === "Admin" ? "12" : "8"
            }`}
          >
            <div className="row y-gap-5 justify-between">
              <div className="col-auto">
                <div>
                  {loading ? (
                    <span>Loading results...</span>
                  ) : (
                    <span>{filteredItineraries?.length} results</span>
                  )}
                </div>
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
                    {sortOptions.map((elm, i) => (
                      <div
                        onClick={() => {
                          setSortOption(elm.label);
                          handleSort(elm.field, elm.order);
                          setDdActives(false);
                        }}
                        key={i}
                        className="dropdown__item"
                        data-value="fast"
                      >
                        {elm.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row y-gap-30 pt-30">
              {currentItineraries?.map((elm, i) => (
                <div className="col-12" key={i}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                      <img
                        src="/img/activities/touristsGroup1.jpg"
                        alt="image"
                      />

                      {/* {elm.badgeText && (
                        <div className="tourCard__badge">
                          <div className="bg-accent-1 rounded-12 text-white lh-11 text-13 px-15 py-10">
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
                      )} */}

                      <div className="tourCard__favorite">
                        <button className="button -accent-1 size-35 bg-white rounded-full flex-center">
                          <i className="icon-heart text-15"></i>
                        </button>
                      </div>
                    </div>

                    <div className="tourCard__content">
                      <div className="tourCard__location">
                        <i className="icon-pin"></i>
                        {/* {elm.location} */}
                      </div>

                      <h3 className="tourCard__title mt-5">
                        <span>{elm.title}</span>
                      </h3>

                      <div className="d-flex items-center mt-5">
                        <div className="d-flex items-center x-gap-5">
                          <Stars star={elm.averageRating} font={12} />
                        </div>

                        <div className="text-14 ml-10">
                          <span className="fw-500">
                            {elm.averageRating.toFixed(2)}
                          </span>
                          ({elm.totalRatings})
                        </div>
                      </div>

                      <p className="tourCard__text mt-5">
                        {truncateText(elm.description, 50)}
                      </p>

                      <div className="row x-gap-20 y-gap-5 pt-30">
                        {/* {elm.tags?.map((elm2, i2) => (
                          <div key={i2} className="col-auto">
                            <div className="text-14 text-accent-1">
                              {elm2.name}
                            </div>
                          </div>
                        ))} */}
                      </div>
                    </div>

                    <div className="tourCard__info">
                      <div>
                        <div className="d-flex items-center text-14">
                          <i className="icon-calendar mr-10"></i> 
                          {formatDate(elm.startDate)}
                        </div>
                        <div className="d-flex items-center text-14">
                          <i className="icon-clock mr-10"></i>
                          {/* {elm.time} */}
                        </div>

                        <div className="tourCard__price">
                          {elm.price}
                          <div className="d-flex items-center">
                            <span className="text-20 fw-500 ml-5"></span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="button -outline-accent-1 text-accent-1"
                        onClick={() => handleRedirect(elm._id)}
                      >
                        View Details
                        <i className="icon-arrow-top-right ml-10"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-center flex-column mt-60">
              {filteredItineraries?.length > itinerariesPerPage && (
                <Pagination
                  totalItems={filteredItineraries.length}
                  itemsPerPage={itinerariesPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}