import { useState, useRef, useEffect } from "react";
import { Divider, Tour } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import BannerEight from "@/components/homes/banners/BannerEight";
import BrandsThree from "@/components/homes/brands/BrandsThree";
import DestinationsFive from "@/components/homes/destinations/DestinationsFive";
import Hero5 from "@/components/homes/heros/Hero5";
import TestimonialsFour from "@/components/homes/testimonials/TestimonialsFour";
import TourTypesTwo from "@/components/homes/tourTypes/TourTypesTwo";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal",
};

export default function TouristHome() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const refHeader = useRef(null);
  const refFlights = useRef(null);
  const refHotels = useRef(null);
  const refActivities = useRef(null);
  const refItineraries = useRef(null);
  const refHisPlaces = useRef(null);
  const refProducts = useRef(null);
  const refFinish = useRef(null);

  const steps = [
    {
      title: "Welcome to TriPal!",
      description:
        "This is your guide to hassle-free travel planning, from start to finish.",
      target: () => {
        refHeader.current;
        localStorage.setItem("currentStep", 0);
      },
    },
    {
      title: "Book your flight",
      description: "Let's plan-e your next getaway.",
      target: () => refFlights.current,
      onNext: () => {
        localStorage.setItem("currentStep", 1);
        navigate("/tourist/book-flight", { state: { fromTour: true } });
      },
    },
    {
      title: "Book a hotel",
      description: "Where are you gonna stay?",
      target: () => refHotels.current,
      onNext: () => {
        localStorage.setItem("currentStep", 2);
        navigate("/hotel2", { state: { fromTour: true } });
      },
    },
    {
      title: "Book an activity",
      description: "Explore activities you can do there.",
      target: () => refActivities.current,
      onNext: () => {
        localStorage.setItem("currentStep", 3);
        navigate("/upcoming-activities", { state: { fromTour: true } });
      },
    },
    {
      title: "Book an itinerary",
      description: "Check out pre-designed programs.",
      target: () => refItineraries.current,
      onNext: () => {
        localStorage.setItem("currentStep", 4);
        navigate("/upcoming-itineraries", { state: { fromTour: true } });
      },
    },
    {
      title: "View historical places",
      description: "Get to know where to go.",
      target: () => refHisPlaces.current,
      onNext: () => {
        localStorage.setItem("currentStep", 5);
        navigate("/historicalPlaces", { state: { fromTour: true } });
      },
    },
    {
      title: "Buy a product",
      description: "Get yourself & your loved ones a souvenir.",
      target: () => refProducts.current,
      onNext: () => {
        localStorage.setItem("currentStep", 6);
        navigate("/tourist/view-products", { state: { fromTour: true } });
      },
    },
    {
      title: "That's it!",
      description:
        "Now you can start your journey for an unforgettable experience.",
      target: () => refFinish.current,
      onFinish: () => {
        localStorage.setItem("currentStep", 0);
        setOpen(false);
        navigate("/tourist", { state: { fromTour: false, targetStep: 0 } });
      },
    },
  ];

  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");

    if (storedStep === "6") {
      localStorage.setItem("currentStep", 0);
      setCurrentStep(0);
    } else if (storedStep) {
      setCurrentStep(parseInt(storedStep, 10));
    } else {
      setCurrentStep(0);
    }
  }, []);

  useEffect(() => {
    const isFromTour = location.state?.fromTour;
    const targetStep = location.state?.targetStep;

    if (isFromTour && targetStep !== undefined) {
      setCurrentStep(targetStep);
      localStorage.setItem("currentStep", targetStep);

      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      const storedStep = localStorage.getItem("currentStep");
      if (storedStep) {
        setCurrentStep(parseInt(storedStep, 10));
      } else {
        setCurrentStep(0);
      }
    }
  }, [location]);

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    localStorage.setItem("currentStep", newStep);
  };

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
        .ant-tour {
          z-index: 2000 !important;
        }

        .ant-tour-mask {
          z-index: 1999 !important;
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

        .ant-tour .ant-tour-buttons .ant-btn-primary {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        .ant-tour .ant-tour-buttons .ant-btn-default {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
        .ant-tour .ant-tour-buttons .ant-btn-default:hover {
          color: white;
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
      <main>
        <TouristHeader
          setOpen={setOpen}
          refFlights={refFlights}
          refHotels={refHotels}
          refActivities={refActivities}
          refItineraries={refItineraries}
          refHisPlaces={refHisPlaces}
          refProducts={refProducts}
          homepage={"homepage"}
        />
        <Tour
          open={open}
          onClose={() => setOpen(false)}
          steps={steps}
          current={currentStep}
          onChange={handleStepChange}
        />
        <Divider />
        <Hero5 tourist={true} />
        <BrandsThree />
        <TourTypesTwo />
        <br></br>
        <br></br>
        <BannerEight tourist={true} />
        <DestinationsFive />
        <TestimonialsFour />
        <FooterThree />
      </main>
    </>
  );
}
