import TouristHomePage from "../pages/tourist/TouristHomePage";
import UpcomingActivities from "../pages/tourist/UpcomingActivities";
import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
import Itineraries from "../pages/tourist/Itineraries";

const TouristRoutes = [
    { path: "/upcoming-activities", element: <UpcomingActivities /> },
    { path: "/tourist-home", element: <TouristHomePage /> },
    { path: "/historical-places", element: <HistoricalPlaces /> },
    { path: "/itineraries", element: <Itineraries /> },
];

export default TouristRoutes;



