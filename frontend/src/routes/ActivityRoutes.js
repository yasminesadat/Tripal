import ActivityForm from "../components/advertiser/ActivityForm";
import AdvertiserActivitiesPage from "../pages/advertiser/AdvertiserActivities"

const activityRoutes = [
  { path: "/create-activity", element: <ActivityForm isUpdate={false} /> },
  { path: "/update-activity/:id", element: <ActivityForm isUpdate={true}/> },
  { path: "/advertiser-activity/:id", element: <AdvertiserActivitiesPage /> },  //advertiser view his own activity
  { path: "/delete-activity/:id", element: <AdvertiserActivitiesPage /> },


];

export default activityRoutes;     