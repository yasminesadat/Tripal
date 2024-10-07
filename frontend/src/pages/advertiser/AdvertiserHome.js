import React from "react";
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";

const AdvertiserHome = () => {
  const advertiserId = "6701cc555e553adca0a5c640";

  return (
    <div>
      <AdvertiserNavBar />
      <h1 style={{ fontSize: "48px", textAlign: "center", margin: "200px 0" }}>
        Advertiser
      </h1>
    </div>
  );
};

export default AdvertiserHome;
