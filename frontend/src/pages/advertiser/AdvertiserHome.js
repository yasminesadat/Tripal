import React from "react";
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";

const AdvertiserHome = () => {
  const advertiserId = "6701cc555e553adca0a5c640";

  return (
    <div>
      <AdvertiserNavBar advertiserId={advertiserId} />
    </div>
  );
};

export default AdvertiserHome;
