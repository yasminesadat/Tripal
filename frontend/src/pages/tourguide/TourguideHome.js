import React from "react";
import TourguideNavBar from "../../components/tourguide/TourguideNavBar";
import ItinerariesForm from '../../components/tourguide/ItineraryForm.js';

const TourguideHome = () => {
  return (
    <div>
        <TourguideNavBar />
        <h1>Create your Itinerary</h1>
        <ItinerariesForm />
    </div>
  );
};

export default TourguideHome;
