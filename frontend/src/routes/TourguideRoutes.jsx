import TourGuideHome from "../pages/tourguide/TourGuideHome";
import ItineraryCreationPage from "../pages/tourguide/ItineraryCreation";
// import TourGuideForm from "../pages/tourguide/TourGuideCreateProfile";
// import TourGuideProfile from "../pages/tourguide/TourGuideViewProfile";
// import UpcomingItineraries from "../pages/commonPagesForMultipleUsers/UpcomingItineraries";

const tourguideRoutes = [
  { path: "/tourguide", element: <TourGuideHome /> },
  { path: "/tourguide/create", element: <ItineraryCreationPage /> },
//   { path: "/tourguide/profile", element: <TourGuideProfile /> },
//   { path: "/tourguide/update", element: <TourGuideForm /> },
//   {path: "/tourguide-itineraries",element: <UpcomingItineraries isTourguide={"isTourguide"} />,},
];

export default tourguideRoutes;