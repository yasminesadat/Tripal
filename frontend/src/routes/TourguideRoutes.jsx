import TourguideItineraries from "../pages/tourguide/TourguideItineraries"; //dont delete for god sake
import TourguideHome from "../pages/tourguide/TourguideHome";
import TourGuideForm from "../pages/tourguide/TourGuideCreateProfile";
import TourGuideProfile from "../pages/tourguide/TourGuideViewProfile";
import CreateItinerary from "../pages/tourguide/CreateItinerary";
import UpcomingItineraries from "../pages/commonPagesForMultipleUsers/UpcomingItineraries";

const tourguideRoutes = [
  { path: "/tourguide", element: <TourguideHome /> },
  { path: "/tourguide/create", element: <TourGuideForm /> },
  { path: "/tourguide/profile", element: <TourGuideProfile /> },
  { path: "/tourguide/update", element: <TourGuideForm /> },
  {
    path: "/tourguide-itineraries",
    element: <UpcomingItineraries isTourguide={"isTourguide"} />,
  },
  { path: "/create-itinerary", element: <CreateItinerary /> },
];

export default tourguideRoutes;
