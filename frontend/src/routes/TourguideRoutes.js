import TourguideItineraries from "../pages/tourguide/TourguideItineraries";
import TourguideHome from "../pages/tourguide/TourguideHome";

const TourguideRoutes = [
    {path: "/tourguide", element: <TourguideHome />},
    {path: "/tourguide-itineraries", element: <TourguideItineraries />},
];

export default TourguideRoutes;
