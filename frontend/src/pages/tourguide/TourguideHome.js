import React from "react";
import TourguideNavBar from "../../components/tourguide/TourguideNavBar";
import Footer from "../../components/Footer";

const TourguideHome = () => {
  return (
    <div className="page-container2">
      <TourguideNavBar />
      <main className="content2">
        <h1>Welcome to the Tour guide Home Page</h1>
      </main>
      <Footer />
    </div>
  );
};

export default TourguideHome;
