import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Components/Sidebar.jsx";
import { speedFeatures } from "./Components/TourFilteringOptions.jsx";
import Pagination from "./Components/pagination.jsx";
import MetaComponent from "@/components/common/MetaComponent";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import img3 from "../BookingHotels/Components/HotelsImages/hotel2.jpeg"
import img5 from "../BookingHotels/Components/HotelsImages/hotel8.jpeg"
import img1 from "../BookingHotels/Components/HotelsImages/hotel7.jpeg"
import img6 from "../BookingHotels/Components/HotelsImages/hotel3.jpeg"
import img2 from "../BookingHotels/Components/HotelsImages/hotel5.jpeg"
import img4 from "../BookingHotels/Components/HotelsImages/hotel4.jpeg"


import { useParams } from "react-router-dom";
//import styles from "../../components/style.module.css";



import {  getHotels } from "../../api/HotelService.js";


export default function TourList1() {
  const [ setDdActives] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const dropDownContainer = useRef();
  const {cityCode,dates1,dates2}  = useParams();
  
  const images=[img1,img2,img3,img4,img5,img6]

 
 


const fetchTourData = async () => {
   try {
       // console.log("hiiiiiiiiii",cityCode);
      const response = await getHotels(cityCode);
  
  
      const transformedData = response.map((hotel,index) => ({
        id: hotel.hotelId,
        title: hotel.name,
        location: hotel.iataCode, 
        description: "A beautiful hotel for a remarkable holiday.", 
       price: 10000, // Default or mock price
       fromPrice: 15000, // Default starting price
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

  const metadata = {
    title: "Home || Tripal - Travel Agency",
};

  return (
    <>
    <MetaComponent meta={metadata} />
    <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content">
        <section className="layout-pb-xl">
      <div className="container" style={{placeItems:'center',marginRight:"10px"}}>
          <div className="col-xl-9 col-lg-8" style={{}}>
            
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

                      <button className="button -outline-accent-1 text-accent-1" onClick={() => window.location.href = `/hotelDetails/${cityCode}/${elm.title}/${elm.id}/${dates1}/${dates2}`} >
                        {/* <Link to={`/hotelDetails/${cityCode}/${elm.title}/${elm.id}/${dates1}/${dates2}`}> */}
                          View Details
                          <i className="icon-arrow-top-right ml-10"></i>
                        {/* </Link> */}
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
    </section>        </main>
        <FooterThree />
    </div>
</>
  );
}
