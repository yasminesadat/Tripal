
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import defaultPlace from '../../assets/images/defaultPlace.png';

import { Link } from "react-router-dom";

export default function TourSlider({ historicalPlaces }) {
    const addresses = historicalPlaces.map((place) => {
        const addressFields = place.location.address.split(',').map(part => part.trim());
        const city = addressFields[addressFields.length - 2] || '';
        const country = addressFields[addressFields.length - 1] || '';
        return `${city}, ${country}`;
    })
    return (
        <section className="layout-pt-xl layout-pb-xl">
            <div className="container">
                <div className="row">
                    <div className="col-auto">
                        <h2 className="text-30">You might also like...</h2>
                    </div>
                </div>

                <div className="relative pt-40 sm:pt-20">
                    <div
                        className="overflow-hidden pb-5 js-section-slider"
                        data-gap="30"
                        data-slider-cols="xl-4 lg-3 md-2 sm-1 base-1"
                        data-nav-prev="js-slider1-prev"
                        data-nav-next="js-slider1-next"
                    >
                        <div className="swiper-wrapper">
                            <Swiper

                                spaceBetween={10}
                                className="w-100"
                                pagination={{
                                    el: ".pbutton1",
                                    clickable: true,
                                }}
                                navigation={{
                                    prevEl: ".js-slider10-prev",
                                    nextEl: ".js-slider10-next",
                                }}
                                modules={[Navigation, Pagination]}
                                breakpoints={{
                                    500: {
                                        slidesPerView: 1,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                    1200: {
                                        slidesPerView: 4,
                                    },
                                }}
                            >
                                {historicalPlaces.map((elm, i) => (
                                    <SwiperSlide key={i}>
                                        <Link
                                            to={`/tour-single-1/${elm._id}`}
                                            className="tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow"
                                        >
                                            <div className="tourCard__header">
                                                <div className="tourCard__image ratio ratio-28:20"
                                                >
                                                    <img
                                                        src={defaultPlace}
                                                        alt={"defaultImage"}
                                                        className="img-ratio rounded-12"

                                                    />
                                                </div>

                                                {/* <button className="tourCard__favorite">
                          <i className="icon-heart"></i>
                        </button> */}
                                            </div>

                                            <div className="tourCard__content px-10 pt-10">
                                                <div className="tourCard__location d-flex items-center text-13 text-light-2">
                                                    <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
                                                    {addresses[i]}
                                                </div>

                                                <h3 className="tourCard__title text-16 fw-500 mt-5">
                                                    <span>{elm.name}</span>
                                                </h3>

                                                {/* <div className="tourCard__rating d-flex items-center text-13 mt-5"> */}
                                                {/* <div className="d-flex x-gap-5">
                            <Stars star={elm.rating} />
                          </div> */}

                                                {/* <span className="text-dark-1 ml-10">
                            {elm.rating} ({elm.ratingCount})
                          </span> */}
                                                {/* </div> */}

                                                {/* <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10"> */}
                                                {/* <div className="d-flex items-center">
                            <i className="icon-clock text-16 mr-5"></i>
                            {elm.duration}
                          </div> */}

                                                {/* <div>
                            From{" "}
                            <span className="text-16 fw-500">${elm.price}</span>
                          </div> */}
                                                {/* </div> */}
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    <div className="navAbsolute">
                        <button className="navAbsolute__button bg-white js-slider10-prev">
                            <i className="icon-arrow-left text-14"></i>
                        </button>

                        <button className="navAbsolute__button bg-white js-slider10-next">
                            <i className="icon-arrow-right text-14"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section >
    );
}