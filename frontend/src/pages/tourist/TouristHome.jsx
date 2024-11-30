import React, { useState, useRef, useEffect } from "react";
import { Button, Divider, Space, Tour } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import ArticlesOne from "@/components/homes/articles/ArticlesOne";
import Banner9 from "@/components/homes/banners/Banner9";
import BannerEight from "@/components/homes/banners/BannerEight";
import BrandsThree from "@/components/homes/brands/BrandsThree";
import DestinationsFive from "@/components/homes/destinations/DestinationsFive";
import Hero5 from "@/components/homes/heros/Hero5";
import TestimonialsFour from "@/components/homes/testimonials/TestimonialsFour";
import TourTypesTwo from "@/components/homes/tourTypes/TourTypesTwo";
import FeaturedTrips from "@/components/homes/tours/FeaturedTrips";
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Tripal",
};

export default function TouristHome() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(localStorage.getItem('currentStep') || 0);
  const navigate = useNavigate();
  const location = useLocation();

  const refHeader = useRef(null);
  const refFlights = useRef(null);
  const refHotels = useRef(null);
  const refActivities = useRef(null); 
  const refItineraries = useRef(null);
  const refHisPlaces = useRef(null);
  const refProducts = useRef(null);

  const steps = [
    {
      title: "Welcome to TriPal!",
      description: "This is your guide to hassle-free travel planning, from start to finish.",
      target: () => refHeader.current,
    },
    {
      title: "Book your flight.",
      description: "Let's plan-e your next getaway.",
      target: () => refFlights.current,
      // onNext: () => navigate("/tourist/book-flight"),
    },
    {
      title: "Book a hotel.",
      description: "Where are you gonna stay?",
      target: () => refHotels.current,
      // onNext: () => navigate("/hotel2"),
    },
    {
      title: "Book an activity.",
      description: "Explore activities you can do there.",
      target: () => refActivities.current,
      onNext: () => {
        localStorage.setItem('currentStep', 3); 
        navigate("/upcoming-activities", { state: { fromTour: true } });
      }
    },
    {
      title: "Book an itinerary.",
      description: "Check out pre-designed programs.",
      target: () => refItineraries.current,
      // onNext: () => navigate("/upcoming-itineraries"),
    },
    {
      title: "View historical places.",
      description: "Get to know where to go.",
      target: () => refHisPlaces.current,
      // onNext: () => navigate("/upcoming-itineraries"),
    },
    {
      title: "Buy a product.",
      description: "Get yourself & your loved ones a souvenir.",
      target: () => refProducts.current,
      // onNext: () => navigate("/upcoming-itineraries"),
    },
  ];

  useEffect(() => {
    if (location.pathname === '/upcoming-activities') {
      setCurrentStep(4); 
      localStorage.setItem('currentStep', 4);  // Persist step
    }
  }, [location.pathname]);

  return (
    <>
      <MetaComponent meta={metadata} />
      <main>
        <TouristHeader 
          refHeader={refHeader} 
          setOpen={setOpen} 
          refFlights={refFlights} 
          refHotels={refHotels} 
          refActivities={refActivities}
          refItineraries={refItineraries}
          refHisPlaces={refHisPlaces}
          refProducts={refProducts}
        />
        <Tour 
          open={open} 
          onClose={() => setOpen(false)} 
          steps={steps} 
          currentStep={currentStep}
          onStepChange={step => {
            setCurrentStep(step); 
            localStorage.setItem('currentStep', step); 
          }}
        />
        <Divider />
        <Hero5 />
        <BrandsThree />
        <TourTypesTwo />
        <FeaturedTrips />
        <BannerEight />
        <DestinationsFive />
        <TestimonialsFour />
        <ArticlesOne />
        <Banner9 />
        <FooterThree />
      </main>
    </>
  );
}
