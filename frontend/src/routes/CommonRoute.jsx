import ActivityDetailsPage from "@/pages/tourist/ActivityDetails";
import ItineraryDetailsPage from "@/pages/tourist/ItineraryDetails";

const commonRoutes = [
    { path: "/activity/:activityId", element: <ActivityDetailsPage /> },
    { path: "/itinerary/:itineraryId", element: <ItineraryDetailsPage />},
];
export default commonRoutes;