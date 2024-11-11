import React from "react";
import TourguideNavBar from "../../components/navbar/TourguideNavBar";
import Footer from "../../components/common/Footer";

const TourguideHome = () => {
  return (
    <div className="page-container2">
      <TourguideNavBar />
      <main className="content2">
        <h1 style={{ fontSize: "48px", textAlign: "center", margin: "200px 0" }}>
          Tour-Guide
        </h1>
      </main>
      <Footer />
    </div>
  );
};

export default TourguideHome;
