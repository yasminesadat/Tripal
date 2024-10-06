import React, { useEffect, useState } from 'react';
import ActivityForm from "../../components/advertiser/ActivityForm";
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";

const CreateActivity = () => {
    const advertiserId = "6701cb215e553adca0a5c62a";
  
    return (
      <div>
        <AdvertiserNavBar />
        <ActivityForm />
      </div>
    );
  };
  
  export default CreateActivity;
  