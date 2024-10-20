import React, { useEffect, useState } from 'react';
import ActivityForm from "../../components/activity/CreateActivityForm";
import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar";

const CreateActivity = () => {
    
    return (
      <div>
        <AdvertiserNavBar />
        <ActivityForm />
      </div>
    );
  };
  
  export default CreateActivity;
  