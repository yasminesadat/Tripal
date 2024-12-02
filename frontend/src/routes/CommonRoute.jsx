import ActivityDetailsPage from "@/pages/tourist/ActivityDetails";
import ItineraryDetailsPage from "@/pages/tourist/ItineraryDetails";
import HistoricalPlaces from "../pages/commonPagesForMultipleUsers/HistoricalPlaces"
import HistoricalPlacesDetails from"../pages/commonPagesForMultipleUsers/HistoricalPlacesDetails"
const commonRoutes = [
    { path: "/activity/:activityId", element: <ActivityDetailsPage /> },
    { path: "/itinerary/:itineraryId", element: <ItineraryDetailsPage />},
    { path: "/historicalPlaces", element: <HistoricalPlaces  /> },
    { path: "/historical-places/:id", element: <HistoricalPlacesDetails /> },
];
export default commonRoutes;