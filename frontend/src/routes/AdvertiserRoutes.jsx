import AdvertiserHome from "../pages/advertiser/AdvertiserHome";
import AdvertiserProfile from "../pages/advertiser/AdvertiserProfile";
import CreateActivity from "../pages/advertiser/CreateActivity";
import AdvertiserActivities from "../components/activity/AdvertiserActivities";
import ActivityForm from "../components/activity/CreateActivityForm";
import AdvertiserActivityDetails from "../pages/advertiser/advertiserViewActivity";

const advertiserRoutes = [
  { path: "/advertiser/activities", element: <AdvertiserActivities /> },
  { path: "/advertiser", element: <AdvertiserHome /> },
  { path: "/advertiser/profile", element: <AdvertiserProfile /> },
  { path: "/create-activity", element: <CreateActivity isUpdate={false} /> },
  { path: "/update-activity/:id", element: <ActivityForm isUpdate={true} /> },
  { path: "/advertiser-view-activity/:id", element: <AdvertiserActivityDetails /> }
];

export default advertiserRoutes;