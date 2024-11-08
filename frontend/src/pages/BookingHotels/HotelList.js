import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Components/Sidebar.jsx";
import { speedFeatures } from "./Components/TourFilteringOptions.js";
import Pagination from "./Components/pagination.jsx";
import img3 from "../BookingHotels/Components/HotelsImages/hotel2.jpeg"
import img5 from "../BookingHotels/Components/HotelsImages/hotel8.jpeg"
import img1 from "../BookingHotels/Components/HotelsImages/hotel7.jpeg"
import img6 from "../BookingHotels/Components/HotelsImages/hotel3.jpeg"
import img2 from "../BookingHotels/Components/HotelsImages/hotel5.jpeg"
import img4 from "../BookingHotels/Components/HotelsImages/hotel4.jpeg"


import  { DateObject } from "react-multi-date-picker";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';
//import styles from "../../components/style.module.css";



import { Link } from "react-router-dom";
import { getHotelPrices, getHotels } from "../../api/HotelService.js";


export default function TourList1() {
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const dropDownContainer = useRef();
  const {cityCode}  = useParams();

  const images=[img1,img2,img3,img4,img5,img6]



const fetchTourData = async () => {
   try {
       // console.log("hiiiiiiiiii",cityCode);
      const response = await getHotels(cityCode);
  
  
      const transformedData = response.map((hotel,index) => ({
        id: hotel.hotelId,
        title: hotel.name,
        location: hotel.iataCode, 
        description: "A beautiful hotel in the heart of Paris", 
       price: 100, // Default or mock price
       fromPrice: 120, // Default starting price
       features: [
        {
          icon:`icon-price-tag`,
          name: "Best Price Guarantee",
        },
        {
          icon: `icon-check`,
          name: "Free Cancellation",
        },
      ],
        imageSrc: images[index % images.length], 
        // featured: true,
        // badgeText: "Best Seller",
        duration: "1 night", // Default duration
      }));
  
      // Set the transformed data to the component's state
      setFilteredHotels(transformedData);
      }
      catch (error) {
      console.error("Error fetching tours:", error);
    }
  }; 

 

  // Fetch tours on component mount and when sortOption changes
  useEffect(() => {
    fetchTourData();
  }, [cityCode]);

  // Close dropdown on outside click
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
              <Sidebar />
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
                    <Sidebar />
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
                      {sortOption ? sortOption : "Featured"}
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
              {filteredHotels.map((elm, i) => (
                <div className="col-12" key={i}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                      <img src={elm.imageSrc} alt="image" />

                      {elm.ho && (
                        <div className="tourCard__badge">
                          <div className="bg-accent-1 rounded-12 text-white lh-11 text-13 px-15 py-10">
                            {elm.id}
                          </div>
                        </div>
                      )}

                      {/* {elm.featured && (
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
                        {elm.location}
                      </div>

                      <h3 className="tourCard__title mt-5">
                        <span>{elm.title}</span>
                      </h3>

                      <div className="d-flex items-center mt-5">
                        {/* <div className="d-flex items-center x-gap-5">
                          <Stars star={elm.rating} font={12} />
                        </div> */}

                        {/* <div className="text-14 ml-10">
                          <span className="fw-500">{elm.rating}</span> (
                          {elm.ratingCount})
                        </div> */}
                      </div>

                      <p className="tourCard__text mt-5">{elm.description}</p>

                      <div className="row x-gap-20 y-gap-5 pt-30">
                        {elm.features?.map((elm2, i2) => (
                          <div key={i2} className="col-auto">
                            <div className="text-14 text-accent-1">
                              <i className={`${elm2.icon} mr-10`}></i>
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
                          {elm.duration}
                        </div>

                        <div className="tourCard__price">
                          <div>EGP {elm.fromPrice}</div>

                          <div className="d-flex items-center">
                            From{" "}
                            <span className="text-20 fw-500 ml-5">
                              EGP {elm.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="button -outline-accent-1 text-accent-1">
                        <Link to={`/hotelDetails/${elm.title}/${elm.id}`}>
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
