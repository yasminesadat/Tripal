import TouristHomePage from "../pages/tourist/TouristHomePage";
import UpcomingActivities from "../pages/tourist/UpcomingActivities";
import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
import Itineraries from "../pages/tourist/Itineraries";
import TourguideItineraries from "../pages/tourguide/TourguideItineraries";

const TouristRoutes = [
    { path: "/upcoming-activities", element: <UpcomingActivities /> },
    { path: "/tourist-home", element: <TouristHomePage /> },
    { path: "/historical-places", element: <HistoricalPlaces /> },
    { path: "/itineraries", element: <Itineraries /> },
    {path: "/tour-guide-itineraries", element: <TourguideItineraries />},
];

export default TouristRoutes;



