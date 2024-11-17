import AdvertiserHome from "../pages/advertiser/AdvertiserHome";
import AdvertiserProfile from "../pages/advertiser/AdvertiserProfile";
import AdvertiserForm from "../pages/advertiser/AdvertiserProfileForm";
import CreateActivity from "../pages/advertiser/CreateActivity";
import Activities from "../pages/commonPagesForMultipleUsers/Activities";
import ActivityForm from "../components/activity/CreateActivityForm";
import AdvertiserActivityDetails from "../pages/advertiser/advertiserViewActivity";


const advertiserRoutes = [
  { path: "/advertiser", element: <AdvertiserHome /> },
  { path: "/advertiser/profile", element: <AdvertiserProfile /> },
  {
    path: "/update-advertiser",
    element: <AdvertiserForm isUpdate={true} />,
  },
  { path: "/create-advertiser", element: <AdvertiserForm isUpdate={false} /> },
  { path: "/create-activity", element: <CreateActivity isUpdate={false} /> },
  { path: "/update-activity/:id", element: <ActivityForm isUpdate={true} /> },
  { path: "/advertiser/activities/:id", element: <Activities isAdvertiser={true} /> },
  { path: "/delete-activity/:id", element: <Activities isAdvertiser={true} /> },
  { path: "/advertiser-view-activity/:id", element: <AdvertiserActivityDetails /> }
];

export default advertiserRoutes;
