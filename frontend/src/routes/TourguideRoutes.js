import TourguideHome from "../pages/tourguide/TourguideHome";
import TourGuideForm from "../pages/tourguide/TourGuideCreateProfile";
import TourGuideProfile from '../pages/tourguide/TourGuideViewProfile'
import CreateItinerary from '../pages/tourguide/CreateItinerary'
import UpcomingItineraries from "../pages/commonPagesForMultipleUsers/UpcomingItineraries";

const TourguideRoutes = [
    { path: "/tourguide", element: <TourguideHome /> },
    { path: "/tourguide/create", element: <TourGuideForm /> },
    { path: "/tourguide/:id", element: <TourGuideProfile /> },
    { path: "/tourguide/update/:id", element: <TourGuideForm /> },
    { path: "/tourguide-itineraries", element: <UpcomingItineraries isTourguide={"isTourguide"} /> },
    { path: "/create-itinerary", element: <CreateItinerary /> },
];

export default TourguideRoutes;