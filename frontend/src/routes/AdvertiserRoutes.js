import AdvertiserHome from "../pages/advertiser/AdvertiserHome"; 
import AdvertiserProfile from "../pages/advertiser/AdvertiserProfile";
import AdvertiserForm from "../pages/advertiser/AdvertiserProfileForm"; 
import CreateActivity from "../pages/advertiser/CreateActivity";
import AdvertiserActivitiesPage from "../pages/advertiser/AdvertiserActivities"
import ActivityForm from "../components/advertiser/ActivityForm"; 

const advertiserRoutes = [
  { path: "/advertiser", element: <AdvertiserHome /> }, 
  { path: "/advertiser/:id", element: <AdvertiserProfile /> },
  { path: "/update-advertiser/:id", element: <AdvertiserForm isUpdate={true} /> }, 
  { path: "/create-advertiser", element: <AdvertiserForm isUpdate={false} /> }, 
  { path: "/create-activity", element: <CreateActivity isUpdate={false}/> },
  { path: "/update-activity/:id", element: <ActivityForm isUpdate={true}/> },
  { path: "/advertiser-activity/:id", element: <AdvertiserActivitiesPage /> },  //advertiser view his own activity
  { path: "/delete-activity/:id", element: <AdvertiserActivitiesPage /> },
  
];

export default advertiserRoutes;
