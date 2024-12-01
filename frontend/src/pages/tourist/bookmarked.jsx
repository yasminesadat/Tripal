import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { getBookmarkedEvents } from "../../api/TouristService"
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import { Link } from "react-router-dom";

export default function BookmarkedEvents() {

    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
    const images = [
        "https://viatour-reactjs.ibthemespro.com/img/tourCards/3/4.png",

      ];
  
  useEffect(() => {
    const fetchBookmarked = async () => {
      try {
        const data = await getBookmarkedEvents();
        setBookmarkedEvents(data);
      } catch (error) {
        console.error("Error fetching bookmarked events:", error);
      }
    };
    fetchBookmarked();
  }, []);

  return (
    <div>
    <TouristHeader />
    <section className="layout-pb-xl" style={{ marginTop: "80px"}}>
    
      <div className="container" >
        <div className="row">
          

          <div className="col-xl-9 col-lg-8" >
            <div className="row y-gap-30 pt-30">
            {bookmarkedEvents?.map((event, index) => (
                <div className="col-12" key={index}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                    <img src={images[0]} alt="Tour Image" />

                    </div>

                    <div className="tourCard__content">
                      <div className="tourCard__location">
                        <i className="icon-pin"></i>
                        {event.type === "activity" ? event.location : event.pickupLocation}
                      </div>

                      <h3 className="tourCard__title mt-5">
                        <span>{event.title}</span>
                      </h3>

                      <p className="tourCard__text mt-5">{event.description}</p>

                      {/* <div className="row x-gap-20 y-gap-5 pt-30">
                        {elm.features?.map((elm2, i2) => (
                          <div key={i2} className="col-auto">
                            <div className="text-14 text-accent-1">
                              <i className={`${elm2.icon} mr-10`}></i>
                              {elm2.name}
                            </div>
                          </div>
                        ))}
                      </div> */}
                    </div>

                    <div className="tourCard__info">
                      <div>
                        <div className="d-flex items-center text-14">
                          <i className="icon-clock mr-10"></i>
                          {event.type === "activity" 
                                ? event.date 
                                    ? new Date(event.date).toLocaleDateString() 
                                    : "No date available"
                                : event.timeline && event.timeline.length > 0 
                                    ? new Date(event.timeline[0].date).toLocaleDateString() 
                                    : "No date available"}
                        </div>

                        <div >
                          
                          <div className="d-flex items-center">
                            <span className="text-20 fw-500 ">
                              price: {event.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="button -outline-accent-1 text-accent-1">
                      <Link to={event.type === "activity" 
                                    ? `/activity/${event._id}` 
                                    : `/itinerary/${event._id}`}>
                            View Details
                            <i className="icon-arrow-top-right ml-10"></i>
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
    <FooterThree />

    </div>
  );
}
