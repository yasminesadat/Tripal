import TourGuideHome from "../pages/tourguide/TourGuideHome";
import ItineraryCreationPage from "../pages/tourguide/ItineraryCreation";
import Itineraries from "../pages/commonPagesForMultipleUsers/Itineraries";
import TourGuideProfile from "../pages/tourguide/TourGuideViewProfile";

const tourguideRoutes = [
  { path: "/tourguide", element: <TourGuideHome /> },
  { path: "/tourguide/create", element: <ItineraryCreationPage /> },
  {path: "/my-itineraries",element: <Itineraries />,},
  { path: "/tourguide/profile", element: <TourGuideProfile /> },
];

export default tourguideRoutes;