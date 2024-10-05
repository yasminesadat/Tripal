import ActivityForm from "../components/ActivityForm";
import AdvertiserActivitiesPage from "../pages/AdvertiserActivities"

const activityRoutes = [
  { path: "/create-activity", element: <ActivityForm /> },
  { path: "/advertiser-activity/:id", element: <AdvertiserActivitiesPage /> },

];

export default activityRoutes;     