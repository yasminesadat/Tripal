import ActivityForm from "../components/advertiser/ActivityForm";
import AdvertiserActivitiesPage from "../pages/advertiser/AdvertiserActivities"

const activityRoutes = [
  { path: "/create-activity", element: <ActivityForm /> },
  { path: "/advertiser-activity/:id", element: <AdvertiserActivitiesPage /> },

];

export default activityRoutes;     