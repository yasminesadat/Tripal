
import ActivityDetailsPage from "../pages/tourist/ActivityDetails";
import ItineraryDetailsPage from "../pages/tourist/ItineraryDetails";


const guestRoutes = [

    { path: "/activities/:activityId", element: <ActivityDetailsPage /> },
    { path: "/itineraries/:itineraryId", element: <ItineraryDetailsPage /> },


];

export default guestRoutes;
