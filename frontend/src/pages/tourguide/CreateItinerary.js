import React from 'react';
import ItineraryForm from "../../components/itinerary/CreateItineraryForm";
import TourguideNavBar from "../../components/navbar/TourguideNavBar";
import  Footer  from '../../components/common/Footer';

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