import React, { useEffect, useState } from 'react';
import ActivityForm from "../../components/activity/CreateActivityForm";
import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";


const CreateActivity = () => {

  return (
    <div>
      <AdvertiserHeader />
      <ActivityForm />
    </div>
  );
};

export default CreateActivity;
