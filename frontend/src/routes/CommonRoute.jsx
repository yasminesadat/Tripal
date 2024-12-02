import ActivityDetailsPage from "@/pages/tourist/ActivityDetails";
import ItineraryDetailsPage from "@/pages/tourist/ItineraryDetails";
import HistoricalPlaces from "../pages/commonPagesForMultipleUsers/HistoricalPlaces"
const commonRoutes = [
    { path: "/activity/:activityId", element: <ActivityDetailsPage /> },
    { path: "/itinerary/:itineraryId", element: <ItineraryDetailsPage />},
    { path: "/historicalPlaces", element: <HistoricalPlaces state={false} /> },
];
export default commonRoutes;