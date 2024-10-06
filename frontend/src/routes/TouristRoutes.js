import TouristHome from "../pages/tourist/TouristHome";
import TouristProfile from "../pages/tourist/TouristProfile";
import UpcomingActivities from "../pages/tourist/UpcomingActivities";
import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
import Itineraries from "../pages/tourist/Itineraries";

const TouristRoutes = [
    { path: "/tourist", element: <TouristHome /> },
    { path: "/upcoming-activities", element: <UpcomingActivities /> },
    { path: "/tourist-profile", element: <TouristProfile /> },
    { path: "/historical-places", element: <HistoricalPlaces /> },
    { path: "/itineraries", element: <Itineraries /> },
];

export default TouristRoutes;



