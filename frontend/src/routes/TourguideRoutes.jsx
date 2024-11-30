import TourGuideHome from "../pages/tourguide/TourGuideHome";
import ItineraryCreationPage from "../pages/tourguide/ItineraryCreation";
import Itineraries from "../pages/commonPagesForMultipleUsers/Itineraries";
// import TourGuideForm from "../pages/tourguide/TourGuideCreateProfile";
// import TourGuideProfile from "../pages/tourguide/TourGuideViewProfile";

const tourguideRoutes = [
  { path: "/tourguide", element: <TourGuideHome /> },
  { path: "/tourguide/create", element: <ItineraryCreationPage /> },
  {path: "/my-itineraries",element: <Itineraries />,},
//   { path: "/tourguide/profile", element: <TourGuideProfile /> },
//   { path: "/tourguide/update", element: <TourGuideForm /> },
];

export default tourguideRoutes;