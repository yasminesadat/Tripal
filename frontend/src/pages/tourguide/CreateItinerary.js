import React from 'react';
import ItineraryForm from "../../components/tourguide/ItineraryForm";
import TourguideNavBar from "../../components/tourguide/TourguideNavBar";
import  Footer  from '../../components/Footer';

const CreateItinerary = () => {
  
  return (
    <div>
      <TourguideNavBar />
      <br />
      <ItineraryForm />
      <Footer />
    </div>
  );
};
  
export default CreateItinerary;