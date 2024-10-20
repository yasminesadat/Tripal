import React from "react";
import TouristNavBar from "../../components/navbar/TouristNavBar";
import Footer from "../../components/common/Footer";

const TouristHome = () => {

  return (
    <div className="page-container2">
      <TouristNavBar />
      <h1 style={{ fontSize: "48px", textAlign: "center", margin: "200px 0" }}>
        Tourist
      </h1>
      <Footer />
    </div>

  );
};

export default TouristHome;
