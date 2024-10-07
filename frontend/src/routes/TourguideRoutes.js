import TourguideItineraries from "../pages/tourguide/TourguideItineraries";
import TourguideHome from "../pages/tourguide/TourguideHome";
import CreateItinerary from "../pages/tourguide/CreateItinerary";

const TourguideRoutes = [
    {path: "/tourguide", element: <TourguideHome />},
    {path: "/create-itinerary", element: <CreateItinerary />},
    {path: "/tourguide-itineraries", element: <TourguideItineraries />},
];

export default TourguideRoutes;
