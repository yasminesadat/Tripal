import { destinationCards } from "@/data/destinations";

import { Link } from "react-router-dom";
import React from "react";

export default function DestinationsFive() {
  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2
              data-aos="fade-up"
              data-aos-delay=""
              className="text-30 md:text-24"
            >
              Trending Destinations
            </h2>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-30 md:x-gap-10 md:y-gap-10 pt-40 sm:pt-20"
        >
          {destinationCards.map((elm, i) => (
            <div key={i} className="w-1/5 lg:w-1/3 md:w-1/2">
              <div
                className="featureCard -type-4 -hover-image-scale"
              >
                <div className="featureCard__image ratio ratio-3:4 -hover-image-scale__image rounded-12">
                  <img src={elm.imgSrc} alt="image" className="img-ratio" />
                </div>

                <div className="featureCard__content text-center">
                  <h4 className="text-20 fw-500 text-white">{elm.title}</h4>
                  <div className="text-14 lh-14 text-white">
                    {elm.tourCount}+ Tours
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
