import React from "react";
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";

const AdvertiserHome = () => {
  const advertiserId = "6701cb215e553adca0a5c62a";

  return (
    <div>
      <AdvertiserNavBar advertiserId={advertiserId} />
    </div>
  );
};

export default AdvertiserHome;
