import Calender from "../../components/dropdownSearch/Calender";
import Location from "../../components/dropdownSearch/Location";
import image from "./Components/bg.svg";
import MetaComponent from "@/components/common/MetaComponent";
import FooterThree from "@/components/layout/footers/FooterThree";
import { Tour, message } from 'antd';
import TouristHeader from "@/components/layout/header/TouristHeader";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderSerch from "./Components/SearchEngine";
import { DateObject } from "react-multi-date-picker";
const metadata = {
  title: "Hotels Search || Tripal",
  description: "Hotels Search || Tripal",
};

export default function Hero6() {
  const [currentActiveDD, setCurrentActiveDD] = useState("");
  const [calender, setCalender] = useState("");
  const [tourType, setTourType] = useState("");
  const [selected, setSelected] = useState("");
  const today = new Date();
  const navigate = useNavigate();
  const location = useLocation();
  const refHotelsSearch = useRef(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Enter a city & specify your stay dates",
      description: "Explore the available accommodation options.",
      target: () => refHotelsSearch.current,
      onFinish: () => {
        localStorage.setItem("currentStep", 3);
        setOpen(false);
        navigate("/tourist", { state: { fromTour: true, targetStep: 3 } });
      }
    }
  ]

  useEffect(() => {
    const isFromTour = location.state?.fromTour;

    if (isFromTour && refHotelsSearch.current) {
      refHotelsSearch.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  useEffect(() => {
    const isFromTour = location.state?.fromTour;

    const timer = setTimeout(() => {
      if (isFromTour) {
        setOpen(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  const [dates, setDates] = useState([
    new DateObject().setDay(today.getDate() + 1),
    new DateObject().setDay(today.getDate() + 3),
  ]);

  const validate = () => {
    if (!selected) {
      message.error("Please search for a city.")
    }
    else if (!dates) {
      message.error("Please enter dates.")
    }
    else navigate(`/hotelList/${selected}/${dates[0]}/${dates[1]}`);
  }

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
    <>
      <style jsx global>{`
          /* Base style for all dots */
          /* Try multiple selectors and approaches */
          .ant-tour .ant-tour-indicators > span {
            width: 8px !important;
            height: 8px !important;
            border-radius: 50% !important;
            background: #dac4d0 !important;
          }
          .ant-tour .ant-tour-indicators > span[class*="active"] {
            background: #036264 !important;
          }

          /* Additional specificity */
          .ant-tour-indicators span[role="dot"][aria-current="true"] {
            background: #036264 !important;
          }

          .ant-tour .ant-tour-inner {
            border: 1px solid #5a9ea0;
            box-shadow: 0 4px 12px rgba(3, 98, 100, 0.15);
          }

          .ant-tour .ant-tour-content {
            color: #8f5774;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
            text-rendering: optimizeLegibility !important;
          }

          .ant-tour .ant-tour-title {
            color: #5a9ea0;
            font-weight: 600;
          }

          .ant-tour .ant-tour-close {
            color: #5a9ea0;
            opacity: 0.8;
            transition: opacity 0.2s;
          }

          .ant-tour .ant-tour-close:hover {
            opacity: 1;
            color: #e5f8f8;
          }

          .ant-tour .ant-tour-buttons .ant-btn {
            transition: all 0.3s ease;
          }

          .ant-tour .ant-tour-buttons .ant-btn-primary
          {
            background: #036264;
            border: none;
            color: white;
            transition: all 0.2s;
          }
          .ant-tour .ant-tour-buttons .ant-btn-default{
            background: #036264;
            border: none;
            color: white;
            transition: all 0.2s;
          }
          
          .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
          .ant-tour .ant-tour-buttons .ant-btn-default:hover {
            color:white;
            background: #5a9ea0;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(3, 98, 100, 0.2);
          }
          .ant-tour .ant-tour-arrow-content {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.06);
          }  
        `}</style>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        <TouristHeader />
        <main className="page-content-hana">
          <section className="hero -type-6" style={{ paddingBottom: '500px' }}>
            <div className="hero__bg">
              <img src={image} alt="background" />
            </div>
            <div className="container">
              <div className="row">
                <div className="col-xl-7 col-lg-8">
                  <div className="hero__content">
                    <h1
                      data-aos="fade-up"
                      data-aos-delay="100"
                      className="hero__title"
                    >
                      Luxurious Stay Experiences
                      <br className="md:d-none" />
                      You'll Never <span className="text-accent-1">Forget</span>
                    </h1>

                    <p data-aos="fade-up" data-aos-delay="250" className="mt-20">
                      From cozy rooms to luxury suites, discover your perfect sanctuary
                      <br className="md:d-none" />
                      at our world-class hotel
                    </p>
                    <div
                      // data-aos="fade-up"
                      // data-aos-delay="400"
                      // the option doesn't appear unless you scroll down + it also messes with the guide highlight
                      className="hero__filter mt-60 md:mt-30"
                      ref={refHotelsSearch}
                    >
                      <div
                        ref={dropDownContainer}
                        className="searchForm -type-1 shadow-1 rounded-200"
                      >
                        <div className="searchForm__form" >
                          <div className="searchFormItem js-select-control js-form-dd">
                            <div
                              className="searchFormItem__button"
                              onClick={() =>
                                setCurrentActiveDD((pre) =>
                                  pre === "location" ? "" : "location",
                                )
                              }
                            >
                            </div>

                            <div className="xl:d-none ml-30" >
                              <HeaderSerch selected={selected} setSelected={setSelected} />
                            </div>
                            <Location
                              setLocation={setSelected}
                              active={currentActiveDD === "location"}
                            />
                          </div>

                          <div className="searchFormItem js-select-control js-form-dd js-calendar">
                            <div
                              className="searchFormItem__button"
                              onClick={() =>
                                setCurrentActiveDD((pre) =>
                                  pre === "calender" ? "" : "calender",
                                )
                              }
                            >
                              <div className="searchFormItem__icon size-50 rounded-full border-1 flex-center">
                                <i className="text-20 icon-calendar" onClick={() =>
                                  setCurrentActiveDD("calender",
                                  )
                                }></i>
                              </div>
                              <div className="searchFormItem__content" >
                                <div>
                                  <span className="js-first-date" style={{ cursor: "pointer" }}>
                                    <Calender dates={dates} setDates={setDates}
                                      active={currentActiveDD === "calender"}
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="searchForm__button">
                          <button
                            onClick={validate}
                            className="button -dark-1 size-60 bg-accent-1 rounded-200 text-white"
                          >
                            <i className="icon-search text-16"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <FooterThree />
        </main>
      </div>
    </>
  );
};
