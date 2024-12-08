import { Link } from "react-router-dom";
import React from "react";

export default function BannerEight() {
  return (
    <>
      <section className="cta -type-2">
        <div className="cta__bg">
          <img src="/img/cta/7/bg.png" alt="image" />

          <div className="cta__image">
            <img src="/img/cta/7/1.jpg" alt="image" />
            <img src="/img/cta/7/shape.svg" alt="image" />
            <img src="/img/cta/7/shape2.svg" alt="image" />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-7">
              <div className="cta__content">
                <h2
                  data-aos="fade-up"
                  data-aos-delay=""
                  className="text-40 md:text-30  lh-13"
                >
                  Search for a flight{" "}
                  <br className="lg:d-none" />
                  to your favorite
                  <br className="lg:d-none" />
                  destination
                </h2>

                <p data-aos="fade-up" data-aos-delay="" className="mt-10">
                  What are you waiting for, start exploring now!
                </p>

                <div
                  data-aos="fade-right"
                  data-aos-delay=""
                  className="mt-30 md:mt-20"
                >
                  <button
                    className="custom-button"
                    style={{
                      width: "50%",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <Link to="/tourist/book-flight">
                      Book Now
                      <i className="icon-arrow-top-right ml-10 text-16"></i>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
    .custom-button {
          background-color: var(--color-dark-purple) !important;
          border-color: var(--color-dark-purple)!important;
          color: white !important;
        }
        .custom-button:hover {
          background-color: var(--color-light-purple) !important;
          border-color: var(--color-light-purple) !important;
          color: white !important;
        }
    `}</style>
    </>
  );
}
