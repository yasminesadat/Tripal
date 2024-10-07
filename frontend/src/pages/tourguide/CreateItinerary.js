import React, { useEffect, useState } from 'react';
import ItineraryForm from "../../components/tourguide/ItineraryForm";
import TourguideNavBar from "../../components/tourguide/TourguideNavBar";

const CreateItinerary = () => {
  
  return (
    <div>
      <TourguideNavBar />
      <h1>Create an Itinerary</h1>
      <br />
      <ItineraryForm />
    </div>
  );
};
  
  export default CreateItinerary;
  