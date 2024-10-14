import React from "react";
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";
import { advertiserId } from "../../IDs";


const AdvertiserHome = () => {

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
