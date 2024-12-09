import Calender from "@/components/common/dropdownSearch/Calender";
import Location from "@/components/common/dropdownSearch/Location";
import TourType from "@/components/common/dropdownSearch/TourType";
import SearchBar from "@/components/tourist/HomeSearchBar";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero5() {
  const [currentActiveDD, setCurrentActiveDD] = useState("");
  const [location, setLocation] = useState("");
  const [calender, setCalender] = useState("");
  const [tourType, setTourType] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setCurrentActiveDD("");
  }, [location, calender, tourType, setCurrentActiveDD]);
  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setCurrentActiveDD("");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="hero -type-5">
      <div className="hero__bg">
        <img src="/img/hero/5/bg.png" alt="background" />
      </div>

      <div className="hero__image">
        <img
          src="/img/hero/5/shape.svg"
          style={{ height: "100%", width: "auto" }}
          alt="image"
        />
        <img src="/img/hero/5/wallpaper.jpg" alt="image" />
        <img src="/img/hero/5/mobile.svg" alt="image" />
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="hero__content">
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="hero__subtitle mb-10"
              >
                Search, compare and book stays all over the world.
              </div>

              <h1
                data-aos="fade-up"
                data-aos-delay="300"
                className="hero__title"
              >
                Search Your Next
                <br className="md:d-none" />
                <span className="pink">Holiday</span>
              </h1>

              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="hero__filter mt-60 md:mt-30"
              >
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
